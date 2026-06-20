import useSWR, { mutate } from 'swr';
import {
  getProductInvitation,
  getDataInvitationUserByUserId,
  getGuestBook,
  getProductByName,
  getInvitation,
} from '@/models/invitations';
import supabase from '@/lib/supabase/client';
import { AllInvitationData, Product, GuestBook } from '@/types/interface';

export function useProducts() {
  return useSWR<Product[]>('products', () => getProductInvitation(), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useUserInvitations(userId: string | undefined) {
  return useSWR<AllInvitationData[]>(
    userId ? ['user-invitations', userId] : null,
    () => getDataInvitationUserByUserId(userId!) as unknown as Promise<AllInvitationData[]>,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useGuestBook(invitationId: string | undefined) {
  return useSWR(
    invitationId ? ['guest-book', invitationId] : null,
    () => getGuestBook(invitationId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export function useProductByName(productName: string | undefined) {
  return useSWR(
    productName ? ['product-by-name', productName] : null,
    () => getProductByName(productName!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

export function useCurrentUser() {
  return useSWR('current-user', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });
}

export function useInvitations(userId: string | undefined) {
  return useSWR(
    userId ? ['invitations', userId] : null,
    () => getInvitation(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

// ============================================
// Favorites Hooks
// ============================================

async function fetchFavorites(userId: string): Promise<Product[]> {
  const res = await fetch(`/api/favorites?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  const result = await res.json();
  return result.data || [];
}

export function useFavorites(userId: string | undefined) {
  return useSWR<Product[]>(
    userId ? ['favorites', userId] : null,
    () => fetchFavorites(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );
}

export async function toggleFavoriteProduct(userId: string, productId: string, isFavorite: boolean): Promise<boolean> {
  const res = await fetch('/api/favorites', {
    method: isFavorite ? 'DELETE' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) throw new Error('Failed to toggle favorite');

  mutate(['favorites', userId]);
  return !isFavorite;
}
