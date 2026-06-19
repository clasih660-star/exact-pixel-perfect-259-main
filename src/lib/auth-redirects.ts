import { supabase } from "@/integrations/supabase/client";
import { roleDashboardPath } from "@/lib/route-guards";
import type { UserRole } from "@/lib/types";

type ProfileRoleRecord = {
    role?: UserRole | null;
};

export async function resolvePostAuthPath(userId: string): Promise<string> {
    try {
        const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return "/auth/complete-profile";
        }

        return roleDashboardPath(((data as ProfileRoleRecord).role as UserRole | null | undefined) ?? null);
    } catch {
        return "/auth/complete-profile";
    }
}