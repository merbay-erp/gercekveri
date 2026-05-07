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
import { rentDefaults, rentInputSchema, type RentInput } from "../schema";
import {
  roomCountLabels,
  buildingAgeLabels,
  furnishedLabels,
  heatingLabels,
} from "../config";
import { createRentSubmission } from "../server/actions";

export function KiraForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<RentInput>({
    resolver: zodResolver(rentInputSchema) as unknown as Resolver<RentInput>,
    defaultValues: rentDefaults,
    mode: "onSubmit",
  });

  const onSubmit = (values: RentInput) => {
    startTransition(async () => {
      const result = await createRentSubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof RentInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! Kira ilanın eklendi.", {
        description: "Verin diğer kullanıcılar için anında görünür.",
      });
      form.reset(rentDefaults);
      router.push("/kira");
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
                  <Input placeholder="Örn. Nilüfer, Kadıköy, Beştepe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oda sayısı</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? roomCountLabels[value as keyof typeof roomCountLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["studio", "1+0", "1+1", "2+1", "3+1", "4+1", "5+"] as const).map(
                      (r) => (
                        <SelectItem key={r} value={r}>
                          {roomCountLabels[r]}
                        </SelectItem>
                      ),
                    )}
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
                <FormLabel>m² (brüt)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={15} max={2000} {...field} />
                </FormControl>
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
            name="rentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kira (TL / ay)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={500}
                    placeholder="Örn. 25000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Aylık ödediğin/ödenen kira tutarı.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="furnished"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eşya durumu</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? furnishedLabels[value as keyof typeof furnishedLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["UNFURNISHED", "PARTIAL", "FURNISHED"] as const).map((f) => (
                      <SelectItem key={f} value={f}>
                        {furnishedLabels[f]}
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
            name="heating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isıtma (opsiyonel)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? heatingLabels[value as keyof typeof heatingLabels] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      ["KOMBI", "MERKEZI", "DOGALGAZ_SOBASI", "KLIMA", "SOBALI", "YOK"] as const
                    ).map((h) => (
                      <SelectItem key={h} value={h}>
                        {heatingLabels[h]}
                      </SelectItem>
                    ))}
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
              <span className="font-medium text-foreground">Tamamen anonim.</span> Adres, isim
              veya iletişim bilgisi alınmıyor. Yalnızca semt veya mahalle adı yeterli.
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
