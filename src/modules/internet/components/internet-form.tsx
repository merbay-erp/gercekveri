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
import { isps, outageFrequencyLabels } from "../config";
import { internetDefaults, internetInputSchema, type InternetInput } from "../schema";
import { createInternetSubmission } from "../server/actions";

export function InternetForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<InternetInput>({
    resolver: zodResolver(internetInputSchema) as unknown as Resolver<InternetInput>,
    defaultValues: internetDefaults,
    mode: "onSubmit",
  });

  const onSubmit = (values: InternetInput) => {
    startTransition(async () => {
      const result = await createInternetSubmission(values);
      if (!result.ok) {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs && msgs.length) {
              form.setError(field as keyof InternetInput, { message: msgs[0] });
            }
          }
        }
        return;
      }
      toast.success("Teşekkürler! İnternet ölçümün eklendi.");
      form.reset(internetDefaults);
      router.push(`/internet/${values.isp}`);
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
            name="isp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İnternet sağlayıcı</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value ? isps.find((i) => i.slug === value)?.name ?? null : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isps.map((isp) => (
                      <SelectItem key={isp.slug} value={isp.slug}>
                        {isp.name}
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
            name="districtName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>İlçe / mahalle (opsiyonel)</FormLabel>
                <FormControl>
                  <Input placeholder="Örn. Kadıköy, Çankaya, Nilüfer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageSpeedMbps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paket hızı (Mbps)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10000}
                    placeholder="Örn. 100"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Sözleşmedeki vaat edilen hız.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="realSpeedMbps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ölçülen hız (Mbps)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={10000}
                    placeholder="Örn. 78"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Speedtest gibi araçlardan alınan ortalama.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pingMs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ping (ms)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={2000}
                    placeholder="Örn. 25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="satisfaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memnuniyet (1-5)</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value ?? "")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value ? `${value} / 5` : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} / 5
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
            name="outageFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kesinti sıklığı</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç">
                        {(value: unknown) =>
                          value
                            ? outageFrequencyLabels[
                                value as keyof typeof outageFrequencyLabels
                              ] ?? null
                            : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["NEVER", "MONTHLY", "WEEKLY", "DAILY"] as const).map((o) => (
                      <SelectItem key={o} value={o}>
                        {outageFrequencyLabels[o]}
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
              <span className="font-medium text-foreground">Tamamen anonim.</span> IP ve kişisel
              bilgi alınmıyor; sadece sağlayıcı ve şehir/ilçe yeterli.
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
