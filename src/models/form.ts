import supabase from '@/lib/supabase/client';
import {
  transformDataInvitationResponse,
  transformKeys,
  transformInvitationGiftResponse,
  transformInvitationGiftBankResponse,
  transformInvitationGiftWalletResponse,
} from '@/lib/utils';

import {convertKeysToSnakeCase} from '@/lib/toSnackCase'
import {
  InvitationDataUser,
  Invitation,
  InvitationEvent,
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
} from '@/types/interface';

class FormModels {
  async insertInvitation(invitation: Invitation) {
    try {
      const { data, error } = await supabase
        .from('INVITATION')
        .insert({
          USER_ID: invitation.userId,
          PRODUCT_ID: invitation.productId,
          INVITATION_URL: invitation.invitationUrl,
          INVITATION_STATUS: invitation.invitationStatus,
          VIEW_COUNT: 0,
          IS_DELETED: false,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting invitation:', error);
        throw error;
      }

      const result = transformDataInvitationResponse(data);

      return {
        success: true,
        invitationId: result.invitationId,
      };
    } catch (error) {
      console.error('Unexpected error in insertInvitation:', error);
      return {
        success: false,
        error: error,
      };
    }
  }

  async insertDataUser(dataUser: InvitationDataUser) {
    try {
      const { data, error } = await supabase
        .from('INVITATION_DATA_USER')
        .insert({
          INVITATION_ID: dataUser.invitationId,
          GROOM_FULL_NAME: dataUser.groomFullName,
          GROOM_NICK_NAME: dataUser.groomNickName,
          GROOM_PARENT_NAME: dataUser.groomParentName,
          GROOM_INSTAGRAM: dataUser.groomInstagram,
          GROOM_PHOTO_URL: dataUser.groomPhotoUrl,
          BRIDE_FULL_NAME: dataUser.brideFullName,
          BRIDE_NICK_NAME: dataUser.brideNickName,
          BRIDE_PARENT_NAME: dataUser.brideParentName,
          BRIDE_INSTAGRAM: dataUser.brideInstagram,
          BRIDE_PHOTO_URL: dataUser.bridePhotoUrl,
          GALLERY_PHOTOS: dataUser.galleryPhotos,
          IS_DELETED: false,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
          DELETED_AT: null,
        });

      const result = transformKeys(data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Unexpected error in insert data user:', error);
      return {
        success: false,
        error: error,
      };
    }
  }

  async invitationEvent(dataEvent: InvitationEvent) {
    try {
      const { data, error } = await supabase.from('INVITATION_EVENT').insert({
        INVITATION_ID: dataEvent.invitationId,
        EVENT_TYPE: dataEvent.eventType,
        LOCATION: dataEvent.location,
        LOCATION_DETAIL: dataEvent.locationDetail,
        MAPS_URL: dataEvent.mapsUrl,
        START_TIME: dataEvent.startTime,
        END_TIME: dataEvent.endTime,
        CREATED_AT: new Date().toISOString(),
        UPDATED_AT: new Date().toISOString(),
      });
      const result = transformKeys(data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Unexpected error in insertInvitation:', error);
      return {
        success: false,
        error: error,
      };
    }
  }

  async invitationGift(gift: InvitationGift) {
    try {
      const { data, error } = await supabase
        .from('INVITATION_GIFT')
        .insert({
          INVITATION_ID: gift.invitationId,
          ADDRESS: gift.address,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        })
        .select()
        .single();
      const result = transformInvitationGiftResponse(data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Unexpected error in insertInvitation:', error);
      return {
        success: false,
        error: error,
      };
    }
  }

  async insertBank(dataBank: InvitationGiftBank) {
    try {
      const { data, error } = await supabase
        .from('INVITATION_GIFT_BANK')
        .insert({
          GIFT_ID: dataBank.giftId,
          ACCOUNT: convertKeysToSnakeCase(dataBank.account),
          OWNER: dataBank.owner,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        })
        .select()
        .single();
      const result = transformInvitationGiftBankResponse(data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Unexpected error in insertInvitation:', error);
      return {
        success: false,
        error: error,
      };
    }
  }

  async insertWallet(dataWallet: InvitationGiftWallet) {
    try {
      const { data, error } = await supabase
        .from('INVITATION_GIFT_WALLET')
        .insert({
          GIFT_ID: dataWallet.giftId,
          ADDRESS: convertKeysToSnakeCase(dataWallet.address),
          OWNER: dataWallet.owner,
          CREATED_AT: new Date().toISOString(),
          UPDATED_AT: new Date().toISOString(),
        })
        .select()
        .single();
      const result = transformInvitationGiftWalletResponse(data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Unexpected error in insertInvitation:', error);
      return {
        success: false,
        error: error,
      };
    }
  }
}

export default new FormModels();
