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
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-[#f8fafc] p-4">
      <div className="pr-2">
        <p className="text-sm font-semibold text-heading">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
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
          className="group fixed bottom-4 right-4 z-[85] inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-heading shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          aria-label="Review cookie preferences"
        >
          <Cookie className="h-4 w-4 text-muted" />
          <span className="hidden sm:inline">Cookie preferences</span>
          <span className="sm:hidden">Cookies</span>
        </button>
      )}

      {isBannerVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-lg sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Cookie preferences
                </div>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-heading sm:text-2xl">
                  We use essential cookies to keep Klassruum secure, accessible, and reliable.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-body sm:text-[15px]">
                  Optional preference and analytics storage helps us remember accessibility settings
                  and improve product quality. You can accept all, keep essentials only, or choose
                  what to allow.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    to="/cookie-policy"
                    className="font-semibold text-academic-blue hover:text-heading"
                  >
                    Cookie policy
                  </Link>
                  <Link
                    to="/privacy"
                    className="font-semibold text-academic-blue hover:text-heading"
                  >
                    Privacy policy
                  </Link>
                </div>
              </div>

              <div className="grid gap-2 sm:min-w-[320px] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl px-5"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Customize
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl px-5"
                  onClick={acceptEssentialOnly}
                >
                  Essential only
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-heading px-5 text-white hover:bg-navy-light"
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
        <DialogContent className="max-w-2xl rounded-2xl border border-border bg-white p-0 shadow-lg">
          <div className="border-b border-border px-6 py-5 sm:px-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                <ShieldCheck className="h-3.5 w-3.5" />
                Cookie controls
              </div>
              <DialogTitle className="text-[24px] font-bold tracking-tight text-heading">
                Manage your cookie preferences
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-body">
                Essential storage is always enabled for sign-in, session continuity, accessibility,
                and secure classroom operation. Optional settings below control non-essential
                browser storage.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 py-5 sm:px-7">
            <div className="rounded-xl border border-border bg-[#f8fafc] px-4 py-3 text-sm text-body">
              <div className="flex flex-wrap items-center gap-2 text-heading">
                <Check className="h-4 w-4 text-education-green" />
                <span className="font-semibold">Current selection:</span>
                <span>{consentSummary ?? "Not set yet"}</span>
              </div>
              {lastUpdated ? <p className="mt-1 text-muted">Updated {lastUpdated}</p> : null}
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
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, preferences: checked }))
              }
            />
            <CookiePreferenceRow
              title="Analytics & diagnostics"
              description="Helps us understand reliability, feature adoption, and performance so we can improve the product without using advertising profiles."
              checked={draft.analytics}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, analytics: checked }))
              }
            />
          </div>

          <div className="border-t border-border px-6 py-5 sm:px-7">
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  to="/cookie-policy"
                  className="font-semibold text-academic-blue hover:text-heading"
                >
                  View cookie policy
                </Link>
                <Link to="/privacy" className="font-semibold text-academic-blue hover:text-heading">
                  Privacy policy
                </Link>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={acceptEssentialOnly}
                >
                  Essential only
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={acceptAll}>
                  Accept all
                </Button>
                <Button type="button" className="rounded-xl" onClick={saveCustomPreferences}>
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
