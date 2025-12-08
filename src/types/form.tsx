export interface BrideGroomData {
  brideName: string;
  brideNickName: string
  brideParents: string;
  groomInstagram: string;
  groomName: string;
  groomNickName: string
  groomParents: string;
  brideInstagram: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  owner: 'bride' | 'groom';
}

export interface Wallet {
  id: string;
  address: string;
  chain: string;
  owner: 'bride' | 'groom';
}

export interface GiftData {
  accounts: BankAccount[];
  wallets: Wallet[];
  address: string;
}

export interface EVMChain {
  value: string;
  label: string;
  color: string;
}

export interface LinkData {
  link: string;
}

export type ResepsiEvent = {
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  mapsUrl: string;
  description: string; // ← Keterangan tambahan
};

export type VenueData = {
  // Akad
  akadVenue: string;
  akadAddress: string;
  akadStartDate: string;
  akadEndDate: string;
  akadStartTime: string;
  akadEndTime: string;
  akadMapsUrl: string; // ← Link Google Maps
  
  // Resepsi (optional, multiple events)
  resepsiEvents?: ResepsiEvent[];
};