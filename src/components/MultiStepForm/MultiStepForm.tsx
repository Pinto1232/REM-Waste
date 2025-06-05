import { useBookingForm } from '../../hooks/useBookingForm';
import { StepProgress } from '../StepProgress';
import { NavBar } from '../NavBar';
import { CartSidebar } from '../CartSidebar';
import { useCart } from '../../context/CartContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { FiShoppingCart } from 'react-icons/fi';
import type { BookingFormData } from '../../types/booking';
import {
  PostcodeStep,
  WasteTypeStep,
  SelectSkipStep,
  PermitCheckStep,
  ChooseDateStep,
  PaymentStep,
} from '../BookingSteps';

export function MultiStepForm() {
  const { formData, currentStep, currentStepIndex, stepConfigs, updateFormData, nextStep, prevStep, goToStep, reset } =
    useBookingForm();

  const { addItem, toggleCart, getTotalItems } = useCart();
  const { showSnackbar } = useSnackbar();

  const handleStepClick = (stepId: string) => {
    const stepConfig = stepConfigs.find(s => s.id === stepId);
    const stepIndex = stepConfigs.findIndex(s => s.id === stepId);

    if (
      stepConfig &&
      (stepConfig.isCompleted ||
        stepConfig.isActive ||
        (stepIndex === currentStepIndex + 1 && stepConfigs[currentStepIndex]?.isCompleted))
    ) {
      goToStep(stepId as any);
    }
  };

  const handleComplete = (finalData?: Partial<BookingFormData>) => {
    const completeBookingData = { ...formData, ...finalData };

    addItem(completeBookingData);
    showSnackbar('🛒 Booking added to cart successfully!', 'success');
    reset();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'postcode':
        return <PostcodeStep formData={formData} onUpdate={updateFormData} onNext={nextStep} />;

      case 'waste-type':
        return <WasteTypeStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;

      case 'select-skip':
        return <SelectSkipStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;

      case 'permit-check':
        return <PermitCheckStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;

      case 'choose-date':
        return <ChooseDateStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;

      case 'payment':
        return (
          <PaymentStep formData={formData} onUpdate={updateFormData} onComplete={handleComplete} onPrev={prevStep} />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <NavBar
        logo='REM Waste'
        menuItems={[
          { id: 'home', label: 'Home', active: false },
          { id: 'services', label: 'Services', active: false },
          { id: 'booking', label: 'Book Skip', active: true },
          { id: 'contact', label: 'Contact', active: false },
        ]}
      >
        <div className='flex items-center space-x-4'>
          <button
            onClick={toggleCart}
            className='relative p-2 text-gray-300 hover:text-white transition-colors duration-200'
          >
            <FiShoppingCart className='w-6 h-6' />
            <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {getTotalItems()}
            </span>
          </button>
        </div>
      </NavBar>
      <StepProgress steps={stepConfigs} onStepClick={handleStepClick} />
      <div className='pb-safe'>{renderCurrentStep()}</div>
      <CartSidebar />
    </div>
  );
}
