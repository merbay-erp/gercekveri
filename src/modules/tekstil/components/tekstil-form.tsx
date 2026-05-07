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
  subTypes,
  subTypeLabels,
  units,
  unitLabels,
  defaultUnitFor,
  fabricTypes,
  fabricTypeLabels,
  customerTypes,
  customerTypeLabels,
  type SubType,
} from "../config";
import { tekstilDefaults, tekstilInputSchema, type TekstilInput } from "../schema";
import { createTekstilSubmission } from "../server/actions";

export function TekstilForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<TekstilInput>({
    resolver: zodResolver(tekstilInputSchema) as unknown as Resolver<TekstilInput>,
    defaultValues: tekstilDefaults,
    mode: "onSubmit",
  });

  const subType = form.watch("subType");

  // Auto-update unit when subType changes — but only if the user hasn't
  // overridden it yet (we track this with a ref so the effect doesn't loop).
  const lastAutoSubType = React.useRef<SubType>(tekstilDefaults.subType);
  React.useEffect(() => {
    if (subType !== lastAutoSubType.current) {
      form.setValue("unit", defaultUnitFor[subType], { shouldValidate: false });
      lastAutoSubType.current = subType;
    }
  }, [subType, form]);

  const onSubmit = (values: TekstilInput) => {
    startTransition(async () => {
      const result = await createTekstilSubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof TekstilInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! Fiyat verin eklendi.");
      form.reset(tekstilDefaults);
      router.push("/tekstil");
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
            name="subType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İş tipi</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? subTypeLabels[value as keyof typeof subTypeLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subTypes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {subTypeLabels[s]}
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
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birim</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? unitLabels[value as keyof typeof unitLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>
                        {unitLabels[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  İş tipine göre öneriliyor — değiştirebilirsin.
                </FormDescription>
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
                  <Input placeholder="Örn. Merter, Laleli" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birim fiyat (TL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min={0.01}
                    placeholder="Örn. 18.50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  KDV hariç, üretici tarafının aldığı fiyat.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minOrderQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min. sipariş (opsiyonel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="Örn. 500"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? undefined : Number(v));
                    }}
                  />
                </FormControl>
                <FormDescription>MOQ — minimum order quantity.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fabricType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kumaş tipi (opsiyonel)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Belirtilmemiş">
                        {(value: unknown) =>
                          value
                            ? fabricTypeLabels[value as keyof typeof fabricTypeLabels] ??
                              null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fabricTypes.map((f) => (
                      <SelectItem key={f} value={f}>
                        {fabricTypeLabels[f]}
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
            name="colorCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Renk sayısı (opsiyonel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    placeholder="Örn. 1, 4"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? undefined : Number(v));
                    }}
                  />
                </FormControl>
                <FormDescription>Baskı / boya işlerinde önemli.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Müşteri tipi (opsiyonel)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Belirtilmemiş">
                        {(value: unknown) =>
                          value
                            ? customerTypeLabels[
                                value as keyof typeof customerTypeLabels
                              ] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customerTypes.map((c) => (
                      <SelectItem key={c} value={c}>
                        {customerTypeLabels[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  İşi kim için yapıyorsun? Anonim — şirket adı alınmaz.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Tamamen anonim.</span> Şirket
              adı, müşteri adı, sipariş numarası alınmaz.
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
