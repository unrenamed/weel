import { forwardRef } from "react";
import FormInput, { FormInputProps } from "./form-input";

type Props = Omit<FormInputProps, "type">;

const FormTextInput = forwardRef<HTMLInputElement, Props>(
  function FormTextInput(props: Props, ref) {
    return <FormInput {...props} type="text" ref={ref} />;
  }
);

export default FormTextInput;
