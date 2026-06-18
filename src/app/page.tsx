import { redirect } from "next/navigation";

// The 3D learning path is the default landing.
export default function Home() {
  redirect("/path");
}
