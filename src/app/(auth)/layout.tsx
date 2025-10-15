import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-md rounded-xl p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
