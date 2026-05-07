import * as React from "react";

import { cn } from "@/lib/utils";

interface Props extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

/**
 * GerçekVeri marka işareti — 4 histogram bar + sağ üst köşede emerald
 * pulse dot. Tema-agnostik: app icon, OG kart ve favicon ile bire bir
 * görsel tutarlılık (siyah BG + beyaz bar). Marka her ekranda aynı
 * görünür.
 */
export function BrandMark({ className, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="GerçekVeri logosu"
      className={cn(className)}
      {...rest}
    >
      <rect width="64" height="64" rx="14" fill="#0a0a0a" />
      <g fill="#fafafa">
        <rect x="12" y="38" width="7" height="14" rx="1.5" />
        <rect x="22" y="28" width="7" height="24" rx="1.5" />
        <rect x="32" y="32" width="7" height="20" rx="1.5" />
        <rect x="42" y="22" width="7" height="30" rx="1.5" />
      </g>
      <circle cx="50" cy="14" r="4" fill="#10b981" />
    </svg>
  );
}
