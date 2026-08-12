import type { ReportLocale } from "@/lib/domain";
import { formatInrIndian, formatUsd, usdToInr } from "@/lib/format";
import type { WorthReport } from "@/lib/worth-report";

export type ReportUiCopy = {
  kicker: string;
  titleLead: string;
  heroBlurb: (host: string) => string;
  midpointLabel: string;
  rangeLabel: string;
  globalRank: string;
  monthlyVisits: string;
  monthlyRevenue: string;
  exitReadiness: string;
  trafficModel: string;
  rpmSub: (rpm: number) => string;
  transferSignals: string;
  faqKicker: string;
  faqTitle: (host: string) => string;
  faqIntro: string;
  noDataTitle: string;
  noDataBody: string;
  newSearch: string;
};

export const REPORT_UI: Record<ReportLocale, ReportUiCopy> = {
  en: {
    kicker: "Website worth report",
    titleLead: "How much is",
    heroBlurb: (host) =>
      `How much is ${host} worth? Estimated midpoint and what that number means — in USD and Indian Rupees (Lakh / Crore).`,
    midpointLabel: "Estimated midpoint worth",
    rangeLabel: "Range",
    globalRank: "Global rank",
    monthlyVisits: "Monthly visits",
    monthlyRevenue: "Est. monthly revenue",
    exitReadiness: "Exit readiness",
    trafficModel: "Rank.to traffic model",
    rpmSub: (rpm) => `$${rpm} RPM ads/affiliate assumption`,
    transferSignals: "Public-page transfer signals",
    faqKicker: "Questions people ask",
    faqTitle: (host) => `About ${host}`,
    faqIntro:
      "Straight answers from this report — worth in USD and ₹ (Lakh/Crore), traffic, revenue, trend, and whether buying makes sense.",
    noDataTitle: "No Rank.to data",
    noDataBody:
      "We couldn’t build an indexable worth report for this domain yet (not ranked on Rank.to, or the lookup failed). Try again later or search a different site.",
    newSearch: "New search",
  },
  hi: {
    kicker: "वेबसाइट कीमत रिपोर्ट",
    titleLead: "कीमत",
    heroBlurb: (host) =>
      `${host} की कीमत कितनी है? अनुमानित midpoint — USD और ₹ लाख/करोड़ में — और इस संख्या का मतलब।`,
    midpointLabel: "अनुमानित मध्य कीमत",
    rangeLabel: "रेंज",
    globalRank: "ग्लोबल रैंक",
    monthlyVisits: "मासिक विज़िट",
    monthlyRevenue: "अनुमानित मासिक आय",
    exitReadiness: "एग्ज़िट रेडीनेस",
    trafficModel: "Rank.to ट्रैफ़िक मॉडल",
    rpmSub: (rpm) => `$${rpm} RPM ads/affiliate अनुमान`,
    transferSignals: "पब्लिक-पेज ट्रांसफर संकेत",
    faqKicker: "अक्सर पूछे जाने वाले प्रश्न",
    faqTitle: (host) => `${host} के बारे में`,
    faqIntro:
      "इस रिपोर्ट से सीधे जवाब — कीमत USD और ₹ (लाख/करोड़) में, ट्रैफ़िक, आय, ट्रेंड, और खरीदें या नहीं।",
    noDataTitle: "Rank.to डेटा नहीं मिला",
    noDataBody:
      "इस डोमेन के लिए अभी इंडेक्स योग्य रिपोर्ट नहीं बन सकी (Rank.to पर रैंक नहीं, या लुकअप फेल)। बाद में कोशिश करें।",
    newSearch: "नई खोज",
  },
  te: {
    kicker: "వెబ్‌సైట్ విలువ రిపోర్ట్",
    titleLead: "విలువ",
    heroBlurb: (host) =>
      `${host} విలువ ఎంత? అంచనా midpoint — USD మరియు ₹ లక్ష/కోటి — మరియు ఆ సంఖ్య అర్థం.`,
    midpointLabel: "అంచనా మధ్య విలువ",
    rangeLabel: "రేంజ్",
    globalRank: "గ్లోబల్ ర్యాంక్",
    monthlyVisits: "నెలవారీ విజిట్లు",
    monthlyRevenue: "అంచనా నెలవారీ ఆదాయం",
    exitReadiness: "ఎగ్జిట్ రెడీనెస్",
    trafficModel: "Rank.to ట్రాఫిక్ మోడల్",
    rpmSub: (rpm) => `$${rpm} RPM ads/affiliate అంచనా`,
    transferSignals: "పబ్లిక్-పేజ్ ట్రాన్స్‌ఫర్ సంకేతాలు",
    faqKicker: "తరచుగా అడిగే ప్రశ్నలు",
    faqTitle: (host) => `${host} గురించి`,
    faqIntro:
      "ఈ రిపోర్ట్ నుండి సూటి సమాధానాలు — విలువ USD మరియు ₹ (లక్ష/కోటి), ట్రాఫిక్, ఆదాయం, ట్రెండ్, కొనాలా వద్దా.",
    noDataTitle: "Rank.to డేటా లేదు",
    noDataBody:
      "ఈ డొమైన్‌కు ఇంకా ఇండెక్స్ చేయదగిన రిపోర్ట్ రాలేదు (Rank.to ర్యాంక్ లేదు లేదా లుకప్ ఫెయిల్). తర్వాత ప్రయత్నించండి.",
    newSearch: "కొత్త సెర్చ్",
  },
  ta: {
    kicker: "இணையதள மதிப்பு அறிக்கை",
    titleLead: "மதிப்பு",
    heroBlurb: (host) =>
      `${host} மதிப்பு எவ்வளவு? மதிப்பீட்டு midpoint — USD மற்றும் ₹ லட்சம்/கோடி — மற்றும் அந்த எண்ணின் அர்த்தம்.`,
    midpointLabel: "மதிப்பீட்டு நடுத்தர மதிப்பு",
    rangeLabel: "வரம்பு",
    globalRank: "உலக ரேங்க்",
    monthlyVisits: "மாதாந்திர வருகை",
    monthlyRevenue: "மதிப்பீட்டு மாதாந்திர வருவாய்",
    exitReadiness: "எக்சிட் தயார்நிலை",
    trafficModel: "Rank.to டிராஃபிக் மாடல்",
    rpmSub: (rpm) => `$${rpm} RPM ads/affiliate மதிப்பீடு`,
    transferSignals: "பொது பக்கம் பரிமாற்ற சமிக்ஞைகள்",
    faqKicker: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqTitle: (host) => `${host} பற்றி`,
    faqIntro:
      "இந்த அறிக்கையிலிருந்து நேரடி பதில்கள் — மதிப்பு USD மற்றும் ₹ (லட்சம்/கோடி), டிராஃபிக், வருவாய், போக்கு, வாங்கலாமா.",
    noDataTitle: "Rank.to தரவு இல்லை",
    noDataBody:
      "இந்த டொமைனுக்கு இன்னும் அட்டவணைப்படுத்தக்கூடிய அறிக்கை உருவாகவில்லை (Rank.to ரேங்க் இல்லை அல்லது தேடல் தோல்வி). பின்னர் முயற்சிக்கவும்.",
    newSearch: "புதிய தேடல்",
  },
};

