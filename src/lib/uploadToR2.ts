export async function uploadToR2(
  blob: Blob,
  key: string,
  contentType = 'image/webp'
) {
  const res = await fetch('/api/r2/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, contentType }),
  });

  const { uploadUrl, publicUrl } = await res.json();

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  return publicUrl;
}
