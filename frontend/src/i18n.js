// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Create Folder": "Create Folder",
      "Upload to folder": "Upload to folder",
      "Select or create a folder to upload items": "Select or create a folder to upload items",
      "Total": "Total",
      "Gallery": "Gallery",
      "Export PDF": "Export PDF",
      "Share": "Share",
      "Share link copied": "Share link copied",
      "Delete": "Delete",
      "Edit": "Edit",
      "Login": "Login",
      "Register": "Register",
      "Profile": "Profile",
      "Dark": "Dark",
      "Light": "Light"
    }
  },
  hi: {
    translation: {
      "Create Folder": "फ़ोल्डर बनाएँ",
      "Upload to folder": "फ़ोल्डर में अपलोड करें",
      "Select or create a folder to upload items": "आइटम अपलोड करने के लिए फ़ोल्डर चुनें या बनाएं",
      "Total": "कुल",
      "Gallery": "गैलरी",
      "Export PDF": "पीडीएफ़ एक्सपोर्ट करें",
      "Share": "शेयर करें",
      "Share link copied": "शेयर लिंक कॉपी हो गया",
      "Delete": "हटाएँ",
      "Edit": "संपादित करें",
      "Login": "लॉग इन",
      "Register": "रजिस्टर",
      "Profile": "प्रोफ़ाइल",
      "Dark": "डार्क",
      "Light": "लाइट"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
