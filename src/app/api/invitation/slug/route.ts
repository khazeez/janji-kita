import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { invitationId, newUrl } = await req.json();

    if (!invitationId || !newUrl) {
      return NextResponse.json({ error: 'invitationId and newUrl are required' }, { status: 400 });
    }

    // Verify ownership
    const { data: inv, error: invError } = await supabase
      .from('INVITATION')
      .select('USER_ID')
      .eq('INVITATION_ID', invitationId)
      .single();

    if (invError || !inv) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (inv.USER_ID !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check uniqueness
    const admin = getAdminClient();
    const { data: existing } = await admin
      .from('INVITATION')
      .select('INVITATION_ID')
      .eq('INVITATION_URL', newUrl)
      .neq('INVITATION_ID', invitationId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan undangan lain' }, { status: 409 });
    }

    // Update slug using admin client (bypasses RLS)
    const { error: updateError } = await admin
      .from('INVITATION')
      .update({
        INVITATION_URL: newUrl,
        UPDATED_AT: new Date().toISOString(),
      })
      .eq('INVITATION_ID', invitationId);

    if (updateError) {
      console.error('Error updating slug:', updateError);
      return NextResponse.json({ error: 'Gagal mengupdate slug' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Slug update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