export function reportSeoMeta(
  locale: ReportLocale,
  root: string,
  midUsd: number | null,
  midInrLabel: string | null,
) {
  if (locale === "hi") {
    return {
      title: midUsd
        ? `${root} की कीमत: ${formatUsd(midUsd)} / ${midInrLabel} | WorthMeaning`
        : `${root} वेबसाइट की कीमत चेक करें | WorthMeaning`,
      description: midUsd
        ? `${root} की अनुमानित कीमत लगभग ${formatUsd(midUsd)} (${midInrLabel}). Rank.to ट्रैफ़िक, आय और मतलब — USD व ₹ लाख/करोड़ में।`
        : `${root} की वेबसाइट कीमत चेक करें — Rank.to ट्रैफ़िक और ₹ लाख/करोड़ अनुमान।`,
    };
  }
  if (locale === "te") {
    return {
      title: midUsd
        ? `${root} విలువ: ${formatUsd(midUsd)} / ${midInrLabel} | WorthMeaning`
        : `${root} వెబ్‌సైట్ విలువ చెక్ | WorthMeaning`,
      description: midUsd
        ? `${root} అంచనా విలువ సుమారు ${formatUsd(midUsd)} (${midInrLabel}). Rank.to ట్రాఫిక్, ఆదాయం — USD మరియు ₹ లక్ష/కోటి.`
        : `${root} వెబ్‌సైట్ విలువ చెక్ చేయండి — Rank.to ట్రాఫిక్ మరియు ₹ లక్ష/కోటి అంచనా.`,
    };
  }
  if (locale === "ta") {
    return {
      title: midUsd
        ? `${root} மதிப்பு: ${formatUsd(midUsd)} / ${midInrLabel} | WorthMeaning`
        : `${root} இணையதள மதிப்பு | WorthMeaning`,
      description: midUsd
        ? `${root} மதிப்பீடு சுமார் ${formatUsd(midUsd)} (${midInrLabel}). Rank.to டிராஃபிக், வருவாய் — USD மற்றும் ₹ லட்சம்/கோடி.`
        : `${root} இணையதள மதிப்பைப் பாருங்கள் — Rank.to டிராஃபிக் மற்றும் ₹ லட்சம்/கோடி மதிப்பீடு.`,
    };
  }
  return {
    title: midUsd
      ? `${root} website worth: ${formatUsd(midUsd)} midpoint | WorthMeaning`
      : `${root} website worth report | WorthMeaning`,
    description: midUsd
      ? `Estimated worth of ${root}: about ${formatUsd(midUsd)}${midInrLabel ? ` / ${midInrLabel}` : ""}. Rank.to traffic, revenue potential, and meaning.`
      : `Check how much ${root} might be worth — Rank.to traffic, estimated revenue, and meaning.`,
  };
}

export function buildLocaleFaqs(
  report: WorthReport,
  locale: ReportLocale,
  rate: number,
): { question: string; answer: string }[] {
  const d = report.hostname;
  const mid = formatUsd(report.estimatedWorth.mid);
  const midInr = formatInrIndian(usdToInr(report.estimatedWorth.mid, rate));
  const visits = report.estimatedMonthlyVisits.mid.toLocaleString();

  if (locale === "hi") {
    return [
      {
        question: `${d} की कीमत कितनी है?`,
        answer: `WorthMeaning के अनुसार लगभग ${mid} / ${midInr}. यह Rank.to रैंक, विज़िट मॉडल और रेवेन्यू मल्टीपल पर आधारित अनुमान है — पक्की बिक्री कीमत नहीं।`,
      },
      {
        question: `${d} की कीमत रुपये में कितनी है?`,
        answer: `लगभग ${midInr} (लाइव USD→INR ≈ ₹${rate.toFixed(2)}). ₹1 लाख से ऊपर लाख में, ₹1 करोड़ से ऊपर करोड़ में दिखाया जाता है।`,
      },
      {
        question: `${d} पर कितना ट्रैफ़िक है?`,
        answer: `Rank.to ग्लोबल रैंक #${report.globalRank.toLocaleString()} के आधार पर करीब ${visits} मासिक विज़िट (मॉडल अनुमान)।`,
      },
      {
        question: `क्या ${d} खरीदना चाहिए?`,
        answer: `सिर्फ इस रिपोर्ट पर नहीं। Analytics, मुनाफ़ा और ओनरशिप जाँचें। रेडीनेस ${report.readinessScore}/100, कॉन्फिडेंस ${report.confidence}/100.`,
      },
    ];
  }

  if (locale === "te") {
    return [
      {
        question: `${d} విలువ ఎంత?`,
        answer: `WorthMeaning అంచనా సుమారు ${mid} / ${midInr}. Rank.to ర్యాంక్ మరియు రెవెన్యూ మల్టిపుల్ ఆధారంగా — ఖచ్చితమైన సేల్ ధర కాదు.`,
      },
      {
        question: `${d} విలువ రూపాయల్లో ఎంత?`,
        answer: `సుమారు ${midInr} (లైవ్ USD→INR ≈ ₹${rate.toFixed(2)}). లక్ష/కోటి రూపంలో చూపిస్తాం.`,
      },
      {
        question: `${d} ట్రాఫిక్ ఎంత?`,
        answer: `Rank.to ర్యాంక్ #${report.globalRank.toLocaleString()} ఆధారంగా సుమారు ${visits} నెలవారీ విజిట్లు (మోడల్ అంచనా).`,
      },
      {
        question: `${d} కొనాలా?`,
        answer: `ఈ రిపోర్ట్ మాత్రమే చాలదు. Analytics, లాభం, యాజమాన్యం వెరిఫై చేయండి. రెడీనెస్ ${report.readinessScore}/100.`,
      },
    ];
  }

  if (locale === "ta") {
    return [
      {
        question: `${d} மதிப்பு எவ்வளவு?`,
        answer: `WorthMeaning மதிப்பீடு சுமார் ${mid} / ${midInr}. Rank.to ரேங்க் மற்றும் வருவாய் மடங்கு அடிப்படையில் — உத்தரவாத விலை அல்ல.`,
      },
      {
        question: `${d} மதிப்பு ரூபாயில் எவ்வளவு?`,
        answer: `சுமார் ${midInr} (நேரடி USD→INR ≈ ₹${rate.toFixed(2)}). லட்சம்/கோடியாகக் காட்டப்படும்.`,
      },
      {
        question: `${d} டிராஃபிக் எவ்வளவு?`,
        answer: `Rank.to ரேங்க் #${report.globalRank.toLocaleString()} அடிப்படையில் சுமார் ${visits} மாதாந்திர வருகை (மாடல் மதிப்பீடு).`,
      },
      {
        question: `${d} வாங்கலாமா?`,
        answer: `இந்த அறிக்கை மட்டும் போதாது. Analytics, லாபம், உரிமை சரிபாருங்கள். தயார்நிலை ${report.readinessScore}/100.`,
      },
    ];
  }

  return [];
}
