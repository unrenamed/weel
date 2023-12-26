import { UseFormRegisterReturn } from "react-hook-form";
import { FormPasswordInput, FormInputError } from "@/components/shared";
import { CreateEditFormSection } from "./section";

type Props = {
  formProps: UseFormRegisterReturn;
  error?: string
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function PasswordSection({
  formProps,
  error,
  onOpen,
  onClose,
  isOpen,
}: Props) {
  return (
    <CreateEditFormSection
      title="Password Protection"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <FormPasswordInput
        {...formProps}
        id="password"
        placeholder="Enter password"
        isError={!!error}
        passwordVisibilityEnabled
      />
      <FormInputError message={error} />
    </CreateEditFormSection>
  );
}
