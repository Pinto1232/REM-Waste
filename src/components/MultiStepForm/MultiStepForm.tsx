import { useBookingForm } from '../../hooks/useBookingForm';
import { StepProgress } from '../StepProgress';
import { NavBar } from '../NavBar';
import { FiShoppingCart } from 'react-icons/fi';
import {
  PostcodeStep,
  WasteTypeStep,
  SelectSkipStep,
  PermitCheckStep,
  ChooseDateStep,
  PaymentStep,
} from '../BookingSteps';

export function MultiStepForm() {
  const {
    formData,
    currentStep,
    currentStepIndex,
    stepConfigs,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    reset,
  } = useBookingForm();

  const handleStepClick = (stepId: string) => {
    const stepConfig = stepConfigs.find(s => s.id === stepId);
    const stepIndex = stepConfigs.findIndex(s => s.id === stepId);

    if (stepConfig && (
      stepConfig.isCompleted || 
      stepConfig.isActive || 
      (stepIndex === currentStepIndex + 1 && stepConfigs[currentStepIndex]?.isCompleted)
    )) {
      goToStep(stepId as any);
    }
  };

  const handleComplete = () => {
    console.log('Booking completed:', formData);

    alert('Booking completed successfully!');
    reset();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'postcode':
        return (
          <PostcodeStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        );

      case 'waste-type':
        return (
          <WasteTypeStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'select-skip':
        return (
          <SelectSkipStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'permit-check':
        return (
          <PermitCheckStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'choose-date':
        return (
          <ChooseDateStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'payment':
        return (
          <PaymentStep
            formData={formData}
            onUpdate={updateFormData}
            onComplete={handleComplete}
            onPrev={prevStep}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <NavBar 
        logo="REM Waste"
        menuItems={[
          { id: 'home', label: 'Home', active: false },
          { id: 'services', label: 'Services', active: false },
          { id: 'booking', label: 'Book Skip', active: true },
          { id: 'contact', label: 'Contact', active: false }
        ]}
      >
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200">
            <FiShoppingCart className="w-6 h-6" />
            {}
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </NavBar>
      <StepProgress steps={stepConfigs} onStepClick={handleStepClick} />
      <div className='pb-safe'>
        {renderCurrentStep()}
      </div>
    </div>
  );
}
