"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormData, linkPasswordSchema } from "./schema";
import { useParams, useRouter } from "next/navigation";
import { verifyPassword } from "./actions";
import {
  LoadingButton,
  FormPasswordInput,
  FormInputError,
} from "@/components/shared";

export function VerifyLinkPasswordForm() {
  const { domain, key } = useParams<{
    domain: string;
    key: string;
  }>();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(linkPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    const { error, url } =
      (await verifyPassword({ domain, key, password: data.password })) || {};

    if (error) {
      setError("password", { type: "custom", message: error });
    } else {
      router.push(url!);
    }
  };

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  return (
    <form
      className="flex flex-col space-y-4 bg-bkg px-4 py-8 sm:px-16"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <label htmlFor="password" className="block text-xs uppercase">
          Password
        </label>
        <FormPasswordInput
          {...register("password")}
          id="password"
          isError={!!errors.password}
        />
        <FormInputError message={errors.password?.message} />
      </div>
      <LoadingButton
        text="Authenticate"
        loading={isSubmitting}
        disabled={isSubmitDisabled}
        className="w-full h-10"
      />
    </form>
  );
}
