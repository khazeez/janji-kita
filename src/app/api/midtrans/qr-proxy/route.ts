import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,
        Accept: 'image/png, image/*',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch QR code' }, { status: 502 });
    }

    const blob = await res.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
