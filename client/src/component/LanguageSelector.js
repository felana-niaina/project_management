import React, { useEffect, useState } from 'react';

const LanguageSelector = () => {
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleTranslateLoaded = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkGoogleTranslateLoaded);
        setIsTranslateLoaded(true);
      }
    }, 500);

    return () => clearInterval(checkGoogleTranslateLoaded);
  }, []);

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    if (isTranslateLoaded) {
      setTimeout(() => {
        const frame = document.querySelector('.goog-te-menu-frame');
        if (frame) {
          const menu = frame.contentWindow.document;
          const langOption = menu.querySelector(`[data-lang="${language}"]`);
          if (langOption) {
            langOption.click();
          }
        }
      }, 1000); // Attendre que le widget soit chargé
    }
  };

  return (
    <select onChange={handleLanguageChange} style={{ color: 'black' }}>
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="it">Italiano</option>
    </select>
  );
};

export default LanguageSelector;
