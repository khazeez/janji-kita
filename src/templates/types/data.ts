export interface BankAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export interface Wallet {
  wallet_name: string;
  wallet_number: string;
  wallet_holder: string;
}

export interface WeddingData {
  data_id: string;
  invitation_id: string;
  invitation_link: string;
  groom_full_name: string;
  groom_nick_name: string;
  groom_parent_name?: string;
  groom_instagram?: string;
  groom_photo_url?: string;
  bride_full_name: string;
  bride_nick_name: string;
  bride_parent_name?: string;
  bride_instagram?: string;
  bride_photo_url?: string;
  gallery_photos: string[];
  akad_datetime: string;
  akad_location: string;
  akad_address: string;
  akad_maps_url?: string;
  reseption_datetime: string;
  reseption_location: string;
  reseption_address: string;
  reseption_maps_url?: string;
  reseption_datetime_2: string;
  reseption_location_2: string;
  reseption_address_2: string;
  reseption_maps_url_2?: string;
  gift_address?: string;
  groom_bank_accounts: BankAccount[];
  bride_bank_accounts: BankAccount[];
  groom_wallets: Wallet[];
  bride_wallets: Wallet[];
  love_story?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
