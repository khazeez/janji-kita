import { NextResponse } from 'next/server';
import { getTransactionsByUserId } from '@/models/transactions';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const transactions = await getTransactionsByUserId(userId);
    return NextResponse.json({ data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
