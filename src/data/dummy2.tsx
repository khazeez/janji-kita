import {
  Invitation,
  InvitationDataUser,
  InvitationEvent,
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
} from '@/types/interface';

// ========== INVITATION DATA USER ==========
export const dummyInvitationDataUser: InvitationDataUser = {
  dataId: 'data-001',
  invitationId: 'invite-001',

  // Groom
  groomFullName: 'Andi Wijaya',
  groomNickName: 'Imam',
  groomParentName: 'Bapak Surya & Ibu Rina',
  groomInstagram: '@andiwijaya',
  groomPhotoUrl: '/images/andi.jpg',

  // Bride
  brideFullName: 'Siti Aisyah',
  brideNickName: 'Eka',
  brideParentName: 'Bapak Hadi & Ibu Lina',
  brideInstagram: '@siti.aisyah',
  bridePhotoUrl: '/images/siti.jpg',

  // Gallery & Love Story
  galleryPhotos: [
    { url: '/gallery/1.jpg', description: 'Pertemuan pertama di kampus' },
    { url: '/gallery/2.jpg', description: 'Lamaran di Bali' },
    { url: '/gallery/3.jpg', description: 'Foto prewedding' },
  ],
  loveStory: [
    {
      title: 'Awal Bertemu',
      description: 'Kami bertemu pertama kali di kampus pada tahun 2018.',
    },
    {
      title: 'Hubungan Serius',
      description:
        'Hubungan kami semakin serius ketika sama-sama lulus kuliah pada tahun 2021.',
    },
    {
      title: 'Lamaran',
      description:
        'Andi melamar Siti di Bali pada 10 Oktober 2024 dalam suasana romantis.',
    },
  ],

  isDeleted: false,
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-01-01T10:00:00Z',
};

// ========== INVITATION EVENTS ==========
export const dummyInvitationEvents: InvitationEvent[] = [
  {
    eventId: 'event-001',
    invitationId: 'invite-001',
    eventType: 'AKAD',
    location: 'Masjid Al-Falah',
    locationDetail: 'Jl. Melati No.10, Jakarta Selatan',
    mapsUrl: 'https://maps.google.com/?q=Masjid+Al-Falah',
    startTime: '2025-12-18T09:00:00Z',
    endTime: '2025-03-15T10:00:00Z',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    eventId: 'event-002',
    invitationId: 'invite-001',
    eventType: 'RESEPSI',
    location: 'Hotel Mulia Ballroom',
    locationDetail: 'Jl. Asia Afrika No.8, Jakarta',
    mapsUrl: 'https://maps.google.com/?q=Hotel+Mulia',
    startTime: '2025-03-15T13:00:00Z',
    endTime: '2025-03-15T16:00:00Z',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
];

// ========== GIFT BANK & WALLET ==========
export const dummyGiftBank: InvitationGiftBank = {
  giftBankId: 'bank-001',
  giftId: 'gift-001',
  account: [
    {
      bank_name: 'BCA',
      number: '1234567890',
      nama: 'Siti Aisyah',
    },
    {
      bank_name: 'BRI',
      number: '0987654321',
      nama: 'Andi Wijaya',
    },
  ],
  owner: 'BRIDE',
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-01-01T10:00:00Z',
};

export const dummyGiftWallet: InvitationGiftWallet = {
  giftWalletId: 'wallet-001',
  giftId: 'gift-001',
  address: [
    {
      network: 'Ethereum',
      walletAddress: '0xABCDEF123456789',
    },
    {
      network: 'Solana',
      walletAddress: '4ghjkYvTf34h98wQ...',
    },
  ],
  owner: 'GROOM',
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-01-01T10:00:00Z',
};

// ========== INVITATION GIFT ==========
export const dummyInvitationGift: InvitationGift = {
  giftId: 'gift-001',
  invitationId: 'invite-001',
  address: 'Jl. Mawar No.8, Jakarta Selatan',
  giftBank: dummyGiftBank,
  giftWallet: dummyGiftWallet,
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-01-01T10:00:00Z',
};

// ========== INVITATION MAIN ==========
export const dummyInvitation: Invitation = {
  invitationId: 'invite-001',
  userId: 'user-001',
  productId: 'prod-001',
  invitationUrl: 'andi-siti',
  invitationStatus: 'PUBLISHED',
  invitationDataUser: dummyInvitationDataUser,
  invitationEvent: dummyInvitationEvents,
  invitationGift: dummyInvitationGift,
  publishedAt: '2025-03-01T00:00:00Z',
  expiredAt: '2026-03-01T00:00:00Z',
  viewCount: 1245,
  isDeleted: false,
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-01-01T10:00:00Z',
};
