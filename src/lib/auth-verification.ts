import type { User } from "@supabase/supabase-js";

const PENDING_VERIFICATION_EMAIL_KEY = "klassruum_pending_verification_email";
const PENDING_VERIFICATION_INVITE_KEY = "klassruum_pending_verification_invite";

type AuthUserLike = Pick<User, "app_metadata" | "identities" | "email_confirmed_at" | "email">;

function getSearchParam(name: string): string | null {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(name);
}

export function getAuthCallbackUrl(inviteToken?: string | null): string {
    const query = new URLSearchParams();
    if (inviteToken) {
        query.set("invite", inviteToken);
    }

    const suffix = query.toString() ? `?${query.toString()}` : "";
    if (typeof window === "undefined") {
        return `/auth/callback${suffix}`;
    }

    return `${window.location.origin}/auth/callback${suffix}`;
}

export function rememberPendingVerification(email?: string | null, inviteToken?: string | null) {
    if (typeof window === "undefined") return;

    if (email) {
        window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
    }

    if (inviteToken) {
        window.sessionStorage.setItem(PENDING_VERIFICATION_INVITE_KEY, inviteToken);
    }
}

export function clearPendingVerification() {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
    window.sessionStorage.removeItem(PENDING_VERIFICATION_INVITE_KEY);
}

export function getPendingVerificationEmail(): string | null {
    if (typeof window === "undefined") return null;
    return getSearchParam("email") ?? window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY);
}

export function getPendingVerificationInviteToken(): string | null {
    if (typeof window === "undefined") return null;
    return getSearchParam("invite") ?? window.sessionStorage.getItem(PENDING_VERIFICATION_INVITE_KEY);
}

export function getAuthProviders(user: AuthUserLike): string[] {
    const providers = new Set<string>();

    const appProvider = user.app_metadata?.provider;
    if (typeof appProvider === "string" && appProvider.length > 0) {
        providers.add(appProvider);
    }

    for (const identity of user.identities ?? []) {
        if (identity?.provider) {
            providers.add(identity.provider);
        }
    }

    if (providers.size === 0 && user.email) {
        providers.add("email");
    }

    return [...providers];
}

export function isUserEmailVerified(user: Pick<AuthUserLike, "email_confirmed_at">): boolean {
    return Boolean(user.email_confirmed_at);
}

export function requiresEmailVerification(user: AuthUserLike): boolean {
    const providers = getAuthProviders(user);
    const hasNonEmailProvider = providers.some((provider) => provider !== "email");

    if (hasNonEmailProvider) {
        return false;
    }

    return !isUserEmailVerified(user);
}