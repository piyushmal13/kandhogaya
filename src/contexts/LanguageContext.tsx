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
    hero_sub: "We provide professional proprietary trading algorithms at the best cost. If you have a specific trading strategy, our quantitative desk will build it for you with high precision and institutional-grade reliability.",
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
    hero_sub: "हम सर्वोत्तम लागत पर पेशेवर मालिकाना ट्रेडिंग एल्गोरिदम प्रदान करते हैं। यदि आपके पास कोई विशिष्ट ट्रेडिंग रणनीति है, तो हमारी मात्रात्मक डेस्क इसे आपके लिए उच्च सटीकता और संस्थागत-ग्रेड विश्वसनीयता के साथ बनाएगी।",
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
    hero_sub: "نحن نقدم خوارزميات تداول احترافية خاصة بأفضل التكاليف. إذا كانت لديك إستراتيجية تداول محددة، فسيقوم مكتبنا الكمي ببنائها لك بدقة عالية وموثوقية على المستوى المؤسسي.",
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
    hero_sub: "Ofrecemos algoritmos de negociación propios y profesionales al mejor costo. Si tiene una estrategia de negociación específica, nuestra mesa cuantitativa la desarrollará para usted con alta precisión y confiabilidad de grado institucional.",
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
    hero_sub: "Wir bieten professionelle, proprietäre Handelsalgorithmen zu optimalen Konditionen. Wenn Sie eine spezifische Handelsstrategie haben, baut unser quantitativer Desk diese für Sie mit hoher Präzision und institutioneller Zuverlässigkeit.",
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
    hero_sub: "Nous fournissons des algorithmes de trading exclusifs et professionnels au meilleur coût. Si vous avez une stratégie de trading spécifique, notre bureau quantitatif la construira pour vous avec une grande précision et une fiabilité de niveau institutionnel.",
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
