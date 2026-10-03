import { Language } from '../types';

export const translations = {
  en: {
    appName: "CoolShift Buddy",
    tagline: "Heat Protection & Facility Finder for Outdoor Gig Workers",
    navHome: "Alerts",
    navMap: "Facilities",
    navLogbook: "My Day Log",
    navReminders: "Hydration",
    navAdvocacy: "Solidarity Hub",
    
    // Risk Levels
    riskGreen: "Safe Heat Index",
    riskYellow: "Moderate Heat",
    riskOrange: "Dangerous Heat",
    riskRed: "Extreme Heat Emergency",
    
    riskDescGreen: "Normal outdoor conditions. Keep a water bottle handy.",
    riskDescYellow: "Temperature is rising. Drink water every 45-60 minutes.",
    riskDescOrange: "Very Hot! High risk of heat exhaustion. Drink water every 30 mins & find shade.",
    riskDescRed: "CRITICAL HEAT! Severe danger of heat stroke. Mandatory shade rest and electrolytes immediately.",

    riskShortGreen: "Safe",
    riskShortYellow: "Caution",
    riskShortOrange: "Very Hot",
    riskShortRed: "Extreme Danger",

    // Quick Actions
    actionFindMap: "Find Water / Toilet / Shade",
    actionDrankWater: "I Drank Water",
    actionTookBreak: "Took 10m Shade Break",
    actionViewSummary: "My Exposure Summary",
    actionSimulateConditions: "Adjust Live Weather / Simulation",

    // Home Stats
    todayStats: "Today's Exposure Risk",
    timeInHighHeat: "In Extreme Heat (Orange/Red)",
    timeWithoutToilet: "Hours with No Toilet Nearby",
    waterTakenToday: "Water Logs Today",
    glasses: "times",
    hours: "hrs",
    minutes: "mins",

    // Weather Card
    temperature: "Air Temperature",
    humidity: "Relative Humidity",
    heatIndex: "Heat Index (Feels Like)",
    wind: "Wind",
    uv: "UV Index",
    selectedCity: "Active Location",

    // Facilities
    facilitiesTitle: "Safe Facility Finder",
    filterAll: "All Places",
    filterWater: "Drinking Water",
    filterToilet: "Public Toilets",
    filterShade: "Shaded Rest Spots",
    withinRadius: "within 1 km",
    free: "Free",
    paid: "Paid (₹5-10)",
    cleanliness: "Cleanliness",
    openNow: "Open",
    directions: "Open in Google Maps",
    addPlaceBtn: "+ Add Safe Spot",
    distance: "Distance",
    meters: "m",
    noPlacesFound: "No facilities registered nearby. Add one to help other workers!",

    // Add place modal
    addPlaceTitle: "Report a Facility for Gig Workers",
    placeName: "Place Name / Landmark",
    placeType: "Facility Type",
    isFreeOrPaid: "Is it Free or Paid?",
    isFreeLabel: "Free to use",
    isPaidLabel: "Nominal fee (₹5-10)",
    cleanRating: "How clean/usable is it?",
    submitPlace: "Share with Workers",
    cancel: "Cancel",

    // Reminders
    remindersTitle: "Hydration & Rest Timers",
    remindersSubtitle: "Smart interval reminders tuned to Tamil Nadu heat levels",
    nextWaterIn: "Next Water Break In",
    nextRestIn: "Next Shade Break In",
    workloadSetting: "Work Intensity",
    lightWork: "Light / Partial Shade",
    normalWork: "Rider / Moderate Pace",
    hardWork: "Heavy Outdoor / Direct Sun",
    autoTuneHeat: "Auto-adjust intervals during Orange & Red heat index",
    soundAlert: "Chime Sound Notification",
    voiceAlert: "Spoken Tamil/English Voice Alert",
    logWaterSuccess: "Water intake logged! Staying hydrated protects your kidneys.",
    logBreakSuccess: "Shade rest recorded. Great job giving your heart a rest.",

    // Logbook
    logbookTitle: "Automated Heat Risk Logbook",
    logbookSubtitle: "Real-time records showing your heat exposure and lack of basic facilities",
    dailyTab: "Today's Shift",
    weeklyTab: "Weekly Summary",
    totalLogged: "Logged Checkpoints",
    noToiletRisk: "High Heat & 0 Sanitation",
    timelineTitle: "Shift Exposure Timeline",
    exportReport: "Export Evidence for Union / Doctor",
    exportSuccess: "Report copied to clipboard! Ready to share via WhatsApp or print.",
    deleteLogbook: "Clear Local Logbook",
    deleteConfirm: "Are you sure? This deletes your stored shift records.",

    // Solidarity / Advocacy Hub
    advocacyTitle: "Worker Solidarity & Heat Advocacy Hub",
    advocacySubtitle: "Turning individual suffering into unignorable collective proof",
    advocacyIntro: "In Tamil Nadu, 78.8% of surveyed gig workers have no access to clean toilets during 12-hour shifts. By sharing anonymous data, workers show municipal authorities, unions, and delivery platforms exactly where Thanner Pandals, clean toilets, and AC cooling rest spots must be built.",
    anonymousSharingActive: "Anonymous Data Sharing Active",
    anonymousSharingDesc: "Only rounded grid coordinates and heat readings are shared. No phone number, name, or delivery route is ever transmitted.",
    toggleSharing: "Share Anonymized Heat & Facility Data",
    hotspotsTitle: "Documented Heat & Sanitation Deficit Hotspots",
    workersCount: "workers tracked",
    deficitToilet: "Deficit of clean toilets",
    deficitWater: "Water shortage area",
    downloadPolicyBrief: "Download Union Demands & Policy Brief",
    unionDemands: "Key Demands for Delivery & Informal Workers:",
    demand1: "Free access to clean municipal restrooms in major commercial hubs (T. Nagar, Koyambedu, Periyar)",
    demand2: "Air-conditioned rest shelters funded by gig platforms and Tamil Nadu Gig Workers Board",
    demand3: "State-wide Heat Hazard Pay and right to pause deliveries when Heat Index crosses 45°C",

    // Onboarding
    welcomeTitle: "Vanakkam! Welcome to CoolShift Buddy",
    welcomeSubtitle: "Built for delivery partners, drivers, vendors, and outdoor workers in Tamil Nadu",
    chooseLanguage: "Choose Your Language / மொழியைத் தேர்ந்தெடுக்கவும்",
    selectRole: "What is your daily outdoor work?",
    roleDelivery: "Delivery Partner (Swiggy, Zomato, Dunzo, Zepto)",
    roleAuto: "Auto / Tempo / Taxi Driver",
    roleVendor: "Street Vendor / Tea Stall / Flower Seller",
    roleSanitation: "Sanitation / Sweeper / Conservancy",
    roleConstruction: "Construction / Daily Wage Labourer",
    roleOther: "Other Outdoor Worker",
    selectCity: "Your Primary Working City",
    privacyPromise: "We never ask for your phone number, real name, or customer addresses. Your data stays on your phone unless you opt to help the union collective.",
    getStarted: "Start CoolShift Buddy",

    // Offline & Low Data
    offlineMode: "Offline Mode (Using cached map & last weather)",
    lowBatteryAlert: "Low Data / Battery Mode Active",
  },

  ta: {
    appName: "கூல்ஷிப்ட் படி (CoolShift)",
    tagline: "வெப்ப அலை எச்சரிக்கை & குடிநீர், கழிப்பறை வழிகாட்டி",
    navHome: "எச்சரிக்கை",
    navMap: "வசதிகள்",
    navLogbook: "பணிப் பதிவு",
    navReminders: "குடிநீர்",
    navAdvocacy: "தொழிலாளர் அரண்",

    // Risk Levels
    riskGreen: "பாதுகாப்பான வெப்பம்",
    riskYellow: "மிதமான வெப்பம் (கவனம்)",
    riskOrange: "அபாயகரமான அதிக வெப்பம்!",
    riskRed: "அதீத வெப்ப ஆபத்து! (எச்சரிக்கை)",

    riskDescGreen: "இயல்பான சூழல். குடிநீர் பாட்டிலை கையில் வைத்திருங்கள்.",
    riskDescYellow: "வெப்பம் உயர்கிறது. 45-60 நிமிடங்களுக்கு ஒருமுறை நீர் அருந்தவும்.",
    riskDescOrange: "அதிக வெயில்! சோர்வு, தலைசுற்றல் ஏற்படும் அபாயம். 30 நிமிடத்திற்கு ஒருமுறை தண்ணீர் குடிக்கவும் & நிழலில் நிற்கவும்.",
    riskDescRed: "அதீத வெப்பம்! உடனடியாக நிழலில் 10 நிமிடம் ஓய்வெடுத்து, உப்பு கலந்த நீர் அல்லது ORS அருந்துங்கள்.",

    riskShortGreen: "பாதுகாப்பு",
    riskShortYellow: "கவனம்",
    riskShortOrange: "அதிக வெயில்",
    riskShortRed: "அதீத ஆபத்து",

    // Quick Actions
    actionFindMap: "குடிநீர் / கழிப்பறை / நிழல் காண்க",
    actionDrankWater: "தண்ணீர் குடித்தேன்",
    actionTookBreak: "10 நிமி நிழல் ஓய்வு எடுத்தேன்",
    actionViewSummary: "இன்றைய வெப்பப் பதிவு",
    actionSimulateConditions: "வெப்பநிலையை மாற்றி சோதிக்க",

    // Home Stats
    todayStats: "இன்றைய வெப்ப ஆபத்து நிலை",
    timeInHighHeat: "கடுமையான வெயிலில் கழித்த நேரம்",
    timeWithoutToilet: "கழிப்பறை வசதி இல்லாத நேரம்",
    waterTakenToday: "தண்ணீர் குடித்த பதிவுகள்",
    glasses: "முறை",
    hours: "மணி",
    minutes: "நிமிடம்",

    // Weather Card
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    heatIndex: "உணரப்படும் வெப்பம் (Heat Index)",
    wind: "காற்று",
    uv: "புற ஊதாக் கதிர் (UV)",
    selectedCity: "இடம்",

    // Facilities
    facilitiesTitle: "அருகிலுள்ள பொது வசதிகள்",
    filterAll: "அனைத்தும்",
    filterWater: "குடிநீர் பந்தல்",
    filterToilet: "பொதுக் கழிப்பறை",
    filterShade: "நிழல் தரும் இடம்",
    withinRadius: "1 கி.மீ சுற்றளவில்",
    free: "இலவசம்",
    paid: "கட்டணம் (₹5-10)",
    cleanliness: "தூய்மை தரம்",
    openNow: "திறந்துள்ளது",
    directions: "கூகுள் மேப்பில் வழி",
    addPlaceBtn: "+ புதிய இடம் சேர்க்க",
    distance: "தொலைவு",
    meters: "மீ",
    noPlacesFound: "அருகில் இடங்கள் இல்லை. மற்ற தொழிலாளர்களுக்கு உதவ நீங்கள் புதிய இடத்தை சேர்க்கலாம்!",

    // Add place modal
    addPlaceTitle: "தொழிலாளர்களுக்கான புதிய இடத்தை சேர்க்க",
    placeName: "இடத்தின் பெயர் / அடையாளம்",
    placeType: "வசதி வகை",
    isFreeOrPaid: "இலவசமா அல்லது கட்டணமா?",
    isFreeLabel: "இலவச பயன்பாடு",
    isPaidLabel: "சிறு கட்டணம் (₹5-10)",
    cleanRating: "சுத்தம் மற்றும் பயன்பாட்டு தரம்",
    submitPlace: "இடத்தை பதிவு செய்",
    cancel: "ரத்து செய்",

    // Reminders
    remindersTitle: "தண்ணீர் & ஓய்வு நினைவூட்டல்",
    remindersSubtitle: "தமிழ்நாட்டின் வெயில் அளவிற்கேற்ப எச்சரிக்கும் தானியங்கி அமைப்பு",
    nextWaterIn: "அடுத்த தண்ணீர் இடைவேளை",
    nextRestIn: "அடுத்த நிழல் ஓய்வு",
    workloadSetting: "பணியின் கடினத்தன்மை",
    lightWork: "குறைவான வெயில் / நிழல்",
    normalWork: "வழக்கமான டெலிவரி / ஆட்டோ",
    hardWork: "நேரடி கடும் வெயில் வேலை",
    autoTuneHeat: "அதிக வெயில் இருக்கும் போது தானாகவே நினைவூட்டல்களை துரிதப்படுத்து",
    soundAlert: "ஒலி எச்சரிக்கை மணி",
    voiceAlert: "தமிழ் குரல் எச்சரிக்கை (Voice)",
    logWaterSuccess: "தண்ணீர் குடித்தது பதிவானது! நீர்ச்சத்து சிறுநீரகத்தை பாதுகாக்கும்.",
    logBreakSuccess: "நிழல் ஓய்வு பதிவானது. உடலுக்கு நலம் தரும் நற்பணி.",

    // Logbook
    logbookTitle: "வெப்ப ஆபத்து பதிவேடு (Logbook)",
    logbookSubtitle: "கழிப்பறை & குடிநீர் இன்றி வெயிலில் உழைக்கும் அவலத்தை நிரூபிக்கும் தரவு",
    dailyTab: "இன்றைய ஷிப்ட்",
    weeklyTab: "வாராந்திர சுருக்கம்",
    totalLogged: "பதிவான ஆய்வுக் குறிப்புகள்",
    noToiletRisk: "கழிப்பறை இல்லாத கடும் வெயில்",
    timelineTitle: "பணி நேர வெப்ப வரைபடம்",
    exportReport: "சங்கம் / மருத்துவருக்கு அறிக்கை அனுப்பு",
    exportSuccess: "அறிக்கை நகலெடுக்கப்பட்டது! வாட்ஸ்அப்பில் பகிரலாம்.",
    deleteLogbook: "பதிவேட்டை நீக்கு",
    deleteConfirm: "உறுதியாக நீக்க விரும்புகிறீர்களா?",

    // Solidarity / Advocacy Hub
    advocacyTitle: "தொழிலாளர் அரண் & சங்கப் பகிர்வு",
    advocacySubtitle: "தனிநபர் துயரத்தை மறுக்க முடியாத கூட்டு ஆதாரமாக மாற்றுவோம்",
    advocacyIntro: "தமிழ்நாட்டில் ஆய்வு செய்யப்பட்ட 255 கிக் தொழிலாளர்களில் 78.8% பேருக்கு கழிப்பறை வசதி இல்லை. தொழிலாளர்கள் பகிரும் அநாமதேய தரவு மூலமாக, நகராட்சி நிர்வாகத்திடமும் சங்கங்களிடமும் தாகம் தீர்க்கும் தண்ணீர் பந்தல் மற்றும் குளிரூட்டப்பட்ட ஓய்வறைகளை கோர முடியும்.",
    anonymousSharingActive: "அநாமதேய தரவுப் பகிர்வு இயக்கத்தில் உள்ளது",
    anonymousSharingDesc: "உங்கள் பெயர், தொலைபேசி எண், அல்லது செல்லும் வழி எவையும் பகிரப்படாது. வெப்ப அளவு மற்றும் வசதி குறைபாடு மட்டுமே பதிவாகும்.",
    toggleSharing: "அநாமதேய தரவை சங்கங்களுடன் பகிர்",
    hotspotsTitle: "அதிக வெயில் & கழிப்பறை பற்றாக்குறை மண்டலங்கள்",
    workersCount: "தொழிலாளர்கள் பகிர்ந்த தரவு",
    deficitToilet: "கழிப்பறை இல்லாத ஆபத்து விகிதம்",
    deficitWater: "குடிநீர் பற்றாக்குறை பகுதி",
    downloadPolicyBrief: "சங்கத்தின் கோரிக்கை அறிக்கையை பதிவிறக்கு",
    unionDemands: "அரசு மற்றும் நிறுவனங்களிடம் முக்கிய கோரிக்கைகள்:",
    demand1: "வணிகப் பகுதிகளில் இலவச மற்றும் சுத்தமான கழிப்பறை வசதி (தி.நகர், கோயம்பேடு, பெரியார் நிலையம்)",
    demand2: "கிக் தொழிலாளர் நல வாரியம் மூலம் குளிரூட்டப்பட்ட நிழல் ஓய்வறைகள் அமைத்தல்",
    demand3: "வெப்ப அலை நேரத்தில் கூடுதல் இடர்பாட்டு ஊதியம் (Heat Hazard Pay) மற்றும் டெலிவரி இடைநிறுத்த உரிமை",

    // Onboarding
    welcomeTitle: "வணக்கம்! கூல்ஷிப்ட் படிக்கு நல்வரவு",
    welcomeSubtitle: "டெலிவரி, ஆட்டோ, தூய்மை மற்றும் வெளிப்புற உழைப்பாளர்களின் பாதுகாப்புத் தோழன்",
    chooseLanguage: "Choose Your Language / மொழியைத் தேர்ந்தெடுக்கவும்",
    selectRole: "உங்கள் அன்றாட வேலை என்ன?",
    roleDelivery: "டெலிவரி பார்ட்னர் (Swiggy, Zomato, Zepto)",
    roleAuto: "ஆட்டோ / டெம்போ / டாக்ஸி ஓட்டுநர்",
    roleVendor: "தெருவோர வியாபாரி / இளநீர் / தேநீர் கடை",
    roleSanitation: "தூய்மைப் பணியாளர்",
    roleConstruction: "கட்டுமான / கூலித் தொழிலாளி",
    roleOther: "இதர வெளிப்புறப் பணி",
    selectCity: "உங்கள் பணி நகரம்",
    privacyPromise: "உங்கள் தொலைபேசி எண், பெயர், அல்லது வாடிக்கையாளர் முகவரி எதையும் நாங்கள் கேட்பதில்லை. உங்கள் தகவல்கள் உங்கள் போனிலேயே பாதுகாப்பாக இருக்கும்.",
    getStarted: "தொடங்குக",

    // Offline & Low Data
    offlineMode: "ஆஃப்லைன் பயன்முறை (முந்தைய தரவு)",
    lowBatteryAlert: "குறைந்த டேட்டா / பேட்டரி சேமிப்பு முறை",
  }
};

export function getT(lang: Language) {
  return translations[lang] || translations.ta;
}
