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

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get upload URL: ${error}`);
  }

  const { uploadUrl, publicUrl } = await res.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  return publicUrl;
}

export async function deleteFromR2(key: string): Promise<void> {
  try {
    const res = await fetch('/api/r2/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete file');
    }

    const result = await res.json();
    console.log('Delete successful:', result);
  } catch (error) {
    console.error('Delete from R2 error:', error);
    throw error;
  }
}
