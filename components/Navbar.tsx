import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-pink-100">
      <div className="max-w-7xl mx-auto flex h-18 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link href="/#inicio" className="flex min-w-0 items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={46} height={46} />

          <span className="truncate text-sm font-medium text-[#6b5b63] sm:text-base">
            <span className="sm:hidden">Dra. Luciana</span>
            <span className="hidden sm:inline">Dra. Luciana Karki Martín</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[#6b5b63]">
          <Link href="/#inicio">Inicio</Link>
          <Link href="/#tratamientos">Tratamientos</Link>
          <Link href="/#sobre">Sobre mí</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>

        <a
          href="https://wa.me/34644241706"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-[#d9a8b5] px-4 py-2.5 text-sm font-medium text-white sm:px-5 sm:py-3"
        >
          <span className="sm:hidden">Cita</span>
          <span className="hidden sm:inline">Reservar cita</span>
        </a>
      </div>
    </header>
  );
}
