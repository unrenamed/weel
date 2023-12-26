import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Switch } from "@/components/shared";

type Props = {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function CreateEditFormSection({
  children,
  title,
  isOpen,
  onClose,
  onOpen,
}: Props) {
  const [open, setOpen] = useState(isOpen);

  const handleCheckedChange = (checked: boolean) => {
    setOpen(checked);
    checked ? onOpen() : onClose();
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <Switch checked={isOpen} onCheckedChange={handleCheckedChange} />
      </div>
      {open && <AnimatedContainer>{children}</AnimatedContainer>}
    </div>
  );
}

function AnimatedContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-2"
    >
      {children}
    </motion.div>
  );
}
