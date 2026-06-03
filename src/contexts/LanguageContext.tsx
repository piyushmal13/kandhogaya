import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LanguageCode = "en" | "hi" | "ar" | "es" | "de" | "fr";

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    hero_world_class: "World-Class",
    hero_inst_fx: "Institutional FX",
    hero_macro: "& Macro.",
    hero_sub: "We design and build reliable automated trading tools, platform integrations, and custom execution setups for traders and brokerages globally. Automate your ideas with our proven, human-led expertise.",
    badge_research: "Institutional Research Desk",
    cta_request: "Request Session",
    cta_results: "See Results",
    cta_explore: "Explore",
    nav_home: "Home",
    nav_ecosystem: "Ecosystem",
    nav_webinars: "Webinars",
    nav_market: "Marketplace",
    nav_research: "Research",
    nav_about: "About",
    portal: "Portal",
    payment_notice: "We accept Mastercard, UPI Payments (PhonePe, GPay), Credit/Debit cards & Crypto"
  },
  hi: {
    hero_world_class: "विश्व-स्तरीय",
    hero_inst_fx: "संस्थागत FX",
    hero_macro: "और मैक्रो।",
    hero_sub: "हम संस्थागत डेस्क के लिए उच्च-सटीकता वाले सिस्टमैटिक एल्गोरिदम और ECN ब्रिज सिस्टम बनाते हैं। अपनी अनूठी ट्रेडिंग प्रणाली को उप-मिलीसेकंड सटीकता के साथ कोड करें।",
    badge_research: "संस्थागत अनुसंधान डेस्क",
    cta_request: "सत्र का अनुरोध करें",
    cta_results: "परिणाम देखें",
    cta_explore: "खोजें",
    nav_home: "होम",
    nav_ecosystem: "पारिस्थितिकी तंत्र",
    nav_webinars: "वेबिनार",
    nav_market: "बाज़ार",
    nav_research: "अनुसंधान",
    nav_about: "हमारे बारे में",
    portal: "पोर्टल",
    payment_notice: "हम मास्टरकार्ड, UPI भुगतान (PhonePe, GPay), क्रेडिट/डेबिट कार्ड और क्रिप्टो स्वीकार करते हैं"
  },
  ar: {
    hero_world_class: "عالمي المستوى",
    hero_inst_fx: "الفوركس المؤسسي",
    hero_macro: "والماكرو.",
    hero_sub: "نحن نصمم خوارزميات منهجية عالية الدقة وأنظمة جسر ECN للمكاتب المؤسسية. قم ببرمجة إطار التداول الفريد الخاص بك بدقة تقل عن جزء من الألف من الثانية.",
    badge_research: "مكتب البحوث المؤسسية",
    cta_request: "طلب جلسة",
    cta_results: "رؤية النتائج",
    cta_explore: "استكشف",
    nav_home: "الرئيسية",
    nav_ecosystem: "النظام البيئي",
    nav_webinars: "الندوات",
    nav_market: "السوق",
    nav_research: "الأبحاث",
    nav_about: "حول",
    portal: "البوابة",
    payment_notice: "نحن نقبل ماستركارد، مدفوعات UPI (PhonePe ، GPay)، بطاقات الائتمان/الخصم والعملات المشفرة"
  },
  es: {
    hero_world_class: "Clase Mundial",
    hero_inst_fx: "FX Institucional",
    hero_macro: "y Macro.",
    hero_sub: "Diseñamos algoritmos sistemáticos de alta fidelidad y sistemas de puente ECN para mesas institucionales. Codifique su propio marco de negociación con precisión de sub-milisegundos.",
    badge_research: "Mesa de Investigación Institucional",
    cta_request: "Solicitar Sesión",
    cta_results: "Ver Resultados",
    cta_explore: "Explorar",
    nav_home: "Inicio",
    nav_ecosystem: "Ecosistema",
    nav_webinars: "Webinarios",
    nav_market: "Mercado",
    nav_research: "Investigación",
    nav_about: "Nosotros",
    portal: "Portal",
    payment_notice: "Aceptamos Mastercard, pagos UPI (PhonePe, GPay), tarjetas de crédito/débito y criptomonedas"
  },
  de: {
    hero_world_class: "Weltklasse",
    hero_inst_fx: "Institutionelles FX",
    hero_macro: "& Makro.",
    hero_sub: "Wir entwickeln hochpräzise systematische Algorithmen und ECN-Bridge-Systeme für institutionelle Desks. Codieren Sie Ihr einzigartiges Handels-Framework mit Sub-Millisekunden-Präzision.",
    badge_research: "Institutioneller Research Desk",
    cta_request: "Sitzung anfordern",
    cta_results: "Ergebnisse sehen",
    cta_explore: "Erkunden",
    nav_home: "Startseite",
    nav_ecosystem: "Ökosystem",
    nav_webinars: "Webinare",
    nav_market: "Marktplatz",
    nav_research: "Forschung",
    nav_about: "Über uns",
    portal: "Portal",
    payment_notice: "Wir akzeptieren Mastercard, UPI-Zahlungen (PhonePe, GPay), Kredit-/Debitkarten & Krypto"
  },
  fr: {
    hero_world_class: "Classe Mondiale",
    hero_inst_fx: "FX Institutionnel",
    hero_macro: "& Macro.",
    hero_sub: "Nous concevons des algorithmes systématiques de haute fidélité et des systèmes de pont ECN pour les pupitres institutionnels. Codez votre cadre de trading unique avec une précision de l'ordre de la sous-milliseconde.",
    badge_research: "Bureau de Recherche Institutionnelle",
    cta_request: "Demander une Session",
    cta_results: "Voir les Résultats",
    cta_explore: "Explorer",
    nav_home: "Accueil",
    nav_ecosystem: "Écosystème",
    nav_webinars: "Webinaires",
    nav_market: "Boutique",
    nav_research: "Recherche",
    nav_about: "À Propos",
    portal: "Portail",
    payment_notice: "Nous acceptons Mastercard, les paiements UPI (PhonePe, GPay), les cartes de crédit/débit et les cryptomonnaies"
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("ifx_locale") as LanguageCode;
    if (saved && translations[saved]) return saved;

    const browser = navigator.language.slice(0, 2) as LanguageCode;
    if (browser && translations[browser]) return browser;

    return "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("ifx_locale", lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
  };

  const isRtl = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return context;
};
