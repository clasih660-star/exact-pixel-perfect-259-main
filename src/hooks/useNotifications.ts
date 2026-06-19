import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/hooks/useUserRole";
import {
  ensureAutomatedNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRecord,
} from "@/lib/notifications.functions";

export type NotificationsResult = {
  notifications: NotificationRecord[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markRead: (notificationId: string) => void;
  markAllRead: () => void;
  isMarkingRead: boolean;
};

type NotificationsQueryData = {
  notifications: NotificationRecord[];
  unreadCount: number;
};

export function useNotifications(): NotificationsResult {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const listFn = useServerFn(listNotifications);
  const ensureFn = useServerFn(ensureAutomatedNotifications);
  const markReadFn = useServerFn(markNotificationRead);
  const markAllFn = useServerFn(markAllNotificationsRead);

  const queryKey = useMemo(() => ["notifications", user?.id ?? "demo"], [user?.id]);
  const shouldRefetchAfterMutation = Boolean(user?.id && !user.id.startsWith("demo-"));

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      await ensureFn();
      return listFn();
    },
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (!user?.id || user.id.startsWith("demo-")) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, user?.id]);

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markReadFn({ data: { notification_id: notificationId } }),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationsQueryData>(queryKey);
      const readAt = new Date().toISOString();

      queryClient.setQueryData<NotificationsQueryData>(queryKey, (current) => {
        if (!current) return current;
        const notifications = current.notifications.map((notification) =>
          notification.id === notificationId && !notification.readAt
            ? { ...notification, readAt }
            : notification,
        );
        return {
          notifications,
          unreadCount: notifications.filter((notification) => !notification.readAt).length,
        };
      });

      return { previous };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      if (shouldRefetchAfterMutation) queryClient.invalidateQueries({ queryKey });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllFn(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationsQueryData>(queryKey);
      const readAt = new Date().toISOString();

      queryClient.setQueryData<NotificationsQueryData>(queryKey, (current) => {
        if (!current) return current;
        return {
          notifications: current.notifications.map((notification) => ({
            ...notification,
            readAt: notification.readAt ?? readAt,
          })),
          unreadCount: 0,
        };
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      if (shouldRefetchAfterMutation) queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    markRead: (notificationId: string) => markReadMutation.mutate(notificationId),
    markAllRead: () => markAllMutation.mutate(),
    isMarkingRead: markReadMutation.isPending || markAllMutation.isPending,
  };
}
