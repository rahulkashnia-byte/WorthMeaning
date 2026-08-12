import { LocaleWorthPage, localeMetadata } from "@/components/LocaleWorthPage";
import { getLocalePage } from "@/lib/locale-pages";

const page = getLocalePage("hi/website-ki-kimat")!;

export const metadata = localeMetadata(page);

export default function HindiWebsiteKimatPage() {
  return <LocaleWorthPage page={page} />;
}
