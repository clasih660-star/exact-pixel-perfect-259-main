import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Cookie, ShieldCheck, SlidersHorizontal } from "lucide-react";

import {
  COOKIE_SETTINGS_EVENT,
  createConsentRecord,
  DEFAULT_COOKIE_PREFERENCES,
  readCookieConsent,
  saveCookieConsent,
  type CookieConsentPreferences,
  type CookieConsentRecord,
} from "@/lib/cookie-consent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CookiePreferenceRow({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="pr-2">
        <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#64748B]">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={title}
      />
    </div>
  );
}

export function CookieConsentManager() {
  const [isReady, setIsReady] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [consent, setConsent] = useState<CookieConsentRecord | null>(null);
  const [draft, setDraft] = useState<Omit<CookieConsentPreferences, "essential">>({
    preferences: DEFAULT_COOKIE_PREFERENCES.preferences,
    analytics: DEFAULT_COOKIE_PREFERENCES.analytics,
  });

  useEffect(() => {
    const current = readCookieConsent();
    setConsent(current);
    setDraft({
      preferences: current?.preferences.preferences ?? DEFAULT_COOKIE_PREFERENCES.preferences,
      analytics: current?.preferences.analytics ?? DEFAULT_COOKIE_PREFERENCES.analytics,
    });
    setIsBannerVisible(!current);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setIsDialogOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  const lastUpdated = useMemo(() => {
    if (!consent?.updatedAt) return null;
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(consent.updatedAt),
      );
    } catch {
      return null;
    }
  }, [consent?.updatedAt]);

  const consentSummary = useMemo(() => {
    if (!consent) return null;
    if (consent.status === "accepted_all") return "All cookie categories enabled";
    if (consent.status === "essential_only") return "Only essential storage enabled";

    const enabled: string[] = [];
    if (consent.preferences.preferences) enabled.push("Preferences");
    if (consent.preferences.analytics) enabled.push("Analytics");
    return enabled.length ? `Custom: ${enabled.join(" + ")}` : "Custom: essential only";
  }, [consent]);

  const persist = (record: CookieConsentRecord) => {
    saveCookieConsent(record);
    setConsent(record);
    setDraft({
      preferences: record.preferences.preferences,
      analytics: record.preferences.analytics,
    });
    setIsBannerVisible(false);
    setIsDialogOpen(false);
  };

  const acceptAll = () => {
    persist(createConsentRecord("accepted_all", { preferences: true, analytics: true }));
  };

  const acceptEssentialOnly = () => {
    persist(createConsentRecord("essential_only", { preferences: false, analytics: false }));
  };

  const saveCustomPreferences = () => {
    persist(
      createConsentRecord("customized", {
        preferences: draft.preferences,
        analytics: draft.analytics,
      }),
    );
  };

  if (!isReady) return null;

  return (
    <>
      {consent && !isBannerVisible && (
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="group fixed bottom-4 right-4 z-[85] inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/92 px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#D1ECEB] hover:text-[#1A5256]"
          aria-label="Review cookie preferences"
        >
          <Cookie className="h-4 w-4 text-[#1F7C80]" />
          <span className="hidden sm:inline">Cookie preferences</span>
          <span className="sm:hidden">Cookies</span>
        </button>
      )}

      {isBannerVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,62,66,0.94))] p-5 text-white shadow-[0_28px_80px_rgba(15,23,42,0.4)] backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A3E4E6]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Cookie preferences
                </div>
                <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                  We use essential cookies to keep Klassruum secure, accessible, and reliable.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-[15px]">
                  Optional preference and analytics storage helps us remember accessibility settings
                  and improve product quality. You can accept all, keep essentials only, or choose
                  what to allow.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                  <Link to="/cookie-policy" className="font-semibold text-[#8FE3E6] hover:text-white">
                    Cookie policy
                  </Link>
                  <Link to="/privacy" className="font-semibold text-[#8FE3E6] hover:text-white">
                    Privacy policy
                  </Link>
                </div>
              </div>

              <div className="grid gap-2 sm:min-w-[320px] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 rounded-[18px] bg-white/12 px-5 text-white shadow-none hover:bg-white/18 hover:text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Customize
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 rounded-[18px] border border-white/15 bg-white px-5 text-[#0F172A] hover:bg-[#E6F6F6]"
                  onClick={acceptEssentialOnly}
                >
                  Essential only
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-[18px] bg-[linear-gradient(135deg,#3FA8AB,#1F7C80)] px-5 text-white shadow-[0_14px_34px_rgba(31,124,128,0.35)] hover:brightness-105"
                  onClick={acceptAll}
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFC_100%)] p-0 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
          <div className="border-b border-[#E2E8F0] px-6 py-5 sm:px-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D1ECEB] bg-[#F0FAFA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1F7C80]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Cookie controls
              </div>
              <DialogTitle className="text-[24px] font-bold tracking-tight text-[#0F172A]">
                Manage your cookie preferences
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-[#64748B]">
                Essential storage is always enabled for sign-in, session continuity, accessibility,
                and secure classroom operation. Optional settings below control non-essential browser
                storage.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 py-5 sm:px-7">
            <div className="rounded-[24px] border border-[#D1ECEB] bg-[linear-gradient(135deg,#F7FBFC,#FFFFFF)] px-4 py-3 text-sm text-[#475569] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-center gap-2 text-[#0F172A]">
                <Check className="h-4 w-4 text-[#1F7C80]" />
                <span className="font-semibold">Current selection:</span>
                <span>{consentSummary ?? "Not set yet"}</span>
              </div>
              {lastUpdated ? <p className="mt-1 text-[#64748B]">Updated {lastUpdated}</p> : null}
            </div>

            <CookiePreferenceRow
              title="Essential"
              description="Required for authentication, routing, accessibility support, security, and core classroom continuity."
              checked
              disabled
            />
            <CookiePreferenceRow
              title="Preferences"
              description="Allows Klassruum to remember non-essential experience choices such as interface preferences and convenience settings."
              checked={draft.preferences}
              onCheckedChange={(checked) => setDraft((current) => ({ ...current, preferences: checked }))}
            />
            <CookiePreferenceRow
              title="Analytics & diagnostics"
              description="Helps us understand reliability, feature adoption, and performance so we can improve the product without using advertising profiles."
              checked={draft.analytics}
              onCheckedChange={(checked) => setDraft((current) => ({ ...current, analytics: checked }))}
            />
          </div>

          <div className="border-t border-[#E2E8F0] px-6 py-5 sm:px-7">
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link to="/cookie-policy" className="font-semibold text-[#1A5256] hover:text-[#0F3E42]">
                  View cookie policy
                </Link>
                <Link to="/privacy" className="font-semibold text-[#1A5256] hover:text-[#0F3E42]">
                  Privacy policy
                </Link>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" className="rounded-[16px]" onClick={acceptEssentialOnly}>
                  Essential only
                </Button>
                <Button type="button" variant="outline" className="rounded-[16px]" onClick={acceptAll}>
                  Accept all
                </Button>
                <Button type="button" className="rounded-[16px]" onClick={saveCustomPreferences}>
                  Save preferences
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
