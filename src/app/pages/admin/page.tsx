import { redirect } from "next/navigation";

export default function DeveloperHomePage() {
  redirect("/pages/admin/users_management");
}