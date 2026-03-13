import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await verifySession())) {
    redirect("/login");
  }
  return <>{children}</>;
}
