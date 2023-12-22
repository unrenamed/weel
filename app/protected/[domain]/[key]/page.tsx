import { VerifyLinkPasswordForm } from "@/components/forms/verify-link-password";
import ThemeSwitch from "@/components/theme-switch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Required",
  description:
    "Unlock protected content on our secured page — enter the password to access a password-protected short link.",
};

export default function PasswordProtectedLinkPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute right-0 top-0 sm:px-10 px-5 py-5">
        <ThemeSwitch />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xl mx-5 sm:mx-0">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-100 bg-white dark:bg-neutral-900 dark:border-neutral-800 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Password Required</h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            This link is password protected. Please enter the password to view
            it
          </p>
        </div>
        <VerifyLinkPasswordForm />
      </div>
    </div>
  );
}
