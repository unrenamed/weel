import { UseFormRegisterReturn } from "react-hook-form";
import { FormDatetimeInput, FormInputError } from "@/components/shared";
import { CreateEditFormSection } from "./section";

type Props = {
  formProps: UseFormRegisterReturn;
  error?: string
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function ExpirationDateSection({
  formProps,
  error,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  return (
    <CreateEditFormSection
      title="Expiration Date"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <FormDatetimeInput
        {...formProps}
        id="expiresAt"
        step={60}
        isError={!!error}
      />
      <FormInputError message={error} />
    </CreateEditFormSection>
  );
}
