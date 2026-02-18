import { Suspense } from "react";
import SubmitClient from "./SubmitClient";

export const metadata = {
  title: "Submit a recipe – ClawRecipes",
};

export default function MarketplaceSubmitPage() {
  return (
    <Suspense>
      <SubmitClient />
    </Suspense>
  );
}
