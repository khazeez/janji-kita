'use client';
import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, Home, CreditCard } from 'lucide-react';
import BrideGroomDataInput from '@/components/layout/form-layout/bridegroomDataInput';
import LinkDataInput from '@/components/layout/form-layout/linkDataInput';
import GiftDataInput from '@/components/layout/form-layout/giftDataInput';
import VenueDataInput from '@/components/layout/form-layout/venueDataInput';
import ConfirmationScreen from '@/components/layout/form-layout/confirmationScreen';
import ResultScreenSuccsess from '@/components/layout/form-layout/result';
import { BankAccount, Wallet } from '@/types/form';

export default function Form() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalSteps = 5;

  const [brideGroomData, setBrideGroomData] = useState({
    brideName: '',
    brideParents: '',
    groomName: '',
    groomParents: '',
  });

  const [giftData, setGiftData] = useState({
    accounts: [] as BankAccount[],
    wallets: [] as Wallet[],
    address: '',
  });

  const [venueData, setVenueData] = useState({
    akadVenue: '',
    akadAddress: '',
    akadDate: '',
    akadTime: '',
    hasResepsi: false,
    resepsiVenue: '',
    resepsiAddress: '',
    resepsiDate: '',
    resepsiTime: '',
  });

  const [linkData, setLinkData] = useState({
    link: '',
  });

  // Validasi untuk setiap step
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1: // Data Mempelai
        return (
          brideGroomData.brideName.trim() !== '' &&
          brideGroomData.brideParents.trim() !== '' &&
          brideGroomData.groomName.trim() !== '' &&
          brideGroomData.groomParents.trim() !== ''
        );

      case 2: // Tempat Acara
        const akadValid =
          venueData.akadVenue.trim() !== '' &&
          venueData.akadAddress.trim() !== '' &&
          venueData.akadDate.trim() !== '' &&
          venueData.akadTime.trim() !== '';

        if (!venueData.hasResepsi) {
          return akadValid;
        }

        const resepsiValid =
          venueData.resepsiVenue.trim() !== '' &&
          venueData.resepsiAddress.trim() !== '' &&
          venueData.resepsiDate.trim() !== '' &&
          venueData.resepsiTime.trim() !== '';

        return akadValid && resepsiValid;

      case 3: // Informasi Gift
        const hasAddress = giftData.address.trim() !== '';
        const hasValidAccount = giftData.accounts.some(
          (acc) =>
            acc.bankName.trim() !== '' &&
            acc.accountNumber.trim() !== '' &&
            acc.accountName.trim() !== ''
        );
        const hasValidWallet = giftData.wallets.some(
          (wallet) => wallet.address.trim() !== ''
        );

        return hasAddress || hasValidAccount || hasValidWallet;

      case 4: // Link Undangan
        return linkData.link.trim() !== '';

      case 5: // Konfirmasi
        return true;

      default:
        return false;
    }
  }, [currentStep, brideGroomData, venueData, giftData, linkData]);

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Tampilkan modal success
    setShowSuccessModal(true);
  };

  const getStepTitle = () => {
    const titles: Record<number, string> = {
      1: 'Data Mempelai',
      2: 'Tempat Acara',
      3: 'Informasi Gift',
      4: 'Buat Link Undangan',
      5: 'Konfirmasi Data',
      6: 'Undangan Berhasil Dibuat',
    };
    return titles[currentStep] || '';
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className='min-h-screen bg-gray-900 pb-24'>
      {/* Header */}
      <header className='bg-gray-800 border-b border-gray-700 sticky top-0 z-50'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between mb-3'>
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || currentStep === 6}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === 1 || currentStep === 6
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
        {currentStep === 1 && (
          <BrideGroomDataInput
            data={brideGroomData}
            onChange={(updateData) =>
              setBrideGroomData((prev) => ({ ...prev, ...updateData }))
            }
          />
        )}

        {currentStep === 2 && (
          <VenueDataInput
            data={venueData}
            onChange={(updateData) =>
              setVenueData((prev) => ({ ...prev, ...updateData }))
            }
          />
        )}

        {currentStep === 3 && (
          <GiftDataInput
            data={giftData}
            onChange={(updateData) =>
              setGiftData((prev) => ({ ...prev, ...updateData }))
            }
          />
        )}

        {currentStep === 4 && (
          <LinkDataInput data={linkData} onChange={setLinkData} />
        )}

        {currentStep === 5 && (
          <ConfirmationScreen
            brideGroomData={brideGroomData}
            venueData={venueData}
            giftData={giftData}
            linkData={linkData}
          />
        )}
      </main>

      {/* Footer dengan Button Lanjut - Sticky Bottom */}
      {currentStep < 6 && (
        <footer className='fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50'>
          <div className='max-w-4xl mx-auto px-4 py-4'>
            <button
              onClick={currentStep === 5 ? handleSubmit : handleNext}
              disabled={!isStepValid}
              className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg ${
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
