"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormData, linkPasswordSchema } from "./schema";
import { useParams } from "next/navigation";

export default function LinkPasswordForm() {
  const { domain, key } = useParams() as {
    domain: string;
    key: string;
  };

  const onSubmit = (data: FormData) => {
    console.log({ domain, key, ...data });
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(linkPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("password", { required: true })} />
      <p>{errors.password?.message}</p>
      <button disabled={!isDirty || !isValid || isSubmitting}>
        Authenticate
      </button>
    </form>
  );
}
