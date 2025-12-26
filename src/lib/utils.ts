import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Invitation,
  InvitationGift,
  InvitationGiftBank,
  InvitationGiftWallet,
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

export function transformInvitationResponse(dbResponse: any): Invitation {
  return transformKeys(dbResponse) as Invitation;
}

export function transformInvitationGiftResponse(
  dbResponse: any
): InvitationGift {
  return transformKeys(dbResponse) as InvitationGift;
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







