"use server";
import { verifyLinkPassword } from "@/lib/api/links";
import { BaseError } from "@/lib/error/base-error";

type Params = {
  domain: string;
  key: string;
  password: string;
};

export const verifyPassword = async (params: Params) => {
  const domain = decodeURIComponent(params.domain);
  const key = decodeURIComponent(params.key);
  const password = params.password;

  try {
    const isValid = await verifyLinkPassword(domain, key, password);
    if (!isValid) {
      return { error: "Invalid password" };
    }
    return { error: null };
  } catch (err) {
    if (err instanceof BaseError) {
      return { error: err.message };
    }
    return { error: "Error verifying password. Contact the support team." };
  }
};
