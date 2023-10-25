"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormData, linkPasswordSchema } from "./schema";
import { useParams, useRouter } from "next/navigation";
import { verifyPassword } from "./actions";
import AlertCircleFill from "@/components/icons/alert-circle-fill";
import LoadingSpinner from "@/components/icons/loading-spinner";

export function VerifyLinkPasswordForm() {
  const { domain, key } = useParams() as {
    domain: string;
    key: string;
  };

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
      className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          Password
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`block w-full rounded-md focus:outline-none sm:text-sm ${
              errors.password
                ? "border-red-300 pr-10 text-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500"
            }`}
          />
          {errors.password && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircleFill
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        className={`flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none ${
          isSubmitDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        }`}
        disabled={isSubmitDisabled}
      >
        {isSubmitting && <LoadingSpinner />}
        <p className="ml-2">Authenticate</p>
      </button>
    </form>
  );
}
