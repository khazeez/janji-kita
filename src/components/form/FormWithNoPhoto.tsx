'use client';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(false);
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
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error);
          setErrorMessage(
            'Gagal mendapatkan data user. Silakan login kembali.'
          );
          setShowErrorModal(true);
          return;
        }

        if (user) {
          setUserId(user.id);
        } else {
          setErrorMessage(
            'User tidak ditemukan. Silakan login terlebih dahulu.'
          );
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Error in getCurrentUser:', error);
        setErrorMessage('Terjadi kesalahan saat mengambil data user.');
        setShowErrorModal(true);
      }
    };

    getCurrentUser();
  }, []);

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
              acc.bank?.trim() !== '' &&
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
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
    <div className='min-h-screen bg-gray-900 pb-24'>
      {/* Header */}
      <header className='bg-gray-800 border-b border-gray-700 sticky top-0 z-50'>
        <div className='max-w-4xl mx-auto px-4 py-2'>
          <div className='flex items-center justify-between mb-3'>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className='text-lg font-semibold text-white text-center flex-1'>
              {getStepTitle()}
            </h1>
            <div className='w-10'></div>
          </div>

          <div className='w-full bg-gray-700 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-pink-600 to-pink-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className='text-xs text-gray-400 text-center mt-2'>
            Step {currentStep} dari {totalSteps}
          </p>
        </div>
      </header>

      {/* Main */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        {/* Step 1: Data Mempelai */}
        {currentStep === 1 && (
          <BrideGroomDataInput
            data={invitationDataUser}
            onChange={setInvitationDataUser}
          />
        )}

        {/* Step 2: Tempat Acara */}
        {currentStep === 2 && (
          <VenueDataInput
            events={invitationEvents}
            onChange={setInvitationEvents}
          />
        )}

        {/* Step 3: Gift */}
        {currentStep === 3 && (
          <GiftDataInput data={invitationGift} onChange={setInvitationGift} />
        )}

        {/* Step 4: Link */}
        {currentStep === 4 && (
          <LinkDataInput
            data={invitation as Invitation}
            onChange={(data) => setInvitation(data)}
            onValidationChange={setIsLinkValid}
          />
        )}

        {/* Step 5: Konfirmasi */}
        {currentStep === 5 && (
          <ConfirmationScreen
            brideGroomData={invitationDataUser}
            venueData={invitationEvents}
            giftData={invitationGift}
            invitationUrl={invitation.invitationUrl || ''}
          />
        )}
      </main>

      {/* Footer */}
      {currentStep <= totalSteps && (
        <footer className='fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50'>
          <div className='max-w-4xl mx-auto px-4 py-4'>
            <button
              onClick={currentStep === 5 ? handleSubmit : handleNext}
              disabled={!isStepValid}
              className={`w-full px-6 py-3 font-semibold rounded-3xl transition-all duration-200 shadow-lg ${
                isStepValid
                  ? 'bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 5 ? 'Submit' : 'Lanjut'}
            </button>
          </div>
        </footer>
      )}

      {/* Success Modal */}
      {showSuccessModal && <ResultScreenSuccsess />}
    </div>
  );
}
