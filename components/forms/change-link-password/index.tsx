"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormData, changeLinkPasswordSchema } from "./schema";
import {
  LoadingButton,
  FormPasswordInput,
  FormInputError,
} from "@/components/shared";
import { changePassword } from "./actions";

type Props = {
  linkId: string;
  onSubmit: () => void;
};

export function ChangeLinkPasswordForm({ linkId, onSubmit }: Props) {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(changeLinkPasswordSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    const { oldPassword, newPassword } = data;
    const { error } = await changePassword({
      id: linkId,
      oldPassword,
      newPassword,
    });
    if (error) {
      setError("oldPassword", { type: "custom", message: error });
    } else {
      onSubmit();
    }
  };

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  return (
    <form
      className="flex flex-col space-y-4 bg-bkg py-8"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Old password
        </label>
        <FormPasswordInput
          {...register("oldPassword")}
          id="oldPassword"
          isError={!!errors.oldPassword}
        />
        <FormInputError message={errors.oldPassword?.message} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          New password
        </label>
        <FormPasswordInput
          {...register("newPassword")}
          id="newPassword"
          isError={!!errors.newPassword}
        />
        <FormInputError message={errors.newPassword?.message} />
      </div>
      <LoadingButton
        text="Change password"
        loading={isSubmitting}
        disabled={isSubmitDisabled}
        className="w-full h-10"
      />
    </form>
  );
}
