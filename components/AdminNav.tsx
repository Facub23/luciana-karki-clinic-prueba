import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  FileImage,
  FilePenLine,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Leads", icon: Users },
  { href: "/admin/metricas", label: "Métricas", icon: BarChart3 },
  { href: "/admin/contenido", label: "Contenido", icon: FilePenLine },
  { href: "/admin/medios", label: "Medios", icon: FileImage },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
];

export default function AdminNav() {
  return (
    <nav className="mt-4 flex gap-2 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#ead1d9] bg-[#fffafb] px-4 py-2 text-sm font-medium text-[#6b5b63] transition hover:bg-[#fff3f6] hover:text-[#a8697e]"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
