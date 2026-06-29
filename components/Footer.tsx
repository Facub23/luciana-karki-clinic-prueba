export default function Footer() {
  return (
    <footer className="bg-[#6b5b63] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold">
              Dra. Luciana Karki Martín
            </h3>

            <p className="mt-4 text-white/80">
              Medicina Estética Avanzada en Barcelona y Alicante.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contacto</h3>

            <p className="mt-4 text-white/80">+34 644 24 17 06</p>

            <p className="mt-2 text-white/80">Calle Sepúlveda 125</p>

            <p className="mt-2 text-white/80">Barcelona · España</p>

            <p className="mt-2 text-white/80">
              Alicante · Visitas a domicilio
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Redes Sociales</h3>

            <a
              href="https://www.instagram.com/dra.lucianakarkimartin/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-white/80 hover:text-white"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/34644241706"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-white/80 hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          © 2026 Dra. Luciana Karki Martín · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
