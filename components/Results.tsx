export default function Results() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Filosofía
          </span>

          <h2 className="mt-4 text-5xl font-light text-[#6b5b63]">
            Resultados Naturales
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Cada tratamiento busca realzar tu belleza natural respetando la
            armonía facial y corporal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-[#faf7f8] rounded-[32px] p-8">
            <h3 className="text-2xl text-[#6b5b63]">Armonización Facial</h3>

            <p className="mt-4 text-gray-600 leading-8">
              Diseñamos tratamientos personalizados para conseguir equilibrio,
              proporción y naturalidad.
            </p>
          </div>

          <div className="bg-[#faf7f8] rounded-[32px] p-8">
            <h3 className="text-2xl text-[#6b5b63]">
              Tratamientos Personalizados
            </h3>

            <p className="mt-4 text-gray-600 leading-8">
              Cada paciente recibe una valoración individualizada para obtener
              el mejor resultado posible.
            </p>
          </div>

          <div className="bg-[#faf7f8] rounded-[32px] p-8">
            <h3 className="text-2xl text-[#6b5b63]">Tecnología Avanzada</h3>

            <p className="mt-4 text-gray-600 leading-8">
              Técnicas modernas orientadas a resultados seguros y duraderos.
            </p>
          </div>

          <div className="bg-[#faf7f8] rounded-[32px] p-8">
            <h3 className="text-2xl text-[#6b5b63]">Belleza Natural</h3>

            <p className="mt-4 text-gray-600 leading-8">
              Nuestro objetivo es potenciar tu belleza sin alterar tu esencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
