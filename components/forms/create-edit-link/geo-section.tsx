import { useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import { FormData } from "./schema";
import { COUNTRIES } from "@/lib/constants";
import { uncapitalize } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Switch, FormTextInput } from "@/components/shared";
import { classNames } from "@/components/utils";

export function GeoTargetingSection({
  control,
  register,
  errors,
  onOpen,
  onClose,
  isOpen,
}: {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const [open, setOpen] = useState(isOpen);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "geo",
  });

  const handleCheckedChange = (checked: boolean) => {
    setOpen(checked);
    if (checked) {
      onOpen();
      if (!fields.length) replace([{ country: "", url: "" }]);
    } else {
      onClose();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Geo Targeting</span>
        <Switch checked={isOpen} onCheckedChange={handleCheckedChange} />
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-2 mt-4"
        >
          <AnimatePresence initial={false}>
            {fields.map(({ id }, index) => (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <GeoLink
                  removable={fields.length > 1}
                  onRemove={() => remove(index)}
                  {...{ index, register, errors }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <p className="text-xs text-danger font-semibold">
            {errors?.geo?.root?.message}
          </p>
          <Button
            type="button"
            text="Add location"
            variant="secondary"
            className="mt-2 p-1"
            onClick={() => append({ country: "", url: "" })}
          />
        </motion.div>
      )}
    </div>
  );
}

function GeoLink({
  index,
  errors,
  register,
  removable,
  onRemove,
}: {
  index: number;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  removable: boolean;
  onRemove: () => void;
}) {
  const errorParts = [];
  const error = errors?.geo?.[index];
  if (error?.country?.message) {
    errorParts.push(uncapitalize(error.country.message));
  }
  if (error?.url?.message) {
    errorParts.push(uncapitalize(error.url.message));
  }
  const errorMessage = errorParts.length
    ? `Please ${errorParts.join(" and ")}`
    : "";

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center space-x-2">
        <div className="flex w-full">
          <select
            {...register(`geo.${index}.country` as const)}
            id={`geo.${index}.country`}
            className={classNames(
              "flex w-32 items-center justify-center rounded-l-md pl-3 pr-7 text-center text-sm cursor-pointer border border-r-0",
              "focus:outline-none focus:ring-0",
              "bg-inherit text-secondary border-border focus:border-border"
            )}
            defaultValue=""
          >
            <option value="" disabled>
              Country
            </option>
            {Object.entries(COUNTRIES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <div className="w-full">
            <FormTextInput
              {...register(`geo.${index}.url` as const)}
              id={`geo.${index}.url`}
              placeholder="https://www.google.com.uk/"
              className="rounded-none rounded-r-md"
              isError={!!error}
            />
          </div>
        </div>
        {removable && (
          <button
            type="button"
            className="p-2 active:scale-95 transition-all duration-75"
            onClick={onRemove}
          >
            <Trash2 size={20} className="text-red-400" strokeWidth={1.5} />
          </button>
        )}
      </div>
      {!!errorMessage && (
        <p className="text-xs text-danger font-semibold">{errorMessage}</p>
      )}
    </div>
  );
}
