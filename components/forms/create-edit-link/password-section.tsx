import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Switch, FormPasswordInput } from "@/components/shared";
import { motion } from "framer-motion";

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
        <span className="text-sm font-medium">
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
          {!!error && <p className="text-xs text-danger font-semibold">{error}</p>}
        </motion.div>
      )}
    </div>
  );
}
