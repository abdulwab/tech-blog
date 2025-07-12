import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            Create Account
          </h2>
          <p className="text-[var(--text-secondary)]">
            Join us and start creating amazing content
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "bg-[var(--accent-web)] hover:bg-[var(--accent-web-dark)] text-white",
                card: "bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg",
                headerTitle: "text-[var(--text-primary)]",
                headerSubtitle: "text-[var(--text-secondary)]",
                socialButtonsBlockButton: "border-[var(--border-primary)] text-[var(--text-primary)]",
                formFieldInput: "bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-primary)]",
                formFieldLabel: "text-[var(--text-primary)]",
                footerActionText: "text-[var(--text-secondary)]",
                footerActionLink: "text-[var(--accent-web)]",
                dividerText: "text-[var(--text-secondary)]",
                dividerLine: "bg-[var(--border-primary)]"
              },
              variables: {
                colorPrimary: "var(--accent-web)",
                colorText: "var(--text-primary)",
                colorTextSecondary: "var(--text-secondary)",
                colorBackground: "var(--card-bg)",
                colorInputBackground: "var(--card-bg)",
                colorInputText: "var(--text-primary)",
                borderRadius: "0.5rem"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
