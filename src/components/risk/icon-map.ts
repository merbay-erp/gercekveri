import {
  AlertTriangle,
  Ban,
  Calendar,
  Circle,
  CircleCheck,
  Flag,
  Globe,
  History,
  Landmark,
  Mail,
  Phone,
  Server,
  ShieldCheck,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  calendar: Calendar,
  ban: Ban,
  history: History,
  server: Server,
  mail: Mail,
  "shield-check": ShieldCheck,
  users: Users,
  globe: Globe,
  tag: Tag,
  phone: Phone,
  "building-bank": Landmark,
  checkbox: CircleCheck,
  "alert-triangle": AlertTriangle,
  flag: Flag,
};

export function iconFor(name: string): LucideIcon {
  return MAP[name] ?? Circle;
}
