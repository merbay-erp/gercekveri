"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { submitFraudReport } from "@/modules/web/server/actions";
import { reportCategories } from "@/modules/web/config";

export function ReportForm({ defaultDomain = "" }: { defaultDomain?: string }) {
  const router = useRouter();
  const [domain, setDomain] = useState(defaultDomain);
  const [category, setCategory] = useState<string>(reportCategories[0].key);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitFraudReport({ domain, category, note, website });
      if (res.ok) {
        toast.success("İhbarın alındı. Teşekkürler.");
        if (res.key) router.push(`/sorgu/web/${res.key}`);
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium">Web adresi</label>
        <input
          required
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="ör. hizliodeme-kargo.com"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Dolandırıcılık türü</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {reportCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Açıklama <span className="font-normal text-muted-foreground">(opsiyonel)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Ne oldu? IBAN/telefon yazma — otomatik maskelenir."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Gönderiliyor…" : "İhbarı gönder"}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        İhbarlar anonimdir ve doğrulanana kadar &quot;bekliyor&quot; olarak işaretlenir. Kötü niyetli/asılsız ihbar
        engellenir; bir adresi yanlışlıkla işaretlersek itiraz edebilirsin.
      </p>
    </form>
  );
}
