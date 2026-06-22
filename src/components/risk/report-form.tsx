"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { submitFraudReport } from "@/modules/lookup/server/actions";
import { REGISTRY, type LookupKind } from "@/services/risk/registry";

const KIND_OPTIONS: LookupKind[] = ["web", "iban", "phone"];

export function ReportForm({
  defaultKind = "web",
  defaultValue = "",
}: {
  defaultKind?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<LookupKind>(
    (KIND_OPTIONS.includes(defaultKind as LookupKind) ? defaultKind : "web") as LookupKind,
  );
  const [value, setValue] = useState(defaultValue);
  const cats = REGISTRY[kind].categories;
  const [category, setCategory] = useState<string>(cats[0].key);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [pending, startTransition] = useTransition();

  const def = useMemo(() => REGISTRY[kind], [kind]);

  function onKindChange(k: LookupKind) {
    setKind(k);
    setCategory(REGISTRY[k].categories[0].key);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitFraudReport({ kind, value, category, note, website });
      if (res.ok) {
        toast.success("İhbarın alındı. Teşekkürler.");
        if (res.key) router.push(`/sorgu/${res.kind}/${res.key}`);
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
        <label className="mb-1.5 block text-sm font-medium">Tür</label>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {KIND_OPTIONS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKindChange(k)}
              aria-selected={kind === k}
              className={
                "flex-1 rounded-md px-2 py-1.5 text-[13px] transition-colors " +
                (kind === k ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")
              }
            >
              {REGISTRY[k].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{def.label}</label>
        <input
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={def.placeholder}
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
          {cats.map((c) => (
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
        engellenir; bir kaydı yanlışlıkla işaretlersek itiraz edebilirsin.
      </p>
    </form>
  );
}
