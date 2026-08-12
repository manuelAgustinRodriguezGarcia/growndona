import {
  History,
  Home,
  NotebookTabs,
  Sprout,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: "/dashboard" | "/cultivos" | "/registrar" | "/historial" | "/perfil";
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  highlight?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", shortLabel: "Inicio", icon: Home },
  { href: "/cultivos", label: "Mis cultivos", shortLabel: "Cultivos", icon: Sprout },
  {
    href: "/registrar",
    label: "Registrar",
    shortLabel: "Registrar",
    icon: NotebookTabs,
    highlight: true,
  },
  { href: "/historial", label: "Historial", shortLabel: "Historial", icon: History },
  { href: "/perfil", label: "Perfil", shortLabel: "Perfil", icon: User },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
