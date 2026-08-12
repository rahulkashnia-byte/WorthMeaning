import { LocaleWorthPage, localeMetadata } from "@/components/LocaleWorthPage";
import { getLocalePage } from "@/lib/locale-pages";

const page = getLocalePage("ta/website-vilai")!;

export const metadata = localeMetadata(page);

export default function TamilWebsiteVilaiPage() {
  return <LocaleWorthPage page={page} />;
}
