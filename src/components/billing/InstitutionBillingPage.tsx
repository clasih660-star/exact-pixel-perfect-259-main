import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle,
  Sparkles,
  Building2,
  RefreshCcw,
  ExternalLink,
  Clock,
  AlertTriangle,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePaystack } from "@/hooks/usePaystack";
import {
  getBillingPlans,
  getBillingOverview,
  initializePaystackCheckout,
  verifyPaystackPayment,
} from "@/lib/paystack-billing.functions";
import { getMyInstitutions } from "@/lib/institutions.functions";
import type {
  PaystackPlan,
  BillingOverview,
  PaystackCheckoutResult,
  PaystackVerificationResult,
} from "@/lib/paystack-billing.functions";

function formatCurrency(minorAmount: number, currency: string): string {
  const major = minorAmount / 100;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(major);
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
}

function formatDate(input: string | null | undefined): string {
  if (!input) return "—";
  try {
    return new Date(input).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return input;
  }
}

function StatusBadge({ status }: { status: string }) {
  const variant = (() => {
    switch (status) {
      case "active":
        return "default" as const;
      case "trialing":
        return "secondary" as const;
      case "past_due":
      case "failed":
      case "abandoned":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  })();

  return (
    <Badge variant={variant} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function InstitutionBillingPage({ institutionId }: { institutionId: string }) {
  const queryClient = useQueryClient();
  const { ready: paystackReady, loading: paystackLoading, error: paystackError, openCheckout } = usePaystack();
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const [processingReference, setProcessingReference] = useState<string | null>(null);

  const institutionIdParam = institutionId;

  const plansFn = useServerFn(getBillingPlans);
  const overviewFn = useServerFn(getBillingOverview);
  const checkoutFn = useServerFn(initializePaystackCheckout);
  const verifyFn = useServerFn(verifyPaystackPayment);
  const myInstitutionFn = useServerFn(getMyInstitutions);

  const { data: institutionData } = useQuery({
    queryKey: ["my-institutions-billing"],
    queryFn: () => myInstitutionFn(),
  });
  const institutionName =
    institutionData?.memberships?.[0]?.institution?.name ?? "Your Institution";

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["billing-plans"],
    queryFn: () => plansFn(),
  });

  const {
    data: overviewData,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["billing-overview", institutionIdParam],
    queryFn: () => overviewFn({ data: { institutionId: institutionIdParam } }),
    enabled: Boolean(institutionIdParam),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planSlug: string) => {
      return checkoutFn({
        data: {
          institutionId: institutionIdParam,
          planSlug,
          currency: overviewData?.preferredCurrency ?? "NGN",
        },
      });
    },
    onSuccess: (result: PaystackCheckoutResult) => {
      if (paystackReady) {
        openCheckout({
          reference: result.reference,
          email: institutionData?.memberships?.[0]?.institution?.contact_email ?? "",
          amount: result.amountMinor,
          currency: result.currency,
          onSuccess: (ref: string) => {
            setProcessingReference(ref);
            toast.info("Payment received. Verifying...");
          },
          onCancel: () => {
            toast.warning("Payment cancelled.");
          },
        });
      } else {
        window.open(result.authorizationUrl, "_blank", "noopener");
        toast.info("Opened Paystack in a new tab. Complete payment there.");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const verifyMutation = useMutation({
    mutationFn: async (reference: string) => {
      return verifyFn({
        data: { institutionId: institutionIdParam, reference },
      });
    },
    onSuccess: (result: PaystackVerificationResult) => {
      if (result.status === "success") {
        toast.success("Payment verified. Your plan is active.");
      } else if (result.status === "pending") {
        toast.info("Payment is still pending. Try again soon.");
      } else {
        toast.error(`Payment ${result.status}. Please try again.`);
      }
      setProcessingReference(null);
      refetchOverview();
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setProcessingReference(null);
    },
  });

  const handleVerifyFromUrl = useCallback(() => {
    const referenceFromUrl = searchParams?.reference;
    if (!referenceFromUrl || verifyMutation.isPending) return;
    setProcessingReference(referenceFromUrl);
    verifyMutation.mutate(referenceFromUrl);
  }, [searchParams, verifyMutation]);

  useEffect(() => {
    handleVerifyFromUrl();
  }, [handleVerifyFromUrl]);

  const plans = useMemo(() => plansData?.plans ?? [], [plansData]);
  const overview: BillingOverview | null = overviewData ?? null;

  const currentPlanSlug =
    overview?.activePlan?.slug ?? overview?.subscription?.planSlug ?? "starter";
  const currentPlan = plans.find((plan) => plan.slug === currentPlanSlug) ?? plans[0] ?? null;
  const isPaidPlan = (currentPlan?.amountMinor ?? 0) > 0;
  const busy =
    checkoutMutation.isPending ||
    verifyMutation.isPending ||
    paystackLoading ||
    plansLoading ||
    overviewLoading;

  return (
    <InstitutionShell title="Billing">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Current plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overviewLoading ? (
                  <p className="text-sm text-muted-foreground">Loading billing overview…</p>
                ) : currentPlan ? (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      {currentPlan.highlight ? (
                        <Badge variant="default">Recommended</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan.amountMinor === 0
                        ? "Free"
                        : `${formatCurrency(currentPlan.amountMinor, currentPlan.currency)} / ${currentPlan.interval}`}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Billing status: <StatusBadge status={overview?.subscription?.status ?? "trialing"} />
                    </div>
                    {overview?.subscription?.currentPeriodStart ? (
                      <div className="text-xs text-muted-foreground">
                        Current period: {formatDate(overview.subscription.currentPeriodStart)} →{" "}
                        {formatDate(overview.subscription.currentPeriodEnd)}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No plan detected.</p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      refetchOverview();
                      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" /> Refresh status
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Building2 className="h-4 w-4" /> Institution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{institutionName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Preferred currency</span>
                  <span className="font-medium">{overview?.preferredCurrency ?? "NGN"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last reference</span>
                  <span className="font-medium truncate ml-4 max-w-[220px]">
                    {overview?.lastReference ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {processingReference ? (
            <Alert className="mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Verifying payment</AlertTitle>
              <AlertDescription>
                Checking reference <span className="font-medium">{processingReference}</span> with
                Paystack. This will refresh automatically.
              </AlertDescription>
            </Alert>
          ) : null}

          {paystackError ? (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Paystack script error</AlertTitle>
              <AlertDescription>{paystackError}</AlertDescription>
            </Alert>
          ) : null}
        </TabsContent>

        <TabsContent value="plans">
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {plansLoading ? (
              <p className="text-sm text-muted-foreground">Loading plans…</p>
            ) : (
              plans.map((plan) => {
                const isCurrent = plan.slug === currentPlanSlug;
                const isCheckout = plan.amountMinor > 0;
                return (
                  <Card
                    key={plan.slug}
                    className={
                      plan.highlight
                        ? "border-primary shadow-lg"
                        : "hover:border-muted-foreground/30"
                    }
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        {plan.highlight ? (
                          <Sparkles className="h-4 w-4 text-primary" />
                        ) : plan.slug === "enterprise" ? (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{plan.name}</span>
                        {isCurrent ? <Badge variant="default">Current</Badge> : null}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xl font-bold">
                        {plan.amountMinor === 0
                          ? "Free"
                          : `${formatCurrency(plan.amountMinor, plan.currency)} / ${plan.interval}`}
                      </div>
                      {plan.description ? (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      ) : null}
                      <Separator />
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {isCheckout && !isCurrent ? (
                        <Button
                          className="w-full"
                          disabled={busy}
                          onClick={() => checkoutMutation.mutate(plan.slug)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> Pay with Paystack
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" /> Recent transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <p className="text-sm text-muted-foreground">Loading transactions…</p>
              ) : overview?.recentTransactions?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Paid at</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="max-w-[240px] truncate font-medium">
                          {transaction.reference}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={transaction.status} />
                        </TableCell>
                        <TableCell>
                          {formatCurrency(transaction.amountMinor, transaction.currency)}
                        </TableCell>
                        <TableCell className="capitalize">{transaction.channel ?? "—"}</TableCell>
                        <TableCell>{formatDate(transaction.paidAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </InstitutionShell>
  );
}
