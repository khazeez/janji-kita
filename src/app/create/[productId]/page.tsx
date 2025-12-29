'use client';
import { useParams, useSearchParams } from 'next/navigation';
import Form1 from '@/components/form/FormWithNoPhoto';
import Form2 from '@/components/form/FormWithPhoto';

export default function Form() {
  // Ambil slug dari params
  const params = useParams();
  const slug = params?.slug as string; // "Glasses"

  // Ambil query params
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant'); // "no-photo"

  // Kondisi untuk menampilkan form
  const showForm1 = variant === 'no-photo';

  return <>{showForm1 ? <Form1 /> : <Form2/> }</>;
}
