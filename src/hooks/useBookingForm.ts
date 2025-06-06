import { useState, useCallback } from 'react';
import type { BookingStep, StepConfig } from '../types/booking';
import type { BookingFormData } from '../schemas/booking';
import type { Skip } from '../schemas/skip';
import { logger } from '../utils/logger';

const INITIAL_FORM_DATA: BookingFormData = {
  postcode: '',
  area: '',
  wasteType: '',
};

const STEPS: BookingStep[] = [
  'postcode',
  'waste-type',
  'select-skip',
  'permit-check',
  'choose-date',
  'payment',
];

const STEP_TITLES: Record<BookingStep, string> = {
  postcode: 'Postcode',
  'waste-type': 'Waste Type',
  'select-skip': 'Select Skip',
  'permit-check': 'Permit Check',
  'choose-date': 'Choose Date',
  payment: 'Payment',
};

export function useBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = STEPS[currentStepIndex];

  const updateFormData = useCallback((updates: Partial<BookingFormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      logger.debug('Form data updated', newData);
      return newData;
    });
  }, []);

  const nextStep = useCallback(() => {
    logger.debug('Next step called', { currentStepIndex });
    if (currentStepIndex < STEPS.length - 1) {
      const newIndex = currentStepIndex + 1;
      logger.debug('Moving to step', { newIndex, step: STEPS[newIndex] });
      setCurrentStepIndex(newIndex);
    } else {
      logger.debug('Already at last step');
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

  const isStepCompleted = useCallback(
    (step: BookingStep): boolean => {
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
    },
    [formData]
  );

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
    return currentStep ? isStepCompleted(currentStep) : false;
  }, [currentStep, isStepCompleted]);

  const selectSkip = useCallback(
    (skip: Skip) => {
      updateFormData({ selectedSkip: skip });
    },
    [updateFormData]
  );

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
