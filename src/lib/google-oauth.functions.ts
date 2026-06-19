import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAuthCallbackUrl } from "@/lib/auth-verification";
import { getServerConfig } from "@/lib/config.server";

const BeginGoogleOAuthSchema = z.object({
  inviteToken: z.string().min(1).max(512).optional(),
});

function getGoogleOAuthRedirectUrl(inviteToken?: string) {
  const config = getServerConfig();
  const appUrl = (config.appUrl || "").replace(/\/$/, "");

  if (appUrl) {
    const callbackUrl = new URL("/auth/callback", appUrl);
    if (inviteToken) {
      callbackUrl.searchParams.set("invite", inviteToken);
    }
    return callbackUrl.toString();
  }

  return getAuthCallbackUrl(inviteToken);
}

export const beginGoogleOAuth = createServerFn({ method: "POST" })
  .validator((data: unknown) => BeginGoogleOAuthSchema.parse(data))
  .handler(async ({ data }) => {
    return {
      provider: "google" as const,
      redirectTo: getGoogleOAuthRedirectUrl(data.inviteToken),
    };
  });

export { getGoogleOAuthRedirectUrl };
