import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Invitation,
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
  AllInvitationData
} from '@/types/interface';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );
}

export function transformKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item));
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = transformKeys(obj[key]);
      return result;
    }, {} as any);
  }

  return obj;
}

export function transformInvitationResponse(
  dbResponse: any
): Invitation[] {
  return transformKeys(dbResponse) as Invitation[];
}

export function transformDataInvitationResponse(dbResponse: any): AllInvitationData {
  const data = transformKeys(dbResponse) as AllInvitationData;

  // Fix Gift Banks: Unpack JSON from 'account' column
  if (data.invitationGift?.invitationGiftBank) {
      data.invitationGift.invitationGiftBank = data.invitationGift.invitationGiftBank.map((bank: any) => {
          if (bank.account && typeof bank.account === 'object' && !Array.isArray(bank.account)) {
              return { ...bank, ...bank.account };
          }
          if (Array.isArray(bank.account) && bank.account.length > 0) {
              return { ...bank, ...bank.account[0] };
          }
          return bank;
      });
  }

  // Fix Gift Wallets: Unpack JSON from 'address' column
  if (data.invitationGift?.invitationGiftWallet) {
      data.invitationGift.invitationGiftWallet = data.invitationGift.invitationGiftWallet.map((wallet: any) => {
          if (wallet.address && typeof wallet.address === 'object' && !Array.isArray(wallet.address)) {
              return { ...wallet, ...wallet.address };
          }
          if (Array.isArray(wallet.address) && wallet.address.length > 0) {
               return { ...wallet, ...wallet.address[0] };
          }
          return wallet;
      });
  }

  return data;
}

export function transformInvitationGiftResponse(dbResponse: any): InvitationGift {
  const data = transformKeys(dbResponse) as InvitationGift;

  if (data.invitationGiftBank) {
      data.invitationGiftBank = data.invitationGiftBank.map((bank: any) => {
          if (bank.account && typeof bank.account === 'object' && !Array.isArray(bank.account)) {
              return { ...bank, ...bank.account };
          }
          if (Array.isArray(bank.account) && bank.account.length > 0) {
              return { ...bank, ...bank.account[0] };
          }
          return bank;
      });
  }

  if (data.invitationGiftWallet) {
      data.invitationGiftWallet = data.invitationGiftWallet.map((wallet: any) => {
          if (wallet.address && typeof wallet.address === 'object' && !Array.isArray(wallet.address)) {
              return { ...wallet, ...wallet.address };
          }
          if (Array.isArray(wallet.address) && wallet.address.length > 0) {
               return { ...wallet, ...wallet.address[0] };
          }
          return wallet;
      });
  }

  return data;
}

export function transformInvitationGiftBankResponse(
  dbResponse: any
): InvitationGiftBank {
  return transformKeys(dbResponse) as InvitationGiftBank;
}

export function transformInvitationGiftWalletResponse(
  dbResponse: any
): InvitationGiftWallet {
  return transformKeys(dbResponse) as InvitationGiftWallet;
}







