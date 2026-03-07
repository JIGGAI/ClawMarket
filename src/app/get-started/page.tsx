import { redirect } from "next/navigation";

export const metadata = {
  title: "Get Started – ClawRecipes",
  description: "Get started guide has moved to How It Works.",
};

export default function GetStartedPage() {
  redirect("/how-it-works");
}
