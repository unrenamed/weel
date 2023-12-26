import { UseFormRegisterReturn } from "react-hook-form";
import { FormTextInput, FormInputError } from "@/components/shared";
import { CreateEditFormSection } from "./section";

type Props = {
  formProps: UseFormRegisterReturn;
  error?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function AndroidTargetingSection({
  formProps,
  error,
  onOpen,
  onClose,
  isOpen,
}: Props) {
  return (
    <CreateEditFormSection
      title="Android Targeting"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <FormTextInput
        {...formProps}
        id="android"
        placeholder="https://play.google.com/store/apps/details?id=com.twitter.android"
        isError={!!error}
      />
      <FormInputError message={error} />
    </CreateEditFormSection>
  );
}
