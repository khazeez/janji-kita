import { useState } from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Loader,
  ArrowLeft,
  User,
} from 'lucide-react';

interface InvitationType {
  id: string;
  orderNumber: string;
  eventName: string;
  clientName: string;
  eventDate: string;
  location: string;
  status: 'in_progress' | 'done';
  currentStep: 'submitted' | 'review' | 'done';
  thumbnail: string;
  createdDate: string;
  brideData: {
    fullName: string;
    nickname: string;
    fatherName: string;
    motherName: string;
    instagram?: string;
  };
  groomData: {
    fullName: string;
    nickname: string;
    fatherName: string;
    motherName: string;
    instagram?: string;
  };
}

export default function InvitationProgress() {
  const [selectedInvitation, setSelectedInvitation] =
    useState<InvitationType | null>(null);
  const [invitations] = useState<InvitationType[]>([
    {
      id: '1',
      orderNumber: 'INV-2024-001',
      eventName: 'Wedding Sarah & John',
      clientName: 'Sarah Johnson',
      eventDate: '15 Desember 2024',
      location: 'Grand Ballroom Hotel Jakarta',
      status: 'in_progress',
      currentStep: 'review',
      thumbnail: '💍',
      createdDate: '05 Nov 2024',
      brideData: {
        fullName: 'Sarah Elizabeth Johnson',
        nickname: 'Sarah',
        fatherName: 'Robert Johnson',
        motherName: 'Maria Johnson',
        instagram: '@sarahjohnson',
      },
      groomData: {
        fullName: 'John Michael Smith',
        nickname: 'John',
        fatherName: 'David Smith',
        motherName: 'Jennifer Smith',
        instagram: '@johnsmith',
      },
    },
    {
      id: '2',
      orderNumber: 'INV-2024-002',
      eventName: 'Wedding Rina & Budi',
      clientName: 'Rina Kartika',
      eventDate: '20 November 2024',
      location: 'The Garden Restaurant',
      status: 'done',
      currentStep: 'done',
      thumbnail: '💒',
      createdDate: '01 Nov 2024',
      brideData: {
        fullName: 'Rina Kartika Sari',
        nickname: 'Rina',
        fatherName: 'Budi Santoso',
        motherName: 'Siti Nurhaliza',
        instagram: '@rinakartika',
      },
      groomData: {
        fullName: 'Budi Prasetyo',
        nickname: 'Budi',
        fatherName: 'Ahmad Prasetyo',
        motherName: 'Dewi Lestari',
        instagram: '@budiprasetyo',
      },
    },
    {
      id: '3',
      orderNumber: 'INV-2024-003',
      eventName: 'Wedding Amanda & Kevin',
      clientName: 'Amanda Wilson',
      eventDate: '10 Januari 2025',
      location: 'Balai Samudra, Ancol',
      status: 'in_progress',
      currentStep: 'submitted',
      thumbnail: '💐',
      createdDate: '08 Nov 2024',
      brideData: {
        fullName: 'Amanda Grace Wilson',
        nickname: 'Amanda',
        fatherName: 'James Wilson',
        motherName: 'Patricia Wilson',
        instagram: '@amandawilson',
      },
      groomData: {
        fullName: 'Kevin Alexander Brown',
        nickname: 'Kevin',
        fatherName: 'Michael Brown',
        motherName: 'Susan Brown',
        instagram: '@kevinbrown',
      },
    },
  ]);

  const getStatusBadge = (status: string) => {
    if (status === 'done') {
      return (
        <div className='flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full'>
          <CheckCircle size={14} className='text-green-400' />
          <span className='text-xs font-medium text-green-400'>Selesai</span>
        </div>
      );
    }
    return (
      <div className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 border border-blue-700 rounded-full'>
        <Loader size={14} className='text-blue-400 animate-spin' />
        <span className='text-xs font-medium text-blue-400'>In Progress</span>
      </div>
    );
  };

  const renderProgressSteps = (currentStep: string) => {
    const steps = [
      { id: 'submitted', label: 'Submitted Data' },
      { id: 'review', label: 'Review Admin' },
      { id: 'done', label: 'Done' },
    ];

    const currentIndex = steps.findIndex((step) => step.id === currentStep);

    return (
      <div className='flex items-center justify-between w-full'>
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.id}
              className='flex items-center flex-1 last:flex-none'
            >
              <div className='flex flex-col items-center'>
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-pink-600 border-pink-600'
                      : 'bg-gray-700 border-gray-600'
                  } ${isCurrent ? 'ring-4 ring-pink-500/30' : ''}`}
                >
                  {isActive ? (
                    <CheckCircle
                      size={16}
                      className='text-white md:w-5 md:h-5'
                    />
                  ) : (
                    <span className='text-gray-400 text-xs md:text-sm font-bold'>
                      {index + 1}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[10px] md:text-xs mt-1.5 md:mt-2 text-center max-w-[70px] md:max-w-none ${
                    isActive ? 'text-white font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 md:mx-2 mb-6 md:mb-7 transition-all ${
                    index < currentIndex ? 'bg-pink-600' : 'bg-gray-700'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (selectedInvitation) {
    return (
      <div className='min-h-screen bg-gray-900 p-4 md:p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Back Button */}
          <button
            onClick={() => setSelectedInvitation(null)}
            className='flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors'
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>

          {/* Detail Header */}
          <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3 md:gap-4'>
                <div className='text-3xl md:text-5xl'>
                  {selectedInvitation.thumbnail}
                </div>
                <div>
                  <h1 className='text-lg md:text-2xl font-bold text-white mb-1 md:mb-2'>
                    {selectedInvitation.eventName}
                  </h1>
                  <p className='text-gray-400 text-xs md:text-sm mb-2'>
                    Order: {selectedInvitation.orderNumber}
                  </p>
                  {getStatusBadge(selectedInvitation.status)}
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className='mt-4 md:mt-6'>
              <h3 className='text-xs md:text-sm text-gray-400 mb-3 md:mb-4'>
                Status Pengerjaan
              </h3>
              {renderProgressSteps(selectedInvitation.currentStep)}
            </div>
          </div>

          {/* Event Details */}
          <div className='bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6'>
            <h2 className='text-lg font-bold text-white mb-4'>Detail Acara</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-start gap-3'>
                <User size={20} className='text-pink-500 mt-0.5' />
                <div>
                  <p className='text-gray-400 text-xs mb-1'>Nama Klien</p>
                  <p className='text-white'>{selectedInvitation.clientName}</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Calendar size={20} className='text-pink-500 mt-0.5' />
                <div>
                  <p className='text-gray-400 text-xs mb-1'>Tanggal Acara</p>
                  <p className='text-white'>{selectedInvitation.eventDate}</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <MapPin size={20} className='text-pink-500 mt-0.5' />
                <div>
                  <p className='text-gray-400 text-xs mb-1'>Lokasi</p>
                  <p className='text-white'>{selectedInvitation.location}</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Clock size={20} className='text-pink-500 mt-0.5' />
                <div>
                  <p className='text-gray-400 text-xs mb-1'>Tanggal Order</p>
                  <p className='text-white'>{selectedInvitation.createdDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bride & Groom Data */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6'>
            {/* Bride Data */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6'>
              <div className='flex items-center gap-2 mb-3 md:mb-4'>
                <Heart size={16} className='text-pink-500 md:w-5 md:h-5' />
                <h2 className='text-sm md:text-lg font-bold text-white'>
                  Data Mempelai Wanita
                </h2>
              </div>
              <div className='space-y-2 md:space-y-3'>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Lengkap
                  </p>
                  <p className='text-white font-medium text-xs md:text-base'>
                    {selectedInvitation.brideData.fullName}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Panggilan
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.brideData.nickname}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Ayah
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.brideData.fatherName}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Ibu
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.brideData.motherName}
                  </p>
                </div>
                {selectedInvitation.brideData.instagram && (
                  <div>
                    <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                      Instagram
                    </p>
                    <p className='text-pink-500 text-xs md:text-base'>
                      {selectedInvitation.brideData.instagram}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Groom Data */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6'>
              <div className='flex items-center gap-2 mb-3 md:mb-4'>
                <Heart size={16} className='text-blue-500 md:w-5 md:h-5' />
                <h2 className='text-sm md:text-lg font-bold text-white'>
                  Data Mempelai Pria
                </h2>
              </div>
              <div className='space-y-2 md:space-y-3'>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Lengkap
                  </p>
                  <p className='text-white font-medium text-xs md:text-base'>
                    {selectedInvitation.groomData.fullName}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Panggilan
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.groomData.nickname}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Ayah
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.groomData.fatherName}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                    Nama Ibu
                  </p>
                  <p className='text-white text-xs md:text-base'>
                    {selectedInvitation.groomData.motherName}
                  </p>
                </div>
                {selectedInvitation.groomData.instagram && (
                  <div>
                    <p className='text-gray-400 text-[10px] md:text-xs mb-1'>
                      Instagram
                    </p>
                    <p className='text-blue-500 text-xs md:text-base'>
                      {selectedInvitation.groomData.instagram}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedInvitation.status === 'done' && (
            <div className='mt-6 flex gap-3'>
              <button className='flex-1 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors'>
                Lihat Preview
              </button>
              <button className='flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors'>
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* <div className='flex items-center mb-6'>
          <h1 className='text-2xl font-bold text-white'>
            Progres Undangan
          </h1>
        </div> */}

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              onClick={() => setSelectedInvitation(invitation)}
              className='bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-pink-500 transition-all cursor-pointer'
            >
              {/* Card Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='text-4xl'>{invitation.thumbnail}</div>
                {getStatusBadge(invitation.status)}
              </div>

              {/* Event Info */}
              <h3 className='text-sm md:text-lg font-bold text-white mb-1 md:mb-2 group-hover:text-pink-500 transition-colors'>
                {invitation.eventName}
              </h3>
              <p className='text-gray-400 text-xs md:text-sm mb-1'>
                {invitation.clientName}
              </p>
              <div className='flex items-center gap-2 text-gray-500 text-[10px] md:text-xs mb-4'>
                <Calendar size={12} className='md:w-3.5 md:h-3.5' />
                <span>{invitation.eventDate}</span>
              </div>

              {/* Progress Steps - Compact */}
              <div className='mb-3'>
                <div className='flex items-center justify-between'>
                  {[
                    { id: 'submitted', label: 'Submitted' },
                    { id: 'review', label: 'Review' },
                    { id: 'done', label: 'Done' },
                  ].map((step, index) => {
                    const steps = ['submitted', 'review', 'done'];
                    const currentIndex = steps.indexOf(invitation.currentStep);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div
                        key={step.id}
                        className='flex items-center flex-1 last:flex-none'
                      >
                        <div className='flex flex-col items-center'>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted || isCurrent
                                ? 'bg-pink-600 border-pink-600'
                                : 'bg-gray-700 border-gray-600'
                            } ${isCurrent ? 'ring-2 ring-pink-500/40' : ''}`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={12} className='text-white' />
                            ) : (
                              <span className='text-white text-[10px] font-bold'>
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[9px] mt-1 text-center max-w-[50px] leading-tight ${
                              isCompleted || isCurrent
                                ? 'text-pink-400 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < 2 && (
                          <div
                            className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${
                              isCompleted ? 'bg-pink-600' : 'bg-gray-700'
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className='pt-3 border-t border-gray-700'>
                <p className='text-gray-500 text-[10px] md:text-xs'>
                  Order: {invitation.orderNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
