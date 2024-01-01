"use server";

import { updateLinkPassword } from "@/lib/api/links";
import { BaseError } from "@/lib/error/base-error";

type Params = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async ({
  id,
  oldPassword,
  newPassword,
}: Params) => {
  try {
    await updateLinkPassword(id, oldPassword, newPassword);
    return { error: null };
  } catch (err) {
    if (err instanceof BaseError) {
      return { error: err.message };
    }
    return { error: "Error updating password. Contact the support team." };
  }
};
