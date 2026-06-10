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
    hero_sub: "We compile, audit, and deploy high-performance systematic Expert Advisors (EAs) and quantitative execution models. Integrate verified algorithmic strategies directly onto your MT5 or VPS systems with sub-millisecond execution control, protected by hardcoded risk safeguard protocols.",
    badge_research: "Institutional Research Desk",
    cta_request: "Get 7-Day Free Trial",
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
    hero_sub: "हम संस्थागत ग्रेड के सिस्टमैटिक Expert Advisors (EAs) और क्वांटिटेटिव निष्पादन मॉडल का निर्माण और तैनाती करते हैं। सीधे अपने MT5 प्लेटफ़ॉर्म पर उप-मिलीसेकंड विलंबता के साथ स्वचालित रणनीति निष्पादित करें, जो कठिन जोखिम सीमाओं द्वारा सुरक्षित है।",
    badge_research: "संस्थागत अनुसंधान डेस्क",
    cta_request: "7 दिनों का मुफ़्त परीक्षण लें",
    cta_results: "परिणाम देखें",
    cta_explore: "खozें",
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
    hero_sub: "نحن نقوم بتطوير ونشر مستشاري الخبراء المنهجيين (EAs) ونماذج التنفيذ الكمي ذات الكفاءة العالية. قم بدمج استراتيجياتك الآلية مباشرة على منصة MT5 بزمن انتقال يقل عن مللي ثانية واحدة، محمية بحدود مخاطر صارمة.",
    badge_research: "مكتب البحوث المؤسسية",
    cta_request: "ابدأ تجربة مجانية لمدة 7 أيام",
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
    hero_sub: "Compilamos, auditamos y desplegamos Expert Advisors (EAs) sistemáticos y modelos de ejecución cuantitativa de alto rendimiento. Integre estrategias algorítmicas directamente en sus sistemas MT5 con latencia sub-milisegundo, protegidos por límites de riesgo estrictos.",
    badge_research: "Mesa de Investigación Institucional",
    cta_request: "Obtener Prueba de 7 Días",
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
    hero_sub: "Wir kompilieren, prüfen und implementieren hochpräzise systematische Expert Advisors (EAs) und quantitative Ausführungsmodelle. Integrieren Sie verifizierte algorithmische Strategien mit einer Latenz von unter einer Millisekunde direkt in Ihre MT5-Systeme.",
    badge_research: "Institutioneller Research Desk",
    cta_request: "7 Tage kostenlos testen",
    cta_results: "Ergebnisse sehen",
    cta_explore: "Erkunden",
    nav_home: "Startseite",
    nav_ecosystem: "Ökosystem",
    nav_webinars: "Webinale",
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
    hero_sub: "Nous compilons, auditons et déployons des Expert Advisors (EAs) systématiques et des modèles d'exécution quantitative de haute performance. Intégrez des stratégies algorithmiques directement sur vos systèmes MT5 avec une latence inférieure à la milliseconde.",
    badge_research: "Bureau de Recherche Institutionnelle",
    cta_request: "Essai gratuit de 7 jours",
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
