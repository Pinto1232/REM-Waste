import { useState, useCallback } from 'react';
import type { BookingFormData, BookingStep, StepConfig } from '../types/booking';
import type { Skip } from '../types/skip';

const INITIAL_FORM_DATA: BookingFormData = {
  postcode: '',
  area: '',
  wasteType: '',
  // permitRequired will be undefined initially until user makes a choice
};

const STEPS: BookingStep[] = [
  'postcode',
  'waste-type', 
  'select-skip',
  'permit-check',
  'choose-date',
  'payment'
];

const STEP_TITLES: Record<BookingStep, string> = {
  'postcode': 'Postcode',
  'waste-type': 'Waste Type',
  'select-skip': 'Select Skip',
  'permit-check': 'Permit Check',
  'choose-date': 'Choose Date',
  'payment': 'Payment'
};

export function useBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = STEPS[currentStepIndex];

  const updateFormData = useCallback((updates: Partial<BookingFormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('Form data updated:', newData);
      return newData;
    });
  }, []);

  const nextStep = useCallback(() => {
    console.log('Next step called. Current step index:', currentStepIndex);
    if (currentStepIndex < STEPS.length - 1) {
      const newIndex = currentStepIndex + 1;
      console.log('Moving to step index:', newIndex, 'Step:', STEPS[newIndex]);
      setCurrentStepIndex(newIndex);
    } else {
      console.log('Already at last step');
    }
  }, [currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((step: BookingStep) => {
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
    }
  }, []);

  const isStepCompleted = useCallback((step: BookingStep): boolean => {
    switch (step) {
      case 'postcode':
        return !!formData.postcode;
      case 'waste-type':
        return !!formData.wasteType;
      case 'select-skip':
        return !!formData.selectedSkip;
      case 'permit-check':
        return formData.permitRequired !== undefined;
      case 'choose-date':
        return !!formData.deliveryDate;
      case 'payment':
        return !!formData.paymentMethod;
      default:
        return false;
    }
  }, [formData]);

  const getStepConfigs = useCallback((): StepConfig[] => {
    return STEPS.map((step, index) => ({
      id: step,
      title: STEP_TITLES[step],
      description: '',
      isCompleted: isStepCompleted(step),
      isActive: index === currentStepIndex,
    }));
  }, [currentStepIndex, isStepCompleted]);

  const canProceedToNext = useCallback((): boolean => {
    return isStepCompleted(currentStep);
  }, [currentStep, isStepCompleted]);

  const selectSkip = useCallback((skip: Skip) => {
    updateFormData({ selectedSkip: skip });
  }, [updateFormData]);

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStepIndex(0);
  }, []);

  return {
    formData,
    currentStep,
    currentStepIndex,
    steps: STEPS,
    stepConfigs: getStepConfigs(),
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    canProceedToNext,
    selectSkip,
    reset,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === STEPS.length - 1,
  };
}
