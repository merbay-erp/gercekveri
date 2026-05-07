"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cities } from "@/lib/cities";
import { salaryDefaults, salaryInputSchema, type SalaryInput } from "../schema";
import { commonPositions } from "../positions";
import { workModeLabels, companySizeLabels } from "../config";
import { createSalarySubmission } from "../server/actions";

export function MaasForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<SalaryInput>({
    resolver: zodResolver(salaryInputSchema) as unknown as Resolver<SalaryInput>,
    defaultValues: salaryDefaults,
    mode: "onSubmit",
  });

  const onSubmit = (values: SalaryInput) => {
    startTransition(async () => {
      const result = await createSalarySubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof SalaryInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! Paylaşımın eklendi.", {
        description: "Verin diğer kullanıcılar için anında görünür.",
      });
      form.reset(salaryDefaults);
      router.push("/maaslar");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Honeypot — invisible to humans, irresistible to bots */}
        <div aria-hidden className="hidden" tabIndex={-1}>
          <label>
            Website
            <input
              type="text"
              autoComplete="off"
              tabIndex={-1}
              {...form.register("website")}
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Pozisyon</FormLabel>
                <FormControl>
                  <Input
                    list="position-options"
                    placeholder="Örn. Frontend Developer"
                    {...field}
                  />
                </FormControl>
                <datalist id="position-options">
                  {commonPositions.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citySlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şehir</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Şehir seç">
                        {(value: unknown) =>
                          value ? cities.find((c) => c.slug === value)?.name ?? null : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sektör (opsiyonel)</FormLabel>
                <FormControl>
                  <Input placeholder="Örn. Yazılım, Otomotiv, Tekstil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deneyim (yıl)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={0} max={60} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="netSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Net maaş (TL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1000}
                    placeholder="Örn. 75000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Aylık net, vergi ve kesintiler düşüldükten sonra.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Çalışma şekli</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value ? workModeLabels[value as keyof typeof workModeLabels] ?? null : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["ONSITE", "HYBRID", "REMOTE"] as const).map((m) => (
                      <SelectItem key={m} value={m}>
                        {workModeLabels[m]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şirket büyüklüğü (opsiyonel)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? companySizeLabels[value as keyof typeof companySizeLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["SOLO", "MICRO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"] as const).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {companySizeLabels[s]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Tamamen anonim.</span> İsim, e-posta
              veya hesap istemiyoruz. Yalnızca kötüye kullanımı engellemek için tarayıcı parmak
              izi tek yönlü olarak özetlenir.
            </p>
          </div>
          <Button type="submit" disabled={isPending} className="sm:w-auto">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? "Gönderiliyor..." : "Anonim olarak paylaş"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
