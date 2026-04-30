import { NextResponse } from 'next/server';
import { getFavoriteProducts, toggleFavorite } from '@/models/favorites';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const favorites = await getFavoriteProducts(userId);
    return NextResponse.json({ data: favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
    }

    const result = await toggleFavorite(userId, productId);

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true, isFavorite: result.isFavorite });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
