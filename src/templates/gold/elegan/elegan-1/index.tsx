import React from 'react';
import dummyWeddingData from '@/data/dummyData';
import { WeddingData } from '@/templates/types/data'; 


interface Props {
  data: WeddingData;
}

export default function Glasses({ data }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
    
    </>
  );
}
