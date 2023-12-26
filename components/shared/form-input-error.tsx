type Props = {
  message?: string;
};

export default function FormInputError({ message }: Props) {
  if (!message || message.length < 1) {
    return null;
  }

  return <p className="text-xs text-danger font-semibold">{message}</p>;
}
