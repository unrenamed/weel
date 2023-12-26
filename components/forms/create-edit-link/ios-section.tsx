import { UseFormRegisterReturn } from "react-hook-form";
import { FormTextInput, FormInputError } from "@/components/shared";
import { CreateEditFormSection } from "./section";

type Props = {
  formProps: UseFormRegisterReturn;
  error?: string
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function IOSTargetingSection({
  formProps,
  error,
  onOpen,
  onClose,
  isOpen,
}: Props) {
  return (
    <CreateEditFormSection
      title="iOS Targeting"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <FormTextInput
        {...formProps}
        id="ios"
        placeholder="https://apps.apple.com/us/app/x/id333903271"
        isError={!!error}
      />
      <FormInputError message={error} />
    </CreateEditFormSection>
  );
}
