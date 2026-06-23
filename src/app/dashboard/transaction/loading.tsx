export default function Loading() {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-xs">Memuat transaksi...</p>
      </div>
    </div>
  );
}
