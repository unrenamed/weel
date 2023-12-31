"use server";

import { findLinkById, hashLinkPassword, setPassword, verifyLinkPassword } from "@/lib/api/links";
import { InvalidLinkPassword, LinkNotFoundError } from "@/lib/error";
import { BaseError } from "@/lib/error/base-error";

type Params = {
  id: string;
  oldPassword: string | null;
  newPassword: string | null;
};

export const setLinkPassword = async ({
  id,
  oldPassword,
  newPassword,
}: Params) => {
  try {
    const link = await findLinkById(id);
    if (!link) {
      throw new LinkNotFoundError("Link is not found");
    }

    const domainKey = { domain: link.domain, key: link.key };
    if (oldPassword) {
      const isValid = await verifyLinkPassword(domainKey, oldPassword);
      if (!isValid) {
        throw new InvalidLinkPassword("Invalid password");
      }
    }

    const password = newPassword ? await hashLinkPassword(newPassword) : null;
    await setPassword(link, password);

    return { error: null };
  } catch (err) {
    if (err instanceof BaseError) {
      return { error: err.message };
    }
    return { error: "Error updating password. Contact the support team." };
  }
};
