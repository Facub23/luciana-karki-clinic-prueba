import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ead1d9]/80 bg-[#fffafc]/90 shadow-[0_10px_40px_rgba(107,91,99,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:h-24 sm:px-6">
        <Link href="/#inicio" className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ead1d9] bg-white shadow-sm sm:h-14 sm:w-14">
            <Image
              src="/logo.png"
              alt="Logo Dra. Luciana Karki"
              width={46}
              height={46}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#5f4d56] sm:text-base">
              <span className="sm:hidden">Dra. Luciana</span>
              <span className="hidden sm:inline">
                Dra. Luciana Karki Martín
              </span>
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-[#c98fa1] sm:block">
              Medicina estética
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#ead1d9] bg-white/80 p-1 text-sm font-medium text-[#6b5b63] shadow-sm md:flex">
          <Link
            href="/#inicio"
            className="rounded-full px-4 py-2 transition hover:bg-[#fff3f6] hover:text-[#a8697e]"
          >
            Inicio
          </Link>
          <Link
            href="/#tratamientos"
            className="rounded-full px-4 py-2 transition hover:bg-[#fff3f6] hover:text-[#a8697e]"
          >
            Tratamientos
          </Link>
          <Link
            href="/#sobre"
            className="rounded-full px-4 py-2 transition hover:bg-[#fff3f6] hover:text-[#a8697e]"
          >
            Sobre mí
          </Link>
          <Link
            href="/#contacto"
            className="rounded-full px-4 py-2 transition hover:bg-[#fff3f6] hover:text-[#a8697e]"
          >
            Contacto
          </Link>
        </nav>

        <a
          href="https://wa.me/34644241706"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#c98fa1] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(201,143,161,0.32)] transition hover:-translate-y-0.5 hover:bg-[#bd7f93] sm:px-5"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">Cita</span>
          <span className="hidden sm:inline">Reservar cita</span>
        </a>
      </div>
    </header>
  );
}
