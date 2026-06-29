export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#faf7f8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Excelencia
          </span>

          <h2 className="mt-4 text-5xl font-light text-[#6b5b63]">
            ¿Por qué elegir a la Dra. Luciana Karki?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[32px] p-8 shadow-sm">
            <div className="text-4xl mb-4">✨</div>

            <h3 className="text-2xl text-[#6b5b63]">Resultados Naturales</h3>

            <p className="mt-4 text-gray-600 leading-7">
              Buscamos potenciar tu belleza respetando siempre tu armonía
              facial.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm">
            <div className="text-4xl mb-4">💎</div>

            <h3 className="text-2xl text-[#6b5b63]">
              Atención Personalizada
            </h3>

            <p className="mt-4 text-gray-600 leading-7">
              Cada tratamiento se adapta a las características y objetivos de
              cada paciente.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm">
            <div className="text-4xl mb-4">🌿</div>

            <h3 className="text-2xl text-[#6b5b63]">Técnicas Avanzadas</h3>

            <p className="mt-4 text-gray-600 leading-7">
              Procedimientos modernos orientados a resultados seguros y
              elegantes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
