import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr", // Langue par défaut
          includedLanguages: "en,de,es,it", // Langues disponibles
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    return () => {
      // Nettoyez le script si nécessaire
      document.body.removeChild(script);
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
