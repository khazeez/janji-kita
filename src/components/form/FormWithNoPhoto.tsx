'use client';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';

//interface
import {
  Invitation,
  InvitationDataUser,
  InvitationEvent,
  InvitationGift,
} from '@/types/interface';

// Komponen form
import BrideGroomDataInput from '@/components/layout/form-ui/BridegroomDataInput';
import VenueDataInput from '@/components/layout/form-ui/VenueDataInput';
import GiftDataInput from '@/components/layout/form-ui/GiftDataInput';
import LinkDataInput from '@/components/layout/form-ui/LinkDataInput';
import ConfirmationScreen from '@/components/layout/form-ui/ConfirmationScreen';
import ResultScreenSuccsess from '../layout/form-ui/Result';

// function untuk insert data
import insertData from '@/models/form';

export default function Form1() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [invitationId, setInvitationId] = useState<string | undefined>('');
  const [userId, setUserId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const totalSteps = 5;

  // Ambil param
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params?.productId as string; // Dari /create/[productId]
  const variant = searchParams.get('variant'); // Dari ?variant=no-photo

  // State untuk InvitationDataUser
  const [invitationDataUser, setInvitationDataUser] =
    useState<InvitationDataUser>({
      dataId: '',
      invitationId: '',
      groomFullName: '',
      groomNickName: '',
      groomParentName: '',
      groomInstagram: '',
      groomPhotoUrl: '',
      brideFullName: '',
      brideNickName: '',
      brideParentName: '',
      brideInstagram: '',
      bridePhotoUrl: '',
      galleryPhotos: [],
      loveStory: [],
      isDeleted: false,
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    });

  // State untuk InvitationEvent (array of events)
  const [invitationEvents, setInvitationEvents] = useState<InvitationEvent[]>([
    {
      eventId: 'akad-1',
      invitationId: '',
      eventType: 'AKAD',
      location: '',
      locationDetail: '',
      mapsUrl: '',
      startTime: '',
      endTime: '',
      createdAt: '',
      updatedAt: '',
    },
  ]);

  // State untuk InvitationGift
  const [invitationGift, setInvitationGift] = useState<InvitationGift>({
    giftId: '',
    invitationId: '',
    address: '',
    invitationGiftBank: [],
    invitationGiftWallet: [],
    createdAt: '',
    updatedAt: '',
  });

  // State untuk Invitation (untuk link)
  const [invitation, setInvitation] = useState<Partial<Invitation>>({
    invitationUrl: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [router]);

  // Validasi untuk setiap step
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1: // Data Mempelai
        return (
          invitationDataUser.brideFullName.trim() !== '' &&
          invitationDataUser.brideParentName?.trim() !== '' &&
          invitationDataUser.groomFullName.trim() !== '' &&
          invitationDataUser.groomParentName?.trim() !== ''
        );

      case 2: // Tempat Acara
        const akadEvent = invitationEvents.find((e) => e.eventType === 'AKAD');
        if (!akadEvent) return false;

        const akadValid =
          akadEvent.location.trim() !== '' &&
          akadEvent.locationDetail.trim() !== '' &&
          akadEvent.mapsUrl.trim() !== '' &&
          akadEvent.startTime.trim() !== '' &&
          akadEvent.endTime.trim() !== '';

        const resepsiEvents = invitationEvents.filter(
          (e) => e.eventType === 'RESEPSI'
        );

        if (resepsiEvents.length === 0) {
          return akadValid;
        }

        const resepsiValid = resepsiEvents.every(
          (event) =>
            event.location.trim() !== '' &&
            event.locationDetail.trim() !== '' &&
            event.mapsUrl.trim() !== '' &&
            event.startTime.trim() !== '' &&
            event.endTime.trim() !== ''
        );

        return akadValid && resepsiValid;

      case 3: // Informasi Gift
        const hasAddress = invitationGift.address?.trim() !== '';
        const hasValidBank = invitationGift.invitationGiftBank.some((bank) =>
          bank.account.some(
            (acc: any) =>
              acc.bankName?.trim() !== '' &&
              acc.accountNumber?.trim() !== '' &&
              acc.accountName?.trim() !== ''
          )
        );
        const hasValidWallet = invitationGift.invitationGiftWallet.some(
          (wallet) =>
            wallet.address.some((addr: any) => addr.address?.trim() !== '')
        );

        return hasAddress || hasValidBank || hasValidWallet;

      case 4: // Link Undangan
        return (
          invitation.invitationUrl?.trim() !== '' && isLinkValid // Validasi baru
        );

      case 5: // Konfirmasi
        return true;

      default:
        return false;
    }
  }, [
    currentStep,
    invitationDataUser,
    invitationEvents,
    invitationGift,
    invitation,
    isLinkValid,
  ]);

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Validasi productId
      if (!productId) {
        throw new Error('Product ID tidak ditemukan');
      }

      // Validasi userId
      if (!userId) {
        throw new Error(
          'User ID tidak ditemukan. Silakan login terlebih dahulu.'
        );
      }

      // 1. Insert Invitation terlebih dahulu
      const invitationPayload: Partial<Invitation> = {
        ...invitation,
        userId: userId, // Ambil dari user yang login
        productId: productId, // Ambil dari URL params
        invitationStatus: 'draft', // Set default status
      };

      const invitationResult = await insertData.insertInvitation(
        invitationPayload as Invitation
      );

      if (!invitationResult.success) {
        throw new Error('Gagal membuat invitation');
      }

      const invitationId = invitationResult.invitationId;

      if (!invitationId) {
        throw new Error('Invitation ID tidak ditemukan');
      }

      setInvitationId(invitationId)

      // 2. Insert Data User
      const dataUserResult = await insertData.insertDataUser({
        ...invitationDataUser,
        invitationId: invitationId,
      });

      if (!dataUserResult.success) {
        throw new Error('Gagal menyimpan data pengantin');
      }

      // 3. Insert Events (bisa multiple events)
      const eventPromises = invitationEvents.map((event) =>
        insertData.invitationEvent({
          ...event,
          invitationId: invitationId,
        } as InvitationEvent)
      );

      const eventResults = await Promise.all(eventPromises);
      const failedEvents = eventResults.filter((result) => !result.success);

      if (failedEvents.length > 0) {
        throw new Error('Gagal menyimpan data acara');
      }

      // 4. Insert Gift (jika ada)
      if (
        invitationGift?.address?.trim() ||
        invitationGift?.invitationGiftBank?.length > 0 ||
        invitationGift?.invitationGiftWallet?.length > 0
      ) {
        const giftPayload: Partial<InvitationGift> = {
          invitationId: invitationId,
          address: invitationGift.address || '',
        };

        const giftResult = await insertData.invitationGift(
          giftPayload as InvitationGift
        );

        if (!giftResult.success || !giftResult.data) {
          throw new Error('Gagal menyimpan alamat hadiah');
        }

        const giftId = giftResult.data.giftId;

        if (!giftId) {
          throw new Error('Gift ID tidak ditemukan');
        }

        // 5. Insert Bank Accounts (jika ada)
        if (
          invitationGift.invitationGiftBank &&
          invitationGift.invitationGiftBank.length > 0
        ) {
          const bankPromises = invitationGift.invitationGiftBank.map((bank) =>
            insertData.insertBank({
              giftBankId: '', // Will be generated by DB
              giftId: giftId,
              account: bank.account, // Array of bank accounts
              owner: bank.owner,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          );

          const bankResults = await Promise.all(bankPromises);
          const failedBanks = bankResults.filter((result) => !result.success);

          if (failedBanks.length > 0) {
            console.error('Failed banks:', failedBanks);
            throw new Error('Gagal menyimpan data rekening bank');
          }
        }

        // 6. Insert Wallets (jika ada)
        if (
          invitationGift.invitationGiftWallet &&
          invitationGift.invitationGiftWallet.length > 0
        ) {
          const walletPromises = invitationGift.invitationGiftWallet.map(
            (wallet) =>
              insertData.insertWallet({
                giftWalletId: '', // Will be generated by DB
                giftId: giftId,
                address: wallet.address, // Array of wallet addresses
                owner: wallet.owner,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              })
          );

          const walletResults = await Promise.all(walletPromises);
          const failedWallets = walletResults.filter(
            (result) => !result.success
          );

          if (failedWallets.length > 0) {
            console.error('Failed wallets:', failedWallets);
            throw new Error('Gagal menyimpan data dompet digital');
          }
        }
      }

      // Success
      console.log('Semua data berhasil disimpan!');
      console.log('Invitation ID:', invitationId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saat submit:', error);

      const errorMsg =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menyimpan data';

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && currentStep <= totalSteps) {
        e.preventDefault();
        if (isStepValid) {
          if (currentStep === 5) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isStepValid]);

  const getStepTitle = () => {
    const titles: Record<number, string> = {
      1: 'Data Mempelai',
      2: 'Tempat Acara',
      3: 'Informasi Gift',
      4: 'Buat Link Undangan',
      5: 'Konfirmasi Data',
    };
    return titles[currentStep] || '';
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4'></div>
          <p className='text-white'>Loading...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className='min-h-screen bg-[#030712] text-white selection:bg-pink-500/30'>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className='bg-gray-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
        <div className='max-w-3xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between mb-5'>
            <button 
              onClick={handleBack} 
              className='w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/5'
            >
              <ArrowLeft size={20} />
            </button>
            <div className='text-center'>
              <h1 className='text-lg font-bold text-white tracking-tight uppercase'>
                {getStepTitle()}
              </h1>
              <p className='text-[10px] text-white/40 font-medium tracking-widest uppercase mt-0.5'>
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className='w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20'>
              <span className="text-xs font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          <div className='w-full bg-white/5 rounded-full h-1.5 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-pink-600 to-pink-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.3)]'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-3xl mx-auto px-6 pt-10 pb-32'>
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <BrideGroomDataInput
              data={invitationDataUser}
              onChange={setInvitationDataUser}
            />
          )}

          {currentStep === 2 && (
            <VenueDataInput
              events={invitationEvents}
              onChange={setInvitationEvents}
            />
          )}

          {currentStep === 3 && (
            <GiftDataInput data={invitationGift} onChange={setInvitationGift} />
          )}

          {currentStep === 4 && (
            <LinkDataInput
              data={invitation as Invitation}
              onChange={(data) => setInvitation(data)}
              onValidationChange={setIsLinkValid}
            />
          )}

          {currentStep === 5 && (
            <ConfirmationScreen
              brideGroomData={invitationDataUser}
              venueData={invitationEvents}
              giftData={invitationGift}
              invitationUrl={invitation.invitationUrl || ''}
            />
          )}
        </div>
      </main>

      {/* Footer Nav */}
      <footer className='fixed bottom-0 left-0 right-0 bg-gray-900/70 backdrop-blur-xl border-t border-white/5 z-50'>
        <div className='max-w-3xl mx-auto px-6 py-4'>
          <button
            onClick={currentStep === 5 ? handleSubmit : handleNext}
            disabled={!isStepValid || isLoading}
            className={`
              w-full py-4 px-6 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2
              ${isStepValid && !isLoading
                ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 translate-y-0'
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{currentStep === 5 ? 'Konfirmasi & Kirim' : 'Lanjutkan'}</span>
                {currentStep < 5 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </>
            )}
          </button>
        </div>
      </footer>

      {showSuccessModal && <ResultScreenSuccsess data={invitationId} />}
    </div>
  );
}
