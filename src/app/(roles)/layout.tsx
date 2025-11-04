import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Toaster } from "sonner";
import UserButton from "@/components/auth/UserButton";
import { ReactNode } from "react";
import DesignerContextProvider from "@/components/form/context/DesignerContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (<DesignerContextProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen w-full bg-background ">
        <nav className="flex items-center justify-between border-b border-border h-[60px] px-4 py-2">
          <Logo />
          <div className="flex gap-4 items-center">
            <ThemeSwitcher />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto">{children}</main>

        <Toaster position="top-right" richColors closeButton />
      </div>
    </ThemeProvider>
  </DesignerContextProvider>
  );
}
