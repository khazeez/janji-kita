import supabase from '@/lib/supabase/client';
import {
  transformKeys,
  transformInvitationGiftResponse,
  transformInvitationGiftBankResponse,
  transformInvitationGiftWalletResponse,
} from '@/lib/utils';
import { convertKeysToSnakeCase } from '@/lib/toSnackCase';
import {
  Invitation,
  InvitationDataUser,
  InvitationEvent,
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
} from '@/types/interface';

class EditorModels {
  // Update Basic Info (Bride & Groom)
  async updateInvitationDataUser(dataUser: Partial<InvitationDataUser>) {
    try {
      if (!dataUser.invitationId) throw new Error('Invitation ID is required');

      const updateData: any = {
        UPDATED_AT: new Date().toISOString(),
      };

      if (dataUser.groomFullName !== undefined) updateData.GROOM_FULL_NAME = dataUser.groomFullName;
      if (dataUser.groomNickName !== undefined) updateData.GROOM_NICK_NAME = dataUser.groomNickName;
      if (dataUser.groomParentName !== undefined) updateData.GROOM_PARENT_NAME = dataUser.groomParentName;
      if (dataUser.groomInstagram !== undefined) updateData.GROOM_INSTAGRAM = dataUser.groomInstagram;
      if (dataUser.groomPhotoUrl !== undefined) updateData.GROOM_PHOTO_URL = dataUser.groomPhotoUrl;
      
      if (dataUser.brideFullName !== undefined) updateData.BRIDE_FULL_NAME = dataUser.brideFullName;
      if (dataUser.brideNickName !== undefined) updateData.BRIDE_NICK_NAME = dataUser.brideNickName;
      if (dataUser.brideParentName !== undefined) updateData.BRIDE_PARENT_NAME = dataUser.brideParentName;
      if (dataUser.brideInstagram !== undefined) updateData.BRIDE_INSTAGRAM = dataUser.brideInstagram;
      if (dataUser.bridePhotoUrl !== undefined) updateData.BRIDE_PHOTO_URL = dataUser.bridePhotoUrl;
      
      if (dataUser.galleryPhotos !== undefined) updateData.GALLERY_PHOTOS = dataUser.galleryPhotos;
      if (dataUser.loveStory !== undefined) updateData.LOVE_STORY = dataUser.loveStory;
      if (dataUser.audioUrl !== undefined) updateData.AUDIO_URL = dataUser.audioUrl;

      const { data, error } = await supabase
        .from('INVITATION_DATA_USER')
        .update(updateData)
        .eq('INVITATION_ID', dataUser.invitationId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: transformKeys(data),
      };
    } catch (error) {
      console.error('Error updating data user:', error);
      return { success: false, error };
    }
  }

  // Update Event
  async updateInvitationEvent(event: Partial<InvitationEvent>) {
    try {
      if (!event.eventId) throw new Error('Event ID is required');

      const updateData = {
        LOCATION: event.location,
        LOCATION_DETAIL: event.locationDetail,
        MAPS_URL: event.mapsUrl,
        START_TIME: event.startTime,
        END_TIME: event.endTime,
        UPDATED_AT: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('INVITATION_EVENT')
        .update(updateData)
        .eq('EVENT_ID', event.eventId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: transformKeys(data),
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error };
    }
  }

  // Update Gift Address
  async updateInvitationGift(gift: Partial<InvitationGift>) {
    try {
      if (!gift.giftId) throw new Error('Gift ID is required');

      const { data, error } = await supabase
        .from('INVITATION_GIFT')
        .update({
          ADDRESS: gift.address,
          UPDATED_AT: new Date().toISOString(),
        })
        .eq('GIFT_ID', gift.giftId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: transformInvitationGiftResponse(data),
      };
    } catch (error) {
      console.error('Error updating gift:', error);
      return { success: false, error };
    }
  }

  // Update Gift Banks — delete all + re-insert
  async updateInvitationGiftBank(giftId: string, banks: InvitationGiftBank[]) {
    try {
      // Delete existing banks for this gift
      const { error: delError } = await supabase
        .from('INVITATION_GIFT_BANK')
        .delete()
        .eq('GIFT_ID', giftId);

      if (delError) throw delError;

      // Insert current banks
      if (banks.length > 0) {
        const rows = banks.map((b) => ({
          GIFT_ID: giftId,
          ACCOUNT: convertKeysToSnakeCase(b.account),
          OWNER: b.owner,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        }));

        const { data, error: insError } = await supabase
          .from('INVITATION_GIFT_BANK')
          .insert(rows)
          .select();

        if (insError) throw insError;

        return {
          success: true,
          data: data ? data.map(transformInvitationGiftBankResponse) : [],
        };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error('Error updating gift banks:', error);
      return { success: false, error };
    }
  }

  // Update Gift Wallets — delete all + re-insert
  async updateInvitationGiftWallet(giftId: string, wallets: InvitationGiftWallet[]) {
    try {
      // Delete existing wallets for this gift
      const { error: delError } = await supabase
        .from('INVITATION_GIFT_WALLET')
        .delete()
        .eq('GIFT_ID', giftId);

      if (delError) throw delError;

      // Insert current wallets
      if (wallets.length > 0) {
        const rows = wallets.map((w) => ({
          GIFT_ID: giftId,
          ADDRESS: convertKeysToSnakeCase(w.address),
          OWNER: w.owner,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        }));

        const { data, error: insError } = await supabase
          .from('INVITATION_GIFT_WALLET')
          .insert(rows)
          .select();

        if (insError) throw insError;

        return {
          success: true,
          data: data ? data.map(transformInvitationGiftWalletResponse) : [],
        };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error('Error updating gift wallets:', error);
      return { success: false, error };
    }
  }
}

export default new EditorModels();
