export interface Profile {
  userId: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  isActive: boolean;
  loginMethod: 'email' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface UserCredential {
  credentialId: string;
  userId: string;
  passwordHash?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialReset {
  resetId: string;
  userId: string;
  token: string;
  requestedAt: string;
  usedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
}


export interface Product {
  productId: string;
  designId: string;
  productName: string;
  coverImage: string;
  segmentation:
  | 'adat'
  | 'modern'
  | 'klasik'
  | 'rustic'
  | 'minimalis'
  | 'elegant';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  basePriceNoPhoto: number;
  basePriceWithPhoto?: number;
  promoPriceNoPhoto: number;
  promoPriceWithPhoto?: number;
  features: any[]; // bisa kamu buat tipe khusus nanti
  isPromo: boolean;
  productType: 'web' | 'video' | 'filter';
  description: string;
  isNew: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Promo {
  promoId: string;
  promoCode: string;
  promoName: string;
  promoType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Invitation {
  invitationId: string;
  userId: string;
  productId: string;
  invitationUrl: string;
  invitationStatus:
  | 'draft'
  | 'in-progress'
  | 'completed'
  | 'published'
  | 'expired';
  invitationDataUser: InvitationDataUser;
  invitationEvent: InvitationEvent[];
  invitationGift: InvitationGift;
  guestBook: GuestBook[];
  publishedAt?: string;
  expiredAt?: string;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface InvitationDataUser {
  dataId: string;
  invitationId: string;

  // Groom
  groomFullName: string;
  groomNickName: string;
  groomParentName?: string;
  groomInstagram?: string;
  groomPhotoUrl?: string;

  // Bride
  brideFullName: string;
  brideNickName: string;
  brideParentName?: string;
  brideInstagram?: string;
  bridePhotoUrl?: string;

  // Gallery & Story
  galleryPhotos: any[];
  loveStory: any[];
  audioUrl?: string;

  // Meta
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface InvitationEvent {
  eventId: string;
  invitationId: string;
  eventType: 'AKAD' | 'RESEPSI' | 'OTHER';
  location: string;
  locationDetail: string;
  mapsUrl: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationGift {
  giftId: string;
  invitationId: string;
  address?: string;
  invitationGiftBank: InvitationGiftBank[];
  invitationGiftWallet: InvitationGiftWallet[]
  createdAt: string;
  updatedAt: string;
}

export interface InvitationGiftBank {
  giftBankId?: string;
  giftId?: string;
  bankName: string;
  account: string;
  accountHolder: string;
  owner: 'BRIDE' | 'GROOM';
  createdAt?: string;
  updatedAt?: string;
}

export interface InvitationGiftWallet {
  giftWalletId?: string;
  giftId?: string;
  walletName: string;
  account: string;
  accountHolder: string;
  owner: 'BRIDE' | 'GROOM';
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'E_WALLET'
  | 'CREDIT_CARD'
  | 'QRIS';


export interface Transactions {
  // Identity
  transactionId: string;
  userId: string;
  invitationId: string;
  productId: string;
  promoId?: string | null;

  // Pricing
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;

  gatewayOrderId: string;
  gatewayTransactionId?: string | null;
  paymentProofUrl?: string | null;

  // Time
  paidAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  expiredAt?: string | null;

  createdAt: string;
  updatedAt: string;
}


export interface GuestBook {
  guestId: string;
  invitationId: string;
  guestName: string;
  attendanceStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
  guestCount: number;
  message?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AuditLog {
  logId: string;
  userId?: string;
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}


export interface PhotoData{
  groomPhoto: string;
  bridePhoto: string;
  gallery: any[]
}

export interface NotificationType {
  id: string;
  type: 'info' | 'success' | 'warning' | 'promo';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}


export interface AllInvitationData extends Omit<Invitation, 'productId'> {
    product: Product;
    invitationDataUser: InvitationDataUser;
    invitationGift: InvitationGift;
    invitationEvent: InvitationEvent[];
    guestBook: GuestBook[];

}