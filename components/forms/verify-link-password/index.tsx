"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormData, linkPasswordSchema } from "./schema";
import { useParams, useRouter } from "next/navigation";
import { verifyPassword } from "./actions";
import LoadingSpinner from "@/components/shared/loading-spinner";
import FormPasswordInput from "@/components/shared/form-password-input";

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
        <FormPasswordInput
          {...register("password")}
          id="password"
          isError={!!errors.password}
        />
        {!!errors.password?.message && (
          <p className="text-xs text-red-500">{errors.password?.message}</p>
        )}
      </div>

      <button
        className={`flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm font-medium transition-all focus:outline-none ${
          isSubmitDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-black bg-black text-white hover:bg-white hover:text-black hover:shadow-md active:scale-95"
        }`}
        disabled={isSubmitDisabled}
      >
        {isSubmitting && <LoadingSpinner />}
        <p className="ml-2">Authenticate</p>
      </button>
    </form>
  );
}
