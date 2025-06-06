import type { BookingFormData } from '../../schemas/booking';
import { BaseLayout } from '../../layouts';
import { LocationInfo } from './PostcodeStep/LocationInfo';
import { PostcodeForm } from './PostcodeStep/PostcodeForm';
import { FeatureCards } from './PostcodeStep/FeatureCards';

interface PostcodeStepProps {
  formData: BookingFormData;

  onUpdate: (data: Partial<BookingFormData>) => void;

  onNext: () => void;
}

export function PostcodeStep({ formData, onUpdate, onNext }: PostcodeStepProps) {
  return (
    <BaseLayout
      title='Enter Your Postcode'
      subtitle="We'll find available skips in your area"
      maxWidth='2xl'
      backgroundColor='gray-900'
      padding='md'
    >
      {}
      <LocationInfo />

      {}
      <PostcodeForm formData={formData} onUpdate={onUpdate} onNext={onNext} />

      {}
      <FeatureCards />
    </BaseLayout>
  );
}
