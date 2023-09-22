import { VerifyLinkPasswordForm } from "@/components/forms/verify-link-password";

export const metadata = {
  title: "Password Required",
  description:
    "This link is password protected. Please enter the password to view it",
  noIndex: true,
};

export default function PasswordProtectedLinkPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">{metadata.title}</h3>
          <p className="text-sm text-gray-500">{metadata.description}</p>
        </div>
        <VerifyLinkPasswordForm />
      </div>
    </main>
  );
}
