export type LocaleFaq = { q: string; a: string };

export type LocalePageConfig = {
  /** URL path without leading slash */
  path: string;
  lang: "hi" | "te" | "ta";
  htmlLang: string;
  localeLabel: string;
  /** SEO title */
  title: string;
  description: string;
  keywords: string[];
  kicker: string;
  h1: string;
  lede: string;
  toolHeading: string;
  toolBlurb: string;
  howHeading: string;
  howSteps: string[];
  whyHeading: string;
  whyBody: string[];
  inrNote: string;
  faqs: LocaleFaq[];
  otherLocales: { href: string; label: string }[];
};

export const LOCALE_PAGES: LocalePageConfig[] = [
  {
    path: "hi/website-ki-kimat",
    lang: "hi",
    htmlLang: "hi",
    localeLabel: "हिन्दी",
    title:
      "वेबसाइट की कीमत चेक करें — Site Worth & Earning Checker | WorthMeaning",
    description:
      "किसी भी वेबसाइट की कीमत और कमाई ऑनलाइन चेक करें। Site worth / website earning checker — Live Rank.to से USD और ₹ लाख/करोड़ अनुमान। मुफ़्त।",
    keywords: [
      "किसी भी वेबसाइट की कीमत",
      "वेबसाइट की कीमत चेक करें",
      "website ki kimat",
      "site worth",
      "website earning checker",
      "website revenue checker",
      "website worth calculator hindi",
      "डोमेन की कीमत",
    ],
    kicker: "हिन्दी · मुफ़्त टूल",
    h1: "किसी भी वेबसाइट की कीमत चेक करें",
    lede:
      "डोमेन डालें — site worth, अनुमानित ट्रैफ़िक वैल्यू और कमाई देखें (USD + ₹ लाख/करोड़)। Live Rank.to रैंक → विज़िट → रेवेन्यू → कीमत।",
    toolHeading: "अभी कीमत चेक करें",
    toolBlurb:
      "example.com जैसा कोई भी डोमेन पेस्ट करें। रिजल्ट में USD + ₹ (Lakh/Crore) दोनों दिखेंगे।",
    howHeading: "यह कैसे काम करता है?",
    howSteps: [
      "हम Rank.to से लाइव ग्लोबल रैंक लेते हैं।",
      "रैंक से अनुमानित मासिक विज़िट निकालते हैं।",
      "Ads/affiliate RPM मानकर रेवेन्यू अनुमान लगाते हैं।",
      "सालाना रेवेन्यू × मल्टीपल ≈ वेबसाइट की कीमत (midpoint)।",
      "लाइव USD→INR रेट से लाख/करोड़ में दिखाते हैं।",
    ],
    whyHeading: "यह संख्या क्या मतलब रखती है?",
    whyBody: [
      "यह एक दिशा दिखाने वाला अनुमान है — औपचारिक वैल्यूएशन या गारंटीड सेल प्राइस नहीं।",
      "खरीदने से पहले Google Analytics, असली मुनाफ़ा और ओनरशिप ज़रूर जाँचें।",
      "INR आंकड़े लाइव करेंसी रेट पर आधारित हैं और अनुमान को आसान बनाने के लिए लाख/करोड़ में दिखाए जाते हैं।",
    ],
    inrNote: "रिजल्ट में कीमत ₹ लाख और ₹ करोड़ में भी दिखती है।",
    faqs: [
      {
        q: "क्या मैं किसी भी वेबसाइट की कीमत चेक कर सकता हूँ?",
        a: "हाँ — कोई भी पब्लिक डोमेन डालें। अगर Rank.to पर रैंक उपलब्ध है तो अनुमान मिलेगा।",
      },
      {
        q: "कीमत रुपये में कैसे दिखती है?",
        a: "USD अनुमान को लाइव USD→INR रेट से बदलकर लाख/करोड़ में दिखाया जाता है।",
      },
      {
        q: "क्या यह सही बिक्री कीमत है?",
        a: "नहीं। यह मॉडल-आधारित अनुमान है। असली डील में प्रॉफिट और ट्रैफ़िक वेरिफाई करें।",
      },
      {
        q: "Website ki kimat kaise calculate hoti hai?",
        a: "Rank → visits → assumed RPM revenue → annual × multiple। Method पेज पर डिटेल है।",
      },
    ],
    otherLocales: [
      { href: "/te/website-viluva", label: "తెలుగు" },
      { href: "/ta/website-vilai", label: "தமிழ்" },
      { href: "/worth-meaning", label: "English" },
    ],
  },
  {
    path: "te/website-viluva",
    lang: "te",
    htmlLang: "te",
    localeLabel: "తెలుగు",
    title:
      "వెబ్‌సైట్ విలువ చెక్ — Site Worth & Earning Checker | WorthMeaning",
    description:
      "ఏ వెబ్‌సైట్ విలువ/కమాయి అయినా ఆన్‌లైన్ చెక్ చేయండి. Site worth + website earning checker — Live Rank.toతో USD మరియు ₹ లక్ష/కోటి. ఉచితం.",
    keywords: [
      "వెబ్‌సైట్ విలువ",
      "website viluva",
      "వెబ్‌సైట్ వెల",
      "site worth",
      "website earning checker",
      "website worth calculator telugu",
      "డొమైన్ విలువ",
      "website value telugu",
    ],
    kicker: "తెలుగు · ఉచిత టూల్",
    h1: "ఏదైనా వెబ్‌సైట్ విలువ చెక్ చేయండి",
    lede:
      "డొమైన్ పెట్టండి — site worth, ట్రాఫిక్ వాల్యూ, కమాయి అంచనా (USD + ₹ లక్ష/కోటి). Live Rank.to ర్యాంక్ → విజిట్లు → రెవెన్యూ → విలువ.",
    toolHeading: "ఇప్పుడే విలువ చెక్ చేయండి",
    toolBlurb:
      "ఏదైనా డొమైన్ పేస్ట్ చేయండి. రిజల్ట్‌లో USD + ₹ (Lakh/Crore) కనిపిస్తాయి.",
    howHeading: "ఇది ఎలా పని చేస్తుంది?",
    howSteps: [
      "Rank.to నుండి లైవ్ గ్లోబల్ ర్యాంక్ తీసుకుంటాం.",
      "ర్యాంక్ నుండి నెలవారీ విజిట్ల అంచనా.",
      "Ads/affiliate RPMతో రెవెన్యూ అంచనా.",
      "వార్షిక రెవెన్యూ × మల్టిపుల్ ≈ వెబ్‌సైట్ విలువ.",
      "లైవ్ USD→INR రేటుతో లక్ష/కోటిలో చూపిస్తాం.",
    ],
    whyHeading: "ఈ సంఖ్య అర్థం ఏమిటి?",
    whyBody: [
      "ఇది దిశ చూపే అంచనా మాత్రమే — అధికారిక అప్రైజల్ లేదా హామీ ధర కాదు.",
      "కొనుగోలు ముందు Analytics, నిజమైన లాభం, యాజమాన్యం వెరిఫై చేయండి.",
      "INR గణాంకాలు లైవ్ కరెన్సీ రేట్‌పై ఆధారపడి లక్ష/కోటి రూపంలో ఉంటాయి.",
    ],
    inrNote: "రిజల్ట్‌లో విలువ ₹ లక్ష మరియు ₹ కోటిలో కూడా కనిపిస్తుంది.",
    faqs: [
      {
        q: "ఏ వెబ్‌సైట్ విలువైనా చెక్ చేయవచ్చా?",
        a: "అవును — పబ్లిక్ డొమైన్ ఇవ్వండి. Rank.to ర్యాంక్ ఉంటే అంచనా వస్తుంది.",
      },
      {
        q: "రూపాయల్లో ఎలా చూపిస్తారు?",
        a: "USD అంచనాను లైవ్ USD→INR రేటుతో మార్చి లక్ష/కోటిలో చూపిస్తాం.",
      },
      {
        q: "ఇది అసలు సేల్ ధరనా?",
        a: "కాదు. మోడల్ ఆధారిత అంచనా. డీల్‌కు ముందు ప్రాఫిట్/ట్రాఫిక్ వెరిఫై చేయండి.",
      },
      {
        q: "Website viluva ela calculate avuthundi?",
        a: "Rank → visits → RPM revenue → annual × multiple. Method వివరాలు సైట్‌లో ఉన్నాయి.",
      },
    ],
    otherLocales: [
      { href: "/hi/website-ki-kimat", label: "हिन्दी" },
      { href: "/ta/website-vilai", label: "தமிழ்" },
      { href: "/worth-meaning", label: "English" },
    ],
  },
  {
    path: "ta/website-vilai",
    lang: "ta",
    htmlLang: "ta",
    localeLabel: "தமிழ்",
    title:
      "இணையதள மதிப்பு பாருங்கள் — Site Worth & Earning Checker | WorthMeaning",
    description:
      "எந்த இணையதள மதிப்பு/வருவாயையும் ஆன்லைனில் பாருங்கள். Site worth + website earning checker — Live Rank.to மூலம் USD மற்றும் ₹ லட்சம்/கோடி. இலவசம்.",
    keywords: [
      "இணையதள மதிப்பு",
      "website vilai",
      "வெப்சைட் விலை",
      "site worth",
      "website earning checker",
      "website worth calculator tamil",
      "டொமைன் மதிப்பு",
      "website value tamil",
    ],
    kicker: "தமிழ் · இலவச கருவி",
    h1: "எந்த இணையதளத்தின் மதிப்பையும் பாருங்கள்",
    lede:
      "டொமைனை உள்ளிடுங்கள் — site worth, டிராஃபிக் மதிப்பு, வருவாய் மதிப்பீடு (USD + ₹ லட்சம்/கோடி). Live Rank.to ரேங்க் → வருகை → வருவாய் → மதிப்பு.",
    toolHeading: "இப்போதே மதிப்பைப் பாருங்கள்",
    toolBlurb:
      "எந்த டொமைனையும் ஒட்டவும். முடிவில் USD + ₹ (Lakh/Crore) தெரியும்.",
    howHeading: "இது எப்படி வேலை செய்கிறது?",
    howSteps: [
      "Rank.to-இல் இருந்து நேரடி உலக ரேங்க் எடுக்கிறோம்.",
      "ரேங்கிலிருந்து மாதாந்திர வருகையை மதிப்பிடுகிறோம்.",
      "Ads/affiliate RPM மூலம் வருவாய் மதிப்பீடு.",
      "ஆண்டு வருவாய் × மடங்கு ≈ இணையதள மதிப்பு.",
      "நேரடி USD→INR விகிதத்தில் லட்சம்/கோடியாகக் காட்டுகிறோம்.",
    ],
    whyHeading: "இந்த எண்ணின் அர்த்தம் என்ன?",
    whyBody: [
      "இது திசை காட்டும் மதிப்பீடு மட்டும் — அதிகாரப்பூர்வ மதிப்பீடு அல்லது உத்தரவாத விலை அல்ல.",
      "வாங்குவதற்கு முன் Analytics, உண்மையான லாபம், உரிமையைச் சரிபாருங்கள்.",
      "INR எண்கள் நேரடி நாணய விகிதத்தை அடிப்படையாகக் கொண்டு லட்சம்/கோடியில் காட்டப்படும்.",
    ],
    inrNote: "முடிவில் மதிப்பு ₹ லட்சம் மற்றும் ₹ கோடியிலும் தெரியும்.",
    faqs: [
      {
        q: "எந்த இணையதள மதிப்பையும் பார்க்கலாமா?",
        a: "ஆம் — பொது டொமைனை உள்ளிடுங்கள். Rank.to ரேங்க் இருந்தால் மதிப்பீடு கிடைக்கும்.",
      },
      {
        q: "ரூபாயில் எப்படி காட்டுவீர்கள்?",
        a: "USD மதிப்பீட்டை நேரடி USD→INR விகிதத்தில் மாற்றி லட்சம்/கோடியாகக் காட்டுவோம்.",
      },
      {
        q: "இது உண்மையான விற்பனை விலையா?",
        a: "இல்லை. மாடல் அடிப்படையிலான மதிப்பீடு. ஒப்பந்தத்திற்கு முன் லாபம்/டிராஃபிக் சரிபாருங்கள்.",
      },
      {
        q: "Website vilai eppadi calculate aagum?",
        a: "Rank → visits → RPM revenue → annual × multiple. Method விவரங்கள் தளத்தில் உள்ளன.",
      },
    ],
    otherLocales: [
      { href: "/hi/website-ki-kimat", label: "हिन्दी" },
      { href: "/te/website-viluva", label: "తెలుగు" },
      { href: "/worth-meaning", label: "English" },
    ],
  },
];

export function getLocalePage(path: string) {
  return LOCALE_PAGES.find((p) => p.path === path);
}
