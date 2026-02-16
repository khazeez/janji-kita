import { AllInvitationData } from "@/types/interface";

export const mockInvitationData: AllInvitationData = {
  invitationId: "mock-id",
  userId: "mock-user",
  productId: "mock-product",
  invitationUrl: "romeo-juliet",
  invitationStatus: "published",
  publishedAt: new Date().toISOString(),
  expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
  viewCount: 1205,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: undefined,
  product: {
    productId: "mock-product",
    productName: "Premium Gold Theme",
    coverImage: "/images/theme-cover.jpg",
    segmentation: "Gold",
    tier: "Premium",
    basePriceNoPhoto: 150000,
    basePriceWithPhoto: 200000,
    promoPriceNoPhoto: 100000,
    promoPriceWithPhoto: 150000,
    features: ["Music", "Gallery", "RSVP"],
    isPromo: true,
    isNew: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  invitationDataUser: {
    dataId: "mock-data",
    invitationId: "mock-id",
    groomFullName: "Romeo Montague",
    groomNickName: "Romeo",
    groomParentName: "Bapak & Ibu Montague",
    groomInstagram: "romeo.montague",
    groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    brideFullName: "Juliet Capulet",
    brideNickName: "Juliet",
    brideParentName: "Bapak & Ibu Capulet",
    brideInstagram: "juliet.capulet",
    bridePhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=800&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
    ],
    loveStory: [],
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  invitationEvent: [
    {
      eventId: "event-1",
      invitationId: "mock-id",
      eventType: "AKAD",
      location: "Masjid Agung Verona",
      locationDetail: "Jl. Verona Pusat No. 1, Italy",
      mapsUrl: "https://maps.google.com",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      eventId: "event-2",
      invitationId: "mock-id",
      eventType: "RESEPSI",
      location: "Ballroom Hotel Verona",
      locationDetail: "Jl. Verona Selatan No. 88, Italy",
      mapsUrl: "https://maps.google.com",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  invitationGift: {
    giftId: "mock-gift",
    invitationId: "mock-id",
    address: [
      {
        AddressId: "addr-1", // Use property names as per interface usage, assuming basic structure 
        street: "Jl. Mantan Terindah No. 99, Jakarta Selatan" 
      }
    ],
    invitationGiftBank: [
      { 
        giftBankId: "bank-1", 
        giftId: "mock-gift", 
        account: "1234567890", 
        owner: "Romeo", 
        bankName: "BCA",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ],
    invitationGiftWallet: [
      { 
        giftWalletId: "wallet-1", 
        giftId: "mock-gift", 
        account: "08123456789", 
        owner: "Romeo", 
        walletName: "OVO",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  guestBook: []
};
