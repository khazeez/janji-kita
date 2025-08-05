/* eslint-disable @next/next/no-img-element */
import { Sparkle, Landmark, Leaf, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);
const fiveRow = reviews.slice(0, reviews.length / 2);
const sixRow = reviews.slice(reviews.length / 2);
const sevenRow = reviews.slice(0, reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="100" height="100" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white">{body}</blockquote>
    </figure>
  );
};

const ThemeSection = ({
  title,
  description,
  accentColor = "pink"
}: {
  title: string;
  description: string;
  accentColor?: string;
}) => {
  const colorClasses = {
    pink: "from-pink-400 to-pink-500",
    purple: "from-purple-400 to-purple-500",
    blue: "from-blue-400 to-blue-500",
    emerald: "from-emerald-400 to-emerald-500"
  };

  return (
    <div className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 hover:bg-white/10 transition-all duration-300">
      <div className="mb-4">
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse group-hover:animate-none transition-all duration-300`}>
          {title}
        </h2>
      </div>
      <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300 text-base md:text-lg">
        {description}
      </p>
    </div>
  );
};

export default function Product() {
  const themes = [
    {
      title: "Thema Adat",
      description: "Dengan pilihan 10+ adat populer yang bisa anda pilih untuk menciptakan pengalaman yang autentik dan berkesan",
      accentColor: "pink"
    },
    {
      title: "Thema Agama",
      description: "Indonesia dengan 6 agama resminya membentuk akulturasi budaya yang menawan dalam setiap perayaan",
      accentColor: "purple"
    },
    {
      title: "Thema Gen Z",
      description: "Desain modern dan trendy yang sesuai dengan selera generasi muda dengan sentuhan kontemporer yang menarik",
      accentColor: "blue"
    },
    {
      title: "Thema Luxury",
      description: "Kemewahan dan elegansi dalam setiap detail untuk menciptakan moment yang tak terlupakan sepanjang masa",
      accentColor: "emerald"
    }
  ];

  return (
    <>
      {/* Hero Title Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-4 md:mb-6">
            <span className="text-white/60 text-sm md:text-lg font-medium tracking-wider uppercase">
              Koleksi Eksklusif
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
            <span className="text-white animate-pulse">
              Dengan{" "}
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-black px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-black shadow-lg shadow-pink-500/30 animate-pulse">
                100+ thema
              </span>
            </span>
            <span className="text-white animate-pulse">
              {" "}yang kami sediakan
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-2">
            Temukan tema sempurna untuk momen spesial Anda dengan koleksi eksklusif yang telah dipilih khusus
          </p>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="relative flex h-200 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:2000px] mb-20">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
            {thirdRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {fourthRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {fiveRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {sixRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {sevenRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {sevenRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:20s]" vertical>
            {sevenRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>

      {/* Themes Section */}
      <div className="relative px-4 pb-20">
        {/* Section Header */}
        {/* <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-pink-400 text-lg font-medium tracking-wider uppercase">
              Kategori Tema
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent mb-6">
            Pilih Tema Sesuai Keinginan
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Setiap tema dirancang khusus untuk memberikan pengalaman yang tak terlupakan
          </p>
        </div> */}

        {/* Themes Grid */}
        {/* Garis Saling Memotong dengan Teks Tema */}
        <div className="relative w-full h-[500px] flex items-center justify-center my-20">
          {/* Garis Horizontal */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 -translate-y-1/2" />

          {/* Garis Vertikal */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/30 -translate-x-1/2" />

          {/* Tema di sekitar garis */}
          <div className="absolute grid grid-cols-2 grid-rows-2 gap-20 text-center text-white font-semibold text-lg">
            {/* Kiri Atas */}
            <div className="">
              <h3 className="text-xl md:text-4xl font-bold text-pink-400">Thema Adat</h3>
              <p className="text-white/60 mt-2">
                10+ pilihan adat populer yang autentik dan berkesan.
              </p>
            </div>

            {/* Kanan Atas */}
            <div className="">
              <h3 className="text-xl md:text-4xl font-bold text-purple-400">Thema Agama</h3>
              <p className="text-white/60 mt-2">
                Perpaduan budaya dan agama yang menawan.
              </p>
            </div>

            {/* Kiri Bawah */}
            <div className="">
              <h3 className="text-xl md:text-4xl font-bold text-blue-400">Thema Gen Z</h3>
              <p className="text-white/60 mt-2">
                Desain modern yang cocok untuk generasi muda.
              </p>
            </div>

            {/* Kanan Bawah */}
            <div className="">
              <h3 className="text-xl md:text-4xl font-bold text-emerald-400">Thema Luxury</h3>
              <p className="text-white/60 mt-2">
                Nuansa mewah dan elegan yang tak terlupakan.
              </p>
            </div>
          </div>
        </div>


        {/* Background decorative elements for themes section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className='max-w-4xl mx-auto text-center mt-16 md:mt-20'>
          <div className='bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12'>

            <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'>
                Siap untuk memulai?
              </span>
            </h3>

            <p className='text-gray-300 text-lg md:text-xl mb-8 leading-relaxed'>
              Bergabunglah dengan ribuan keluarga yang telah merasakan kebahagiaan bersama kami
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className='group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25'>
                <span className='flex items-center gap-2'>
                  Mulai Sekarang
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>→</span>
                </span>
              </button>

              <button className='group text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300'>
                <span className='flex items-center gap-2'>
                  Pelajari Lebih Lanjut
                  <span className='group-hover:rotate-45 transition-transform duration-300'>↗</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}