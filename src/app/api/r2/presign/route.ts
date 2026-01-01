import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Daftar content type yang diizinkan
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
  'application/zip',
];

// Maksimal ukuran file (dalam bytes) - contoh: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const { key, contentType, fileSize } = await req.json();

    // Validasi input
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Key is required and must be a string' },
        { status: 400 }
      );
    }

    if (!contentType || typeof contentType !== 'string') {
      return NextResponse.json(
        { error: 'Content type is required and must be a string' },
        { status: 400 }
      );
    }

    // Validasi content type
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'Content type not allowed' },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Sanitasi key untuk mencegah path traversal
    const sanitizedKey = key.replace(/\.\./g, '').replace(/^\/+/, '');

    // Buat command dengan metadata tambahan
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: sanitizedKey,
      ContentType: contentType,
      Metadata: {
        'upload-timestamp': new Date().toISOString(),
      },
    });

    // Generate signed URL dengan expiry 60 detik
    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: 60,
    });

    // Return response dengan CORS headers
    return NextResponse.json(
      {
        success: true,
        uploadUrl,
        publicUrl: `${process.env.R2_PUBLIC_URL}/${sanitizedKey}`,
        expiresIn: 60,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*', // Ganti dengan domain spesifik di production
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Upload URL generation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate upload URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request untuk CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Ganti dengan domain spesifik di production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
