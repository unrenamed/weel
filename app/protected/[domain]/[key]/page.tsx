import { VerifyLinkPasswordForm } from "@/components/forms/verify-link-password";
import ThemeSwitch from "@/components/theme-switch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Required",
  description:
    "Unlock protected content on our secured page — enter the password to access a password-protected short link.",
};

type SearchParams = {
  redirectUrl: string;
};

export default function PasswordProtectedLinkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute right-0 top-0 sm:px-10 px-5 py-5">
        <ThemeSwitch />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-xl mx-5 sm:mx-0">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-border bg-content px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Password Required</h3>
          <p className="text-sm text-secondary">
            This link is password protected. Please enter the password to view
            it
          </p>
        </div>
        <VerifyLinkPasswordForm redirectUrl={searchParams.redirectUrl} />
      </div>
    </div>
  );
}
