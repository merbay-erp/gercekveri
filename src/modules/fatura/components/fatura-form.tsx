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
import {
  utilityTypes,
  utilityLabels,
  utilityUnits,
  householdSizes,
  householdSizeLabels,
} from "../config";
import { faturaDefaults, faturaInputSchema, type FaturaInput } from "../schema";
import { createFaturaSubmission } from "../server/actions";

export function FaturaForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FaturaInput>({
    resolver: zodResolver(faturaInputSchema) as unknown as Resolver<FaturaInput>,
    defaultValues: faturaDefaults,
    mode: "onSubmit",
  });

  const utilityType = form.watch("utilityType");
  const unit = utilityUnits[utilityType];

  const onSubmit = (values: FaturaInput) => {
    startTransition(async () => {
      const result = await createFaturaSubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof FaturaInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! Fatura verin eklendi.");
      form.reset(faturaDefaults);
      router.push("/fatura");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div aria-hidden className="hidden" tabIndex={-1}>
          <label>
            Website
            <input type="text" autoComplete="off" tabIndex={-1} {...form.register("website")} />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="utilityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatura türü</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? utilityLabels[value as keyof typeof utilityLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {utilityTypes.map((u) => (
                      <SelectItem key={u} value={u}>
                        {utilityLabels[u]}
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
            name="billingMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatura ayı</FormLabel>
                <FormControl>
                  <Input type="month" {...field} />
                </FormControl>
                <FormDescription>Hangi aya ait fatura?</FormDescription>
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
                          value
                            ? cities.find((c) => c.slug === value)?.name ?? null
                            : null
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
            name="districtName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlçe / mahalle (opsiyonel)</FormLabel>
                <FormControl>
                  <Input placeholder="Örn. Kadıköy, Çankaya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="householdSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hane büyüklüğü</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? householdSizeLabels[
                                value as keyof typeof householdSizeLabels
                              ] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {householdSizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {householdSizeLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Eşleşmenin keskin olması için.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tüketim ({unit})</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min={0}
                    placeholder={unit === "kWh" ? "Örn. 320" : "Örn. 18"}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Faturadaki dönemsel tüketim.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountTRY"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Toplam fatura tutarı (TL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={50}
                    placeholder="Örn. 1850"
                    {...field}
                  />
                </FormControl>
                <FormDescription>KDV dahil son ödediğin toplam.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Tamamen anonim.</span> Abone
              numarası, sayaç bilgisi, isim alınmaz.
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
