export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr';

export interface Translations {
  appName: string;
  tagline: string;
  goodEvening: string;
  guardianOnline: string;
  whereToGo: string;
  planSafeRoute: string;
  downtownSafeZone: string;
  expandMap: string;
  quickActions: string;
  priorityServices: string;
  findSafeRoute: string;
  findSafeRouteDesc: string;
  shareLiveLocation: string;
  shareLiveLocationDesc: string;
  emergencySos: string;
  emergencySosDesc: string;
  trustedContacts: string;
  trustedContactsDesc: string;
  safetyOverview: string;
  currentGpsRadius: string;
  secureZone: string;
  areaSafetyScore: string;
  streetLighting: string;
  goodLighting: string;
  smartLeds: string;
  crowdActivity: string;
  mediumActivity: string;
  openShops: string;
  nearbyHelpPoints: string;
  helpPointsAvailable: string;
  viewShapExplain: string;
  // Nav Bar
  homeTab: string;
  routesTab: string;
  sosTab: string;
  analyticsTab: string;
  profileTab: string;
  // Route Search
  routePlanner: string;
  fromLabel: string;
  toLabel: string;
  safetyPreferences: string;
  prioritizeSafety: string;
  prioritizeSafetyDesc: string;
  avoidIsolated: string;
  avoidIsolatedDesc: string;
  preferPublic: string;
  preferPublicDesc: string;
  wheelchair: string;
  wheelchairDesc: string;
  generateRoutesBtn: string;
  computingRoutes: string;
  // Route Comparison
  routeComparisonTitle: string;
  recommendedSafeRoute: string;
  selectSafeRouteBtn: string;
  explainShapBtn: string;
  // Live Nav
  liveGuidance: string;
  etaRemaining: string;
  simulateAlertBtn: string;
  simulateCheckinBtn: string;
  // SOS Screen
  emergencyCommand: string;
  tapForHelp: string;
  sosActivated: string;
  call911: string;
  alertContacts: string;
  shareGps: string;
  policeStation: string;
  nearestHospital: string;
  open247: string;
  nearestHelpPointsTitle: string;
  // Settings
  accountPreferences: string;
  personalInfo: string;
  personalInfoDesc: string;
  languageSelect: string;
  languageSelectDesc: string;
  nightMode: string;
  nightModeDesc: string;
  notificationSettings: string;
  notificationSettingsDesc: string;
  emergencyPrefs: string;
  emergencyPrefsDesc: string;
  privacyControls: string;
  privacyControlsDesc: string;
  signOut: string;
  // Check-In
  areYouSafe: string;
  imSafe: string;
  needHelp: string;
  checkinSubtitle: string;
  // AI Assistant
  aiCopilotTitle: string;
  askSafetyAssistant: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: "SafeRoute AI",
    tagline: "Safer Routes. Smarter Travel.",
    goodEvening: "Good Evening, Shivani 👋",
    guardianOnline: "Safe Guardian Network: 3 Online",
    whereToGo: "📍 Where do you want to go?",
    planSafeRoute: "Plan Safe Route",
    downtownSafeZone: "Downtown Safe Zone (Live)",
    expandMap: "Expand Map",
    quickActions: "Quick Actions",
    priorityServices: "Priority AI Services",
    findSafeRoute: "Find Safe Route",
    findSafeRouteDesc: "AI lighting & crowd analysis",
    shareLiveLocation: "Share Live Location",
    shareLiveLocationDesc: "Real-time beacon for family",
    emergencySos: "Emergency SOS",
    emergencySosDesc: "Instant sirens & 911 dispatch",
    trustedContacts: "Trusted Contacts",
    trustedContactsDesc: "Mother, Friend, Sister (3 Active)",
    safetyOverview: "Safety Overview Card",
    currentGpsRadius: "Current GPS Radius (500m)",
    secureZone: "Secure Zone",
    areaSafetyScore: "Area Safety Score",
    streetLighting: "Street Lighting",
    goodLighting: "Good (94 Lux)",
    smartLeds: "Smart municipal LEDs active",
    crowdActivity: "Crowd Activity",
    mediumActivity: "Medium",
    openShops: "Open shops & transit footfall",
    nearbyHelpPoints: "Nearby Help Points",
    helpPointsAvailable: "5 Available",
    viewShapExplain: "View Deep AI Explainability (SHAP Analysis)",
    homeTab: "Home",
    routesTab: "Routes",
    sosTab: "SOS",
    analyticsTab: "Analytics",
    profileTab: "Profile",
    routePlanner: "Safe Route Planner",
    fromLabel: "From",
    toLabel: "To",
    safetyPreferences: "Safety Preferences & Constraints",
    prioritizeSafety: "Prioritize Safety",
    prioritizeSafetyDesc: "Weights lighting, crowd, and police presence",
    avoidIsolated: "Avoid Isolated Roads",
    avoidIsolatedDesc: "Skips unlit alleys, dead ends & dark parks",
    preferPublic: "Prefer Public Transport",
    preferPublicDesc: "Follows well-monitored metro corridors",
    wheelchair: "Wheelchair Accessible",
    wheelchairDesc: "Ramps, smooth curbs & elevator access",
    generateRoutesBtn: "Generate Routes with AI",
    computingRoutes: "Computing Multidimensional Safety Matrix...",
    routeComparisonTitle: "AI Route Comparison",
    recommendedSafeRoute: "Recommended Safe Route",
    selectSafeRouteBtn: "Select Safe Route",
    explainShapBtn: "Explain AI Safety Model (SHAP Card)",
    liveGuidance: "Live Guidance",
    etaRemaining: "ETA Remaining",
    simulateAlertBtn: "Simulate Safety Alert",
    simulateCheckinBtn: "Test Check-in (30s)",
    emergencyCommand: "Emergency Command",
    tapForHelp: "TAP FOR HELP",
    sosActivated: "ACTIVATED",
    call911: "Call 911",
    alertContacts: "Alert Contacts",
    shareGps: "Share GPS",
    policeStation: "Police Station",
    nearestHospital: "Nearest Hospital & Trauma Center",
    open247: "Open 24/7",
    nearestHelpPointsTitle: "Nearest Help Points & Verified Havens",
    accountPreferences: "Account & Preferences",
    personalInfo: "Personal Information",
    personalInfoDesc: "Emergency ID, blood group & medical note",
    languageSelect: "Language Selection",
    languageSelectDesc: "Voice navigation guidance & text",
    nightMode: "Night / Dark Mode",
    nightModeDesc: "Dim display for low-light night walking",
    notificationSettings: "Notification Settings",
    notificationSettingsDesc: "Incident flash alerts & crowd warnings",
    emergencyPrefs: "Emergency Preferences",
    emergencyPrefsDesc: "SOS countdown threshold duration",
    privacyControls: "Privacy Controls",
    privacyControlsDesc: "Auto-delete GPS logs after 24h safe arrival",
    signOut: "Sign Out of SafeRoute AI",
    areYouSafe: "Are you safe?",
    imSafe: "✅ I'm Safe",
    needHelp: "🚨 Need Help",
    checkinSubtitle: "Periodic automated check-in while travelling through night corridor.",
    aiCopilotTitle: "SafeRoute AI Copilot",
    askSafetyAssistant: "Ask safety assistant..."
  },
  hi: {
    appName: "SafeRoute AI",
    tagline: "सुरक्षित मार्ग। स्मार्ट यात्रा।",
    goodEvening: "शुभ संध्या, शिवानी 👋",
    guardianOnline: "सुरक्षा अभिभावक नेटवर्क: 3 ऑनलाइन",
    whereToGo: "📍 आप कहाँ जाना चाहते हैं?",
    planSafeRoute: "सुरक्षित मार्ग बनाएं",
    downtownSafeZone: "डाउनटाउन सुरक्षित क्षेत्र (लाइव)",
    expandMap: "मानचित्र बड़ा करें",
    quickActions: "त्वरित कार्रवाइयां",
    priorityServices: "प्राथमिकता AI सेवाएं",
    findSafeRoute: "सुरक्षित मार्ग खोजें",
    findSafeRouteDesc: "AI प्रकाश एवं भीड़ विश्लेषण",
    shareLiveLocation: "लाइव लोकेशन साझा करें",
    shareLiveLocationDesc: "परिवार के लिए रीयल-टाइम बीकन",
    emergencySos: "आपातकालीन SOS",
    emergencySosDesc: "त्वरित सायरन और 112 डिस्पैच",
    trustedContacts: "विश्वसनीय संपर्क",
    trustedContactsDesc: "माताजी, सहेली, बहन (3 सक्रिय)",
    safetyOverview: "सुरक्षा समीक्षा कार्ड",
    currentGpsRadius: "वर्तमान GPS दायरा (500 मी)",
    secureZone: "सुरक्षित क्षेत्र",
    areaSafetyScore: "क्षेत्र सुरक्षा स्कोर",
    streetLighting: "सड़क प्रकाश (स्ट्रीट लाइट)",
    goodLighting: "उत्तम (94 लक्स)",
    smartLeds: "स्मार्ट म्यूनिसिपल LED सक्रिय",
    crowdActivity: "भीड़ गतिविधि",
    mediumActivity: "मध्यम",
    openShops: "खुली दुकानें व पैदल यात्री",
    nearbyHelpPoints: "निकटतम सहायता केंद्र",
    helpPointsAvailable: "5 उपलब्ध",
    viewShapExplain: "गहन AI व्याख्या देखें (SHAP विश्लेषण)",
    homeTab: "होम",
    routesTab: "मार्ग",
    sosTab: "SOS",
    analyticsTab: "एनालिटिक्स",
    profileTab: "प्रोफाइल",
    routePlanner: "सुरक्षित मार्ग योजनाकार",
    fromLabel: "प्रस्थान",
    toLabel: "गंतव्य",
    safetyPreferences: "सुरक्षा प्राथमिकताएं व शर्तें",
    prioritizeSafety: "सुरक्षा को प्राथमिकता दें",
    prioritizeSafetyDesc: "प्रकाश, भीड़ व पुलिस मौजूदगी को महत्व",
    avoidIsolated: "सुनसान सड़कों से बचें",
    avoidIsolatedDesc: "अंधेरी गलियों व सुनसान रास्तों को छोड़ें",
    preferPublic: "सार्वजनिक परिवहन पसंद करें",
    preferPublicDesc: "CCTV निगरानी वाले मेट्रो गलियारे",
    wheelchair: "व्हीलचेयर सुलभ",
    wheelchairDesc: "रैंप, सुगम फुटपाथ व लिफ्ट सुविधा",
    generateRoutesBtn: "AI से मार्ग उत्पन्न करें",
    computingRoutes: "सुरक्षा मैट्रिक्स की गणना जारी है...",
    routeComparisonTitle: "AI मार्ग तुलना",
    recommendedSafeRoute: "अनुशंसित सुरक्षित मार्ग",
    selectSafeRouteBtn: "सुरक्षित मार्ग चुनें",
    explainShapBtn: "AI सुरक्षा मॉडल समझें (SHAP कार्ड)",
    liveGuidance: "लाइव नेविगेशन",
    etaRemaining: "शेष समय (ETA)",
    simulateAlertBtn: "सुरक्षा अलर्ट अनुकरण करें",
    simulateCheckinBtn: "चेक-इन जांचें (30 से)",
    emergencyCommand: "आपातकालीन कमांड",
    tapForHelp: "मदद के लिए टैप करें",
    sosActivated: "सक्रिय हो गया",
    call911: "112 / पुलिस कॉल करें",
    alertContacts: "अभिभावकों को अलर्ट करें",
    shareGps: "GPS साझा करें",
    policeStation: "पुलिस स्टेशन",
    nearestHospital: "निकटतम अस्पताल एवं ट्रॉमा सेंटर",
    open247: "24/7 खुला है",
    nearestHelpPointsTitle: "निकटतम सहायता केंद्र और सुरक्षित ठिकाने",
    accountPreferences: "खाता और प्राथमिकताएं",
    personalInfo: "व्यक्तिगत जानकारी",
    personalInfoDesc: "आपातकालीन आईडी, ब्लड ग्रुप व मेडिकल नोट",
    languageSelect: "भाषा चयन",
    languageSelectDesc: "ध्वनि नेविगेशन और टेक्स्ट भाषा",
    nightMode: "नाइट / डार्क मोड",
    nightModeDesc: "रात में चलने के लिए मंद डिस्प्ले",
    notificationSettings: "अधिसूचना सेटिंग्स",
    notificationSettingsDesc: "घटना अलर्ट और भीड़ चेतावनियां",
    emergencyPrefs: "आपातकालीन प्राथमिकताएं",
    emergencyPrefsDesc: "SOS उलटी गिनती समय सीमा",
    privacyControls: "गोपनीयता नियंत्रण",
    privacyControlsDesc: "सुरक्षित आगमन के 24 घंटे बाद GPS लॉग हटाएं",
    signOut: "SafeRoute AI से लॉग आउट करें",
    areYouSafe: "क्या आप सुरक्षित हैं?",
    imSafe: "✅ मैं सुरक्षित हूँ",
    needHelp: "🚨 मुझे मदद चाहिए",
    checkinSubtitle: "रात के सफर के दौरान स्वचालित आवधिक सुरक्षा जांच।",
    aiCopilotTitle: "SafeRoute AI कोपायलट",
    askSafetyAssistant: "सुरक्षा सहायक से पूछें..."
  },
  es: {
    appName: "SafeRoute AI",
    tagline: "Rutas más seguras. Viajes inteligentes.",
    goodEvening: "Buenas Noches, Shivani 👋",
    guardianOnline: "Red de Guardianes: 3 Activos",
    whereToGo: "📍 ¿A dónde quieres ir?",
    planSafeRoute: "Planificar Ruta Segura",
    downtownSafeZone: "Zona Segura Centro (En Vivo)",
    expandMap: "Ampliar Mapa",
    quickActions: "Acciones Rápidas",
    priorityServices: "Servicios AI Prioritarios",
    findSafeRoute: "Buscar Ruta Segura",
    findSafeRouteDesc: "Análisis AI de luz y afluencia",
    shareLiveLocation: "Compartir Ubicación",
    shareLiveLocationDesc: "Baliza en tiempo real para familia",
    emergencySos: "SOS de Emergencia",
    emergencySosDesc: "Sirena inmediata y aviso a 911",
    trustedContacts: "Contactos de Confianza",
    trustedContactsDesc: "Madre, Amiga, Hermana (3 Activas)",
    safetyOverview: "Resumen de Seguridad",
    currentGpsRadius: "Radio GPS Actual (500m)",
    secureZone: "Zona Segura",
    areaSafetyScore: "Puntuación de Seguridad",
    streetLighting: "Iluminación Vial",
    goodLighting: "Buena (94 Lux)",
    smartLeds: "Luces LED municipales activas",
    crowdActivity: "Actividad Peatonal",
    mediumActivity: "Media",
    openShops: "Comercios abiertos y peatones",
    nearbyHelpPoints: "Puntos de Ayuda Cercanos",
    helpPointsAvailable: "5 Disponibles",
    viewShapExplain: "Ver Explicabilidad AI (Análisis SHAP)",
    homeTab: "Inicio",
    routesTab: "Rutas",
    sosTab: "SOS",
    analyticsTab: "Estadísticas",
    profileTab: "Perfil",
    routePlanner: "Planificador de Rutas Seguras",
    fromLabel: "Origen",
    toLabel: "Destino",
    safetyPreferences: "Preferencias de Seguridad",
    prioritizeSafety: "Priorizar Seguridad",
    prioritizeSafetyDesc: "Valora iluminación, gente y policía",
    avoidIsolated: "Evitar Calles Aisladas",
    avoidIsolatedDesc: "Omite callejones oscuros y parques",
    preferPublic: "Preferir Transporte Público",
    preferPublicDesc: "Sigue corredores de metro vigilados",
    wheelchair: "Accesible para Silla de Ruedas",
    wheelchairDesc: "Rampas, aceras llanas y ascensores",
    generateRoutesBtn: "Generar Rutas con AI",
    computingRoutes: "Calculando matriz de seguridad...",
    routeComparisonTitle: "Comparación de Rutas AI",
    recommendedSafeRoute: "Ruta Segura Recomendada",
    selectSafeRouteBtn: "Seleccionar Ruta Segura",
    explainShapBtn: "Explicar Modelo AI (Tarjeta SHAP)",
    liveGuidance: "Navegación en Vivo",
    etaRemaining: "Tiempo Restante",
    simulateAlertBtn: "Simular Alerta de Seguridad",
    simulateCheckinBtn: "Probar Registro (30s)",
    emergencyCommand: "Comando de Emergencia",
    tapForHelp: "TOCA PARA AYUDA",
    sosActivated: "ACTIVADO",
    call911: "Llamar al 911",
    alertContacts: "Alertar a Contactos",
    shareGps: "Compartir GPS",
    policeStation: "Estación de Policía",
    nearestHospital: "Hospital y Centro de Trauma",
    open247: "Abierto 24/7",
    nearestHelpPointsTitle: "Puntos de Ayuda y Refugios Verificados",
    accountPreferences: "Cuenta y Preferencias",
    personalInfo: "Información Personal",
    personalInfoDesc: "ID de emergencia, grupo sanguíneo y notas",
    languageSelect: "Selección de Idioma",
    languageSelectDesc: "Guía de voz y texto",
    nightMode: "Modo Nocturno / Oscuro",
    nightModeDesc: "Pantalla atenuada para caminar de noche",
    notificationSettings: "Notificaciones",
    notificationSettingsDesc: "Alertas de incidentes y advertencias",
    emergencyPrefs: "Preferencias de Emergencia",
    emergencyPrefsDesc: "Duración de cuenta regresiva SOS",
    privacyControls: "Controles de Privacidad",
    privacyControlsDesc: "Borrado automático de GPS tras 24h",
    signOut: "Cerrar Sesión en SafeRoute AI",
    areYouSafe: "¿Estás a salvo?",
    imSafe: "✅ Estoy a Salvo",
    needHelp: "🚨 Necesito Ayuda",
    checkinSubtitle: "Comprobación automática periódica durante el trayecto nocturno.",
    aiCopilotTitle: "Copiloto AI SafeRoute",
    askSafetyAssistant: "Preguntar al asistente de seguridad..."
  },
  fr: {
    appName: "SafeRoute AI",
    tagline: "Trajets plus sûrs. Voyages intelligents.",
    goodEvening: "Bonsoir, Shivani 👋",
    guardianOnline: "Réseau de Gardiens: 3 En Ligne",
    whereToGo: "📍 Où souhaitez-vous aller ?",
    planSafeRoute: "Planifier un Itinéraire Sûr",
    downtownSafeZone: "Zone Sécurisée Centre (En Direct)",
    expandMap: "Agrandir la Carte",
    quickActions: "Actions Rapides",
    priorityServices: "Services IA Prioritaires",
    findSafeRoute: "Trouver un Itinéraire Sûr",
    findSafeRouteDesc: "Analyse IA de l'éclairage et foule",
    shareLiveLocation: "Partager la Position",
    shareLiveLocationDesc: "Balise en direct pour vos proches",
    emergencySos: "SOS Urgence",
    emergencySosDesc: "Sirènes et alerte secours immédiates",
    trustedContacts: "Contacts de Confiance",
    trustedContactsDesc: "Mère, Amie, Sœur (3 Actifs)",
    safetyOverview: "Aperçu de Sécurité",
    currentGpsRadius: "Rayon GPS Actuel (500m)",
    secureZone: "Zone Sécurisée",
    areaSafetyScore: "Score de Sécurité de la Zone",
    streetLighting: "Éclairage Public",
    goodLighting: "Bon (94 Lux)",
    smartLeds: "LEDs municipales intelligentes",
    crowdActivity: "Activité de la Foule",
    mediumActivity: "Moyenne",
    openShops: "Commerces ouverts et piétons",
    nearbyHelpPoints: "Points de Secours Proches",
    helpPointsAvailable: "5 Disponibles",
    viewShapExplain: "Voir l'Explicabilité IA (Analyse SHAP)",
    homeTab: "Accueil",
    routesTab: "Itinéraires",
    sosTab: "SOS",
    analyticsTab: "Analyses",
    profileTab: "Profil",
    routePlanner: "Planificateur de Trajet Sécurisé",
    fromLabel: "Départ",
    toLabel: "Arrivée",
    safetyPreferences: "Préférences et Contraintes de Sécurité",
    prioritizeSafety: "Prioriser la Sécurité",
    prioritizeSafetyDesc: "Privilégie l'éclairage, la foule et la police",
    avoidIsolated: "Éviter les Rues Isolées",
    avoidIsolatedDesc: "Évite les ruelles sombres et parcs déserts",
    preferPublic: "Préférer les Transports Publics",
    preferPublicDesc: "Suit les couloirs de métro surveillés",
    wheelchair: "Accessible aux Fauteuils Roulants",
    wheelchairDesc: "Rampes, trottoirs lisses et ascenseurs",
    generateRoutesBtn: "Générer les Itinéraires avec l'IA",
    computingRoutes: "Calcul de la matrice de sécurité...",
    routeComparisonTitle: "Comparaison des Itinéraires IA",
    recommendedSafeRoute: "Itinéraire Sécurisé Recommandé",
    selectSafeRouteBtn: "Choisir cet Itinéraire",
    explainShapBtn: "Expliquer le Modèle IA (Fiche SHAP)",
    liveGuidance: "Navigation en Direct",
    etaRemaining: "Temps Restant (ETA)",
    simulateAlertBtn: "Simuler Alerte de Sécurité",
    simulateCheckinBtn: "Tester le Check-in (30s)",
    emergencyCommand: "Poste de Commandement d'Urgence",
    tapForHelp: "TOUCHER POUR DE L'AIDE",
    sosActivated: "ACTIVÉ",
    call911: "Appeler les Secours (112)",
    alertContacts: "Alerter les Contacts",
    shareGps: "Partager le GPS",
    policeStation: "Poste de Police",
    nearestHospital: "Hôpital et Centre de Traumatologie",
    open247: "Ouvert 24h/24 7j/7",
    nearestHelpPointsTitle: "Points de Secours et Refuges Vérifiés",
    accountPreferences: "Compte et Préférences",
    personalInfo: "Informations Personnelles",
    personalInfoDesc: "ID d'urgence, groupe sanguin et antécédents",
    languageSelect: "Choix de la Langue",
    languageSelectDesc: "Guidage vocal et affichage",
    nightMode: "Mode Nuit / Sombre",
    nightModeDesc: "Affichage tamisé pour la marche nocturne",
    notificationSettings: "Paramètres des Notifications",
    notificationSettingsDesc: "Alertes d'incidents et avertissements",
    emergencyPrefs: "Préférences d'Urgence",
    emergencyPrefsDesc: "Délai du compte à rebours SOS",
    privacyControls: "Contrôles de Confidentialité",
    privacyControlsDesc: "Suppression auto des traces GPS après 24h",
    signOut: "Se Déconnecter de SafeRoute AI",
    areYouSafe: "Êtes-vous en sécurité ?",
    imSafe: "✅ Je suis en Sécurité",
    needHelp: "🚨 Besoin d'Aide",
    checkinSubtitle: "Vérification automatique périodique pendant le trajet de nuit.",
    aiCopilotTitle: "Copilote IA SafeRoute",
    askSafetyAssistant: "Poser une question à l'assistant..."
  }
};
