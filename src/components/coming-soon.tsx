import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets?: string[];
}

export function ComingSoon({ icon: Icon, title, description, bullets }: Props) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <Card className="space-y-6 p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-foreground/5">
            <Icon className="h-6 w-6" />
          </span>
          <Badge variant="secondary" className="font-normal">
            <Sparkles className="mr-1.5 h-3 w-3" /> Yakında
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {bullets && bullets.length > 0 ? (
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                {b}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/maaslar" className={buttonVariants({ variant: "default" })}>
            Şimdilik maaşlara bak <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Ana sayfa
          </Link>
        </div>
      </Card>
    </div>
  );
}
