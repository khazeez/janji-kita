export interface BrideGroomData {
  brideName: string;
  brideNickName: string
  brideParents: string;
  groomName: string;
  groomNickName: string
  groomParents: string;
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

export interface VenueData {
  akadVenue: string;
  akadAddress: string;
  akadDate: string;
  akadTime: string;
  hasResepsi: boolean;
  resepsiVenue: string;
  resepsiAddress: string;
  resepsiDate: string;
  resepsiTime: string;
};