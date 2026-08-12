import { LocaleWorthPage, localeMetadata } from "@/components/LocaleWorthPage";
import { getLocalePage } from "@/lib/locale-pages";

const page = getLocalePage("te/website-viluva")!;

export const metadata = localeMetadata(page);

export default function TeluguWebsiteViluvaPage() {
  return <LocaleWorthPage page={page} />;
}
