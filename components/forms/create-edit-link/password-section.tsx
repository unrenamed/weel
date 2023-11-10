import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Switch from "@/components/shared/switch";
import { motion } from "framer-motion";
import FormPasswordInput from "@/components/shared/form-password-input";

export function PasswordSection({
  formProps,
  error,
  onOpen,
  onClose,
  isOpen,
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
        <span className="text-sm font-medium text-gray-900">
          Password Protection
        </span>
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
          <FormPasswordInput
            {...formProps}
            id="password"
            placeholder="Enter password"
            isError={!!error}
            passwordVisibilityEnabled
          />
          {!!error && <p className="text-xs text-red-500">{error}</p>}
        </motion.div>
      )}
    </div>
  );
}
