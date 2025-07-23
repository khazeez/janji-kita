import MagicBento from "@/components/layout/bento";

export default function Product() {
    return (
        <>
            {/* Gradient hitam transparan dari atas */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

            {/* Konten utama */}
            <div className="relative z-20 pt-20 px-5 lg:flex items-center text-center gap-6">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2">
                        Apa yang Anda Butuhkan?
                    </h1>
                    <p className="text-gray-300">
                        Semua yang diperlukan untuk terhubung ke keluarga Anda, kami sediakan.
                    </p>
                </div>

                <div className="w-full max-w-6xl">
                    <MagicBento />
                </div>
            </div>
        </>
    );
}
