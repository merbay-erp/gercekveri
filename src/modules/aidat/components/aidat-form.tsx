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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cities } from "@/lib/cities";
import {
  amenityLabels,
  amenityOrder,
  buildingAgeLabels,
  siteTypeLabels,
} from "../config";
import { aidatDefaults, aidatInputSchema, type AidatInput } from "../schema";
import { createAidatSubmission } from "../server/actions";

export function AidatForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<AidatInput>({
    resolver: zodResolver(aidatInputSchema) as unknown as Resolver<AidatInput>,
    defaultValues: aidatDefaults,
    mode: "onSubmit",
  });

  const onSubmit = (values: AidatInput) => {
    startTransition(async () => {
      const result = await createAidatSubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof AidatInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! Aidat verin eklendi.");
      form.reset(aidatDefaults);
      router.push("/aidat");
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
                  <Input placeholder="Örn. Nilüfer, Kadıköy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siteType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yapı tipi</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? siteTypeLabels[value as keyof typeof siteTypeLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["BLOCK", "VILLA", "INDEPENDENT", "RESIDENCE"] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        {siteTypeLabels[s]}
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
            name="buildingAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bina yaşı</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? buildingAgeLabels[value as keyof typeof buildingAgeLabels] ??
                              null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["0-5", "5-10", "10-20", "20+"] as const).map((b) => (
                      <SelectItem key={b} value={b}>
                        {buildingAgeLabels[b]}
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
            name="m2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daire büyüklüğü (m²)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={20} max={2000} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aidatAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aylık aidat (TL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={100}
                    placeholder="Örn. 3500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Aylık ödediğin yönetim aidatı.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
          <p className="text-sm font-medium">Hizmetler — sitende mevcut olanları seç</p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {amenityOrder.map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-normal">
                      {amenityLabels[key]}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Tamamen anonim.</span> Bina /
              site adı, daire numarası, yönetici bilgisi alınmaz.
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
