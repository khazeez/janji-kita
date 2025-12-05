

export default function ResepsiSection({ dataResepsi, resepsiTime }: Props) {
  return (
    <div>
      <h2>Resepsi</h2>
      <p>Lokasi: {dataResepsi.location}</p>
      <p>Tanggal: {dataResepsi.date}</p>

      <p>Jam mulai: {resepsiTime.start}</p>
      <p>Jam selesai: {resepsiTime.end}</p>
    </div>
  );
}
