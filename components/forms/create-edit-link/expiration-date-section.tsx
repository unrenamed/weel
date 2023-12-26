import { UseFormRegisterReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormDatetimeInput, FormInputError, Switch } from "@/components/shared";

export function ExpirationDateSection({
  formProps,
  error,
  isOpen,
  onOpen,
  onClose,
}: {
  formProps: UseFormRegisterReturn;
  error: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const [open, setOpen] = useState(isOpen);

  const handleCheckedChange = (checked: boolean) => {
    setOpen(checked);
    checked ? onOpen() : onClose();
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Expiration Date</span>
        <Switch checked={isOpen} onCheckedChange={handleCheckedChange} />
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-2"
        >
          <FormDatetimeInput
            {...formProps}
            id="expiresAt"
            step={60}
            isError={!!error}
          />
          <FormInputError message={error} />
        </motion.div>
      )}
    </div>
  );
}
