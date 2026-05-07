"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInsight, regenerateInsight, deleteInsight } from "../actions";

interface Props {
  scope: string;
  initialTitle: string | null;
  initialBody: string;
  initialBullets: string[];
}

export function InsightForm({
  scope,
  initialTitle,
  initialBody,
  initialBullets,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initialTitle ?? "");
  const [body, setBody] = React.useState(initialBody);
  const [bulletsText, setBulletsText] = React.useState(initialBullets.join("\n"));
  const [pending, setPending] = React.useState<string | null>(null);

  const onSave = async () => {
    setPending("save");
    const bullets = bulletsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const result = await updateInsight(scope, {
      title: title.trim() || null,
      body,
      bullets,
    });
    setPending(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Insight güncellendi.");
    router.refresh();
  };

  const onRegenerate = async () => {
    if (
      !window.confirm(
        "Bu insight'ı yeniden üretmek için cache invalidate edilecek. Sayfa hit'inde Gemini tekrar çağrılır. Devam?",
      )
    ) {
      return;
    }
    setPending("regen");
    const result = await regenerateInsight(scope);
    setPending(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Cache invalidate edildi. Sonraki sayfa hit'i Gemini'yi tetikleyecek.");
    router.refresh();
  };

  const onDelete = async () => {
    if (!window.confirm("Bu insight'ı tamamen silmek istiyor musun? Geri alınamaz.")) {
      return;
    }
    setPending("delete");
    const result = await deleteInsight(scope);
    setPending(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Silindi.");
    router.push("/admin/insights");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="insight-title">Başlık</Label>
        <Input
          id="insight-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Boş bırakılabilir"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="insight-body">Gövde</Label>
        <Textarea
          id="insight-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Boş bırakırsan negatif cache olur — bir sonraki hit'te tekrar üretmeyi dener.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="insight-bullets">Madde madde notlar</Label>
        <Textarea
          id="insight-bullets"
          value={bulletsText}
          onChange={(e) => setBulletsText(e.target.value)}
          rows={5}
          placeholder="Her satır bir madde"
        />
        <p className="text-xs text-muted-foreground">
          Her satır ayrı bir madde olarak yorumlanır.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button onClick={onSave} disabled={pending !== null}>
          {pending === "save" ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1 h-3.5 w-3.5" />
          )}
          Kaydet
        </Button>
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={pending !== null}
        >
          {pending === "regen" ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
          )}
          Yeniden üret (cache invalidate)
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={pending !== null}
          className="ml-auto"
        >
          {pending === "delete" ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="mr-1 h-3.5 w-3.5" />
          )}
          Sil
        </Button>
      </div>
    </div>
  );
}
