"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  changePasswordSchema,
  removePasswordSchema,
  ChangePasswordFormData,
  RemovePasswordFormData,
  AddPasswordFormData,
  addPasswordSchema,
} from "./schema";
import {
  LoadingButton,
  FormPasswordInput,
  FormInputError,
} from "@/components/shared";
import { setLinkPassword } from "./actions";
import * as Tabs from "@radix-ui/react-tabs";

export function ManagePasswordForm({
  linkId,
  hasPassword,
  onSubmit,
}: {
  linkId: string;
  hasPassword: boolean;
  onSubmit: () => void;
}) {
  if (!hasPassword) {
    return <AddPasswordForm linkId={linkId} onSubmit={onSubmit} />;
  }

  return (
    <Tabs.Root
      className="flex flex-col space-y-6"
      defaultValue="change-password-tab"
    >
      <Tabs.List
        className="shrink-0 flex"
        aria-label="Change or remove password"
      >
        <Tabs.Trigger
          className="py-2 flex-1 flex items-center justify-center text-sm leading-none select-none outline-none rounded-l-md text-primary/70 transition duration-75 font-medium bg-bar-list-tab hover:bg-selected-bar-list-tab data-[state=active]:bg-selected-bar-list-tab"
          value="change-password-tab"
        >
          Change
        </Tabs.Trigger>
        <Tabs.Trigger
          className="py-2 flex-1 flex items-center justify-center text-sm leading-none select-none outline-none rounded-r-md text-primary/70 transition duration-75 font-medium bg-bar-list-tab hover:bg-selected-bar-list-tab data-[state=active]:bg-selected-bar-list-tab"
          value="remove-password-tab"
        >
          Remove
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="change-password-tab">
        <ChangePasswordForm linkId={linkId} onSubmit={onSubmit} />
      </Tabs.Content>
      <Tabs.Content value="remove-password-tab">
        <RemovePasswordForm linkId={linkId} onSubmit={onSubmit} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

type FormProps = {
  linkId: string;
  onSubmit: () => void;
};

function AddPasswordForm({ linkId, onSubmit }: FormProps) {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<AddPasswordFormData>({
    resolver: zodResolver(addPasswordSchema),
  });

  const onFormSubmit = async (data: AddPasswordFormData) => {
    const { password } = data;
    const { error } = await setLinkPassword({
      id: linkId,
      oldPassword: null,
      newPassword: password,
    });
    if (error) {
      setError("password", { type: "custom", message: error });
    } else {
      onSubmit();
    }
  };

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  return (
    <form
      className="flex flex-col bg-bkg space-y-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <FormPasswordInput
            {...register("password")}
            id="password"
            isError={!!errors.password}
            passwordVisibilityEnabled
          />
          <FormInputError message={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Confirm password
          </label>
          <FormPasswordInput
            {...register("confirmPassword")}
            id="confirmPassword"
            isError={!!errors.confirmPassword}
          />
          <FormInputError message={errors.confirmPassword?.message} />
        </div>
      </div>
      <LoadingButton
        text="Set password"
        loading={isSubmitting}
        disabled={isSubmitDisabled}
        className="w-full h-10"
      />
    </form>
  );
}

function ChangePasswordForm({ linkId, onSubmit }: FormProps) {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onFormSubmit = async (data: ChangePasswordFormData) => {
    const { oldPassword, newPassword } = data;
    const { error } = await setLinkPassword({
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
      className="flex flex-col bg-bkg space-y-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Current password
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

function RemovePasswordForm({ linkId, onSubmit }: FormProps) {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<RemovePasswordFormData>({
    resolver: zodResolver(removePasswordSchema),
  });

  const onFormSubmit = async (data: RemovePasswordFormData) => {
    const { oldPassword } = data;
    const { error } = await setLinkPassword({
      id: linkId,
      oldPassword,
      newPassword: null,
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
      className="flex flex-col bg-bkg space-y-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Current password
        </label>
        <FormPasswordInput
          {...register("oldPassword")}
          id="oldPassword"
          isError={!!errors.oldPassword}
        />
        <FormInputError message={errors.oldPassword?.message} />
      </div>
      <LoadingButton
        text="Remove password"
        loading={isSubmitting}
        disabled={isSubmitDisabled}
        className="w-full h-10"
      />
    </form>
  );
}
