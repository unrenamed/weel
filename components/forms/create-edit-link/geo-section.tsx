import {
  Control,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import { FormData } from "./schema";
import { COUNTRIES } from "@/lib/constants";
import { uncapitalize } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, FormTextInput, FormInputError } from "@/components/shared";
import { cn } from "@/components/utils";
import { CreateEditFormSection } from "./section";
import { ReactNode } from "react";

type Props = {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

type GeoFieldError = Merge<
  FieldError,
  FieldErrorsImpl<{
    url: string;
    country: string;
  }>
>;

export function GeoTargetingSection({
  control,
  register,
  errors,
  onOpen,
  onClose,
  isOpen,
}: Props) {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "geo",
  });

  const handleOpen = () => {
    if (!fields.length) {
      replace([{ country: "", url: "" }]);
    }
    onOpen();
  };

  return (
    <CreateEditFormSection
      title="Geo Targeting"
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={onClose}
    >
      <AnimatePresence initial={false}>
        {fields.map(({ id }, index) => (
          <AnimatedContainer key={id} id={id}>
            <GeoLink
              removable={fields.length > 1}
              onRemove={() => remove(index)}
              error={errors?.geo?.[index]}
              {...{ index, register }}
            />
          </AnimatedContainer>
        ))}
      </AnimatePresence>
      <FormInputError message={errors?.geo?.root?.message} />
      <Button
        type="button"
        text="Add location"
        variant="secondary"
        className="mt-2 p-1"
        onClick={() => append({ country: "", url: "" })}
      />
    </CreateEditFormSection>
  );
}

function AnimatedContainer({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={id}
      layout
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function GeoLink({
  index,
  error,
  register,
  removable,
  onRemove,
}: {
  index: number;
  error?: GeoFieldError;
  register: UseFormRegister<FormData>;
  removable: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center space-x-2">
        <div className="flex w-full">
          <CountrySelect register={register} index={index} />
          <div className="w-full ">
            <FormTextInput
              {...register(`geo.${index}.url` as const)}
              id={`geo.${index}.url`}
              placeholder="https://www.google.com.uk/"
              className="rounded-none rounded-r-md"
              isError={!!error}
            />
          </div>
        </div>
        {removable && <RemoveLinkButton onRemove={onRemove} />}
      </div>
      <GeoLinkInputError error={error} />
    </div>
  );
}

function CountrySelect({
  register,
  index,
}: {
  index: number;
  register: UseFormRegister<FormData>;
}) {
  return (
    <select
      {...register(`geo.${index}.country` as const)}
      id={`geo.${index}.country`}
      className={cn(
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
  );
}

function RemoveLinkButton({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      className="p-2 active:scale-95 transition-all duration-75"
      onClick={onRemove}
    >
      <Trash2 size={20} className="text-red-400" strokeWidth={1.5} />
    </button>
  );
}

function GeoLinkInputError({ error }: { error?: GeoFieldError }) {
  const parts = [];

  if (error?.country?.message) {
    parts.push(uncapitalize(error.country.message));
  }
  if (error?.url?.message) {
    parts.push(uncapitalize(error.url.message));
  }

  const errorMessage = parts.length ? `Please ${parts.join(" and ")}` : "";
  return <FormInputError message={errorMessage} />;
}
