import { forwardRef } from "react";
import FormInput, { FormInputProps } from "./form-input";

type Props = Omit<FormInputProps, "type">;

const FormDatetimeInput = forwardRef<HTMLInputElement, Props>(
  function FormDatetimeInput(props: Props, ref) {
    return <FormInput {...props} type="datetime-local" ref={ref} />;
  }
);

export default FormDatetimeInput;
