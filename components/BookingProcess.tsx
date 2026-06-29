const steps = [
  {
    title: "Elige el tratamiento",
    text: "Puedes entrar en la página específica del tratamiento que te interesa.",
  },
  {
    title: "Envía tus datos",
    text: "El formulario prepara un mensaje de WhatsApp con tu nombre, teléfono e interés.",
  },
  {
    title: "Agenda la valoración",
    text: "Se confirma disponibilidad y se revisa si el tratamiento es adecuado para ti.",
  },
];

export default function BookingProcess() {
  return (
    <section className="bg-[#faf7f8] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Cómo reservar
          </span>
          <h2 className="mt-4 text-4xl font-light text-[#6b5b63]">
            Un proceso simple, claro y orientado a tu caso
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[32px] bg-white p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9a8b5] text-lg font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-6 text-2xl text-[#6b5b63]">{step.title}</h3>
              <p className="mt-4 leading-7 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
