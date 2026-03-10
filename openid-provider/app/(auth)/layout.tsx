import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (await verifySession()) {
    redirect("/account");
  }
  return (
    <div className="bg-muted min-h-svh flex justify-center items-center p-6 md:p-10">
      {children}
    </div>
  );
}
