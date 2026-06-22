import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params;

  if (!invitationId) {
    return NextResponse.json(
      { success: false, error: 'Invitation ID is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('GUEST_BOOK')
      .select('*')
      .eq('INVITATION_ID', invitationId)
      .order('CREATED_AT', { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params;

  if (!invitationId) {
    return NextResponse.json(
      { success: false, error: 'Invitation ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { guestName, attendanceStatus, guestCount, message, ipAddress } = body;

    if (!guestName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama tamu wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('GUEST_BOOK')
      .insert([
        {
          INVITATION_ID: invitationId,
          GUEST_NAME: guestName.trim(),
          ATTENDANCE_STATUS: attendanceStatus || 'ATTENDING',
          GUEST_COUNT: guestCount || 1,
          MESSAGE: message?.trim() || null,
          IP_ADDRESS: ipAddress || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan yang tidak terduga' },
      { status: 500 }
    );
  }
}
