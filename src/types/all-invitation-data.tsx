import {
  Invitation,
  Product,
  InvitationDataUser,
  InvitationGift,
  InvitationEvent,
  GuestBook,
} from './interface';

export interface AllInvitationData extends Omit<Invitation, 'productId'> {
    product: Product;
    invitationDataUser: InvitationDataUser;
    invitationGift: InvitationGift;
    invitationEvent: InvitationEvent[];
    guestBook: GuestBook[];

}
