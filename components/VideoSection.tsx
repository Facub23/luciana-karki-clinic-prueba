export type VideoBlockContent = {
  eyebrow: string;
  title: string;
  description: string;
  videos: {
    src: string;
    title: string;
  }[];
};

export const defaultVideoContent: VideoBlockContent = {
  eyebrow: "En consulta",
  title: "Una mirada real al trabajo en clínica",
  description:
    "Videos breves para mostrar resultados, proceso y detalles visuales que ayudan a entender mejor cada tratamiento antes de reservar.",
  videos: [
    {
      src: "/videos/consulta-1.mp4",
      title: "Atención personalizada",
    },
    {
      src: "/videos/consulta-2.mp4",
      title: "Resultados y armonización",
    },
  ],
};

type VideoSectionProps = {
  content?: VideoBlockContent;
};

export default function VideoSection({
  content = defaultVideoContent,
}: VideoSectionProps) {
  return (
    <section className="bg-[#faf7f8] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {content.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
            {content.title}
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {content.videos.map((video) => (
            <div
              key={video.src}
              className="overflow-hidden rounded-[24px] bg-white p-3 shadow-sm"
            >
              <video
                className="aspect-video w-full rounded-[18px] bg-black object-cover"
                controls
                playsInline
                preload="metadata"
              >
                <source src={video.src} type="video/mp4" />
              </video>

              <h3 className="px-2 pb-3 pt-4 text-lg font-medium text-[#6b5b63]">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
