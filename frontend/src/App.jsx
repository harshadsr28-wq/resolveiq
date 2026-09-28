import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import "./index.css"

import {
  Brain, Sparkles, MessageSquare, CheckCircle2,
  Lightbulb,
  RotateCcw, AlertCircle, Globe, ChevronDown
} from "lucide-react"

// ─── Translation Data ────────────────────────────────────────────
const LANG_KEYS = {
  English: "English",
  Telugu: "Telugu",
  Hindi: "Hindi",
  Kannada: "Kannada",
  Tamil: "Tamil",
}

const LANG_LABELS = {
  English: "English",
  Telugu: "తెలుగు",
  Hindi: "हिंदी",
  Kannada: "ಕನ್ನಡ",
  Tamil: "தமிழ்",
}

const T = {
  English: {
    customerIssue: "Customer Issue",
    analyzeIssue: "Analyze Issue",
    analyzing: "Analyzing & Recalling Memories…",
    memoryRecall: "Hindsight Memory Recall",
    memorySubtitle: "Relevant past experiences retrieved",
    aiRec: "AI Recommendation",
    aiRecSubtitle: "Based on issue analysis + Hindsight memories",
    recordOutcome: "Record Outcome",
    recordSubtitle: "Teach ResolveIQ what happened",
    actionTaken: "Action Taken",
    outcome: "Outcome",
    verificationResult: "Verification Result",
    relevantExp: "Relevant Experiences",
    teachBtn: "Record Outcome & Teach ResolveIQ",
    teaching: "Recording & Teaching ResolveIQ…",
    language: "Language",
    whatHappened: "What happened?",
    selectCategory: "Select an issue category",
    resolved: "Resolved",
    unresolved: "Unresolved",
    memoriesRecalled: (n) => `${n} ${n === 1 ? "memory" : "memories"} recalled`,
    noMemory: "No past experiences found — this will be the first memory for similar issues.",
    analyzeAnother: "Analyze Another Issue",
    successTitle: "ResolveIQ learned from this outcome.",
    successDesc: "This experience has been stored in Hindsight Memory and will improve future resolutions for similar customer issues.",
    analysisComplete: "Analysis Complete",
    fillAll: "Please fill in all fields before recording the outcome.",
    loopAction: "Action",
    loopOutcome: "Outcome",
    loopLearning: "Learning",
    loopIssue: "Customer Issue",
    loopRecall: "Hindsight Recall",
    loopRecommendation: "AI Recommendation",
    hindsightLearning: "Hindsight Learning",
    recommendationUsesMemories: (count) => `Recommendation informed by ${count} recalled Hindsight ${count === 1 ? "experience" : "experiences"}.`,
    recommendationNoMemories: "No similar memory was recalled; recommendation is based on the current issue.",
    experienceStored: "New experience stored in Hindsight Memory.",
    loopImproved: "Improved Action",
    issuePlaceholder: "e.g. My account was charged twice for the same order and I cannot reach anyone to get a refund...",
    actionPlaceholder: "Describe what action was taken to resolve the issue…",
    verifyPlaceholder: "How was the outcome verified? e.g. Customer confirmed the refund was received…",
    issueSubtitle: "Describe the problem in detail",
  },
  Telugu: {
    customerIssue: "కస్టమర్ సమస్య",
    analyzeIssue: "సమస్యను విశ్లేషించండి",
    analyzing: "విశ్లేషిస్తున్నాం & జ్ఞాపకాలు గుర్తిస్తున్నాం…",
    memoryRecall: "గత అనుభవాల గుర్తింపు",
    memorySubtitle: "సంబంధిత పాత అనుభవాలు తిరిగి పొందబడ్డాయి",
    aiRec: "AI సిఫార్సు",
    aiRecSubtitle: "సమస్య విశ్లేషణ + Hindsight జ్ఞాపకాల ఆధారంగా",
    recordOutcome: "ఫలితాన్ని నమోదు చేయండి",
    recordSubtitle: "ResolveIQ కి ఏం జరిగిందో నేర్పించండి",
    actionTaken: "తీసుకున్న చర్య",
    outcome: "ఫలితం",
    verificationResult: "ధృవీకరణ ఫలితం",
    relevantExp: "సంబంధిత అనుభవాలు",
    teachBtn: "ResolveIQ కి నేర్పించండి",
    teaching: "నమోదు చేస్తున్నాం & నేర్పిస్తున్నాం…",
    language: "భాష",
    whatHappened: "ఏం జరిగింది?",
    selectCategory: "సమస్య వర్గాన్ని ఎంచుకోండి",
    resolved: "పరిష్కరించబడింది",
    unresolved: "పరిష్కరించబడలేదు",
    memoriesRecalled: (n) => `${n} జ్ఞాపకాలు గుర్తించబడ్డాయి`,
    noMemory: "పాత అనుభవాలు లేవు — ఇది మొదటి జ్ఞాపకం అవుతుంది.",
    analyzeAnother: "మరొక సమస్యను విశ్లేషించండి",
    successTitle: "ResolveIQ ఈ ఫలితం నుండి నేర్చుకుంది.",
    successDesc: "ఈ అనుభవం Hindsight Memory లో నిల్వ చేయబడింది మరియు భవిష్యత్తు పరిష్కారాలను మెరుగుపరుస్తుంది.",
    analysisComplete: "విశ్లేషణ పూర్తయింది",
    fillAll: "ఫలితాన్ని నమోదు చేయడానికి ముందు అన్ని ఫీల్డ్‌లు పూరించండి.",
    loopAction: "చర్య",
    loopOutcome: "ఫలితం",
    loopLearning: "నేర్పు",
    loopIssue: "కస్టమర్ సమస్య",
    loopRecall: "Hindsight జ్ఞాపకాలు",
    loopRecommendation: "AI సిఫార్సు",
    hindsightLearning: "Hindsight అభ్యాసం",
    recommendationUsesMemories: (count) => `${count} గత అనుభవాల ఆధారంగా సిఫార్సు రూపొందించబడింది.`,
    recommendationNoMemories: "సారూప్య జ్ఞాపకం లభించలేదు; ప్రస్తుత సమస్య ఆధారంగా సిఫార్సు రూపొందించబడింది.",
    experienceStored: "కొత్త అనుభవం Hindsight Memoryలో నిల్వ చేయబడింది.",
    loopImproved: "మెరుగైన చర్య",
    issuePlaceholder: "ఉదా: నా ఖాతా నుండి రెండుసార్లు చార్జ్ చేయబడింది మరియు రిఫండ్ పొందలేకపోతున్నాను...",
    actionPlaceholder: "సమస్యను పరిష్కరించడానికి ఏ చర్య తీసుకున్నారో వివరించండి…",
    verifyPlaceholder: "ఫలితం ఎలా ధృవీకరించబడింది? ఉదా: కస్టమర్ రిఫండ్ అందిందని నిర్ధారించారు…",
    issueSubtitle: "సమస్యను వివరంగా వివరించండి",
  },
  Hindi: {
    customerIssue: "ग्राहक की समस्या",
    analyzeIssue: "समस्या का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है & यादें खोज रहे हैं…",
    memoryRecall: "पिछले अनुभव",
    memorySubtitle: "संबंधित पुराने अनुभव प्राप्त किए गए",
    aiRec: "AI सुझाव",
    aiRecSubtitle: "समस्या विश्लेषण + Hindsight यादों के आधार पर",
    recordOutcome: "परिणाम दर्ज करें",
    recordSubtitle: "ResolveIQ को सिखाएं क्या हुआ",
    actionTaken: "की गई कार्रवाई",
    outcome: "परिणाम",
    verificationResult: "सत्यापन परिणाम",
    relevantExp: "संबंधित अनुभव",
    teachBtn: "ResolveIQ को सिखाएं",
    teaching: "दर्ज किया जा रहा है & सिखाया जा रहा है…",
    language: "भाषा",
    whatHappened: "क्या हुआ?",
    selectCategory: "समस्या की श्रेणी चुनें",
    resolved: "हल किया गया",
    unresolved: "अनसुलझा",
    memoriesRecalled: (n) => `${n} यादें याद आईं`,
    noMemory: "कोई पुराना अनुभव नहीं — यह पहली याद होगी।",
    analyzeAnother: "एक और समस्या का विश्लेषण करें",
    successTitle: "ResolveIQ ने इस परिणाम से सीखा।",
    successDesc: "यह अनुभव Hindsight Memory में संग्रहीत किया गया है और भविष्य के समाधानों को बेहतर बनाएगा।",
    analysisComplete: "विश्लेषण पूर्ण",
    fillAll: "परिणाम दर्ज करने से पहले सभी फ़ील्ड भरें।",
    loopAction: "कार्रवाई",
    loopOutcome: "परिणाम",
    loopLearning: "सीखना",
    loopIssue: "ग्राहक की समस्या",
    loopRecall: "Hindsight स्मृति",
    loopRecommendation: "AI सुझाव",
    hindsightLearning: "Hindsight सीख",
    recommendationUsesMemories: (count) => `${count} पिछले अनुभवों के आधार पर सुझाव दिया गया।`,
    recommendationNoMemories: "समान स्मृति नहीं मिली; सुझाव वर्तमान समस्या पर आधारित है।",
    experienceStored: "नया अनुभव Hindsight Memory में संग्रहीत किया गया।",
    loopImproved: "बेहतर कार्रवाई",
    issuePlaceholder: "उदा: मेरे खाते से दो बार चार्ज किया गया और मुझे रिफंड नहीं मिल रहा...",
    actionPlaceholder: "समस्या हल करने के लिए क्या कार्रवाई की गई, विवरण दें…",
    verifyPlaceholder: "परिणाम की पुष्टि कैसे हुई? उदा: ग्राहक ने रिफंड प्राप्ति की पुष्टि की…",
    issueSubtitle: "समस्या को विस्तार से बताएं",
  },
  Kannada: {
    customerIssue: "ಗ್ರಾಹಕರ ಸಮಸ್ಯೆ",
    analyzeIssue: "ಸಮಸ್ಯೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ & ನೆನಪುಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ…",
    memoryRecall: "ಹಿಂದಿನ ಅನುಭವಗಳು",
    memorySubtitle: "ಸಂಬಂಧಿತ ಹಳೆಯ ಅನುಭವಗಳು ಮರುಪಡೆಯಲಾಗಿದೆ",
    aiRec: "AI ಶಿಫಾರಸು",
    aiRecSubtitle: "ಸಮಸ್ಯೆ ವಿಶ್ಲೇಷಣೆ + Hindsight ನೆನಪುಗಳ ಆಧಾರದ ಮೇಲೆ",
    recordOutcome: "ಫಲಿತಾಂಶವನ್ನು ದಾಖಲಿಸಿ",
    recordSubtitle: "ResolveIQ ಗೆ ಏನಾಯಿತೆಂದು ಕಲಿಸಿ",
    actionTaken: "ತೆಗೆದುಕೊಂಡ ಕ್ರಮ",
    outcome: "ಫಲಿತಾಂಶ",
    verificationResult: "ಪರಿಶೀಲನೆ ಫಲಿತಾಂಶ",
    relevantExp: "ಸಂಬಂಧಿತ ಅನುಭವಗಳು",
    teachBtn: "ResolveIQ ಗೆ ಕಲಿಸಿ",
    teaching: "ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ & ಕಲಿಸಲಾಗುತ್ತಿದೆ…",
    language: "ಭಾಷೆ",
    whatHappened: "ಏನಾಯಿತು?",
    selectCategory: "ಸಮಸ್ಯೆಯ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    unresolved: "ಪರಿಹರಿಸಲಾಗಿಲ್ಲ",
    memoriesRecalled: (n) => `${n} ನೆನಪುಗಳು ಮರುಪಡೆದಿವೆ`,
    noMemory: "ಹಳೆಯ ಅನುಭವಗಳು ಇಲ್ಲ — ಇದು ಮೊದಲ ನೆನಪು ಆಗುತ್ತದೆ.",
    analyzeAnother: "ಮತ್ತೊಂದು ಸಮಸ್ಯೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    successTitle: "ResolveIQ ಈ ಫಲಿತಾಂಶದಿಂದ ಕಲಿತಿದೆ.",
    successDesc: "ಈ ಅನುಭವವನ್ನು Hindsight Memory ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ ಮತ್ತು ಭವಿಷ್ಯದ ಪರಿಹಾರಗಳನ್ನು ಸುಧಾರಿಸುತ್ತದೆ.",
    analysisComplete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    fillAll: "ಫಲಿತಾಂಶ ದಾಖಲಿಸುವ ಮೊದಲು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ತುಂಬಿಸಿ.",
    loopAction: "ಕ್ರಮ",
    loopOutcome: "ಫಲಿತಾಂಶ",
    loopLearning: "ಕಲಿಕೆ",
    loopIssue: "ಗ್ರಾಹಕರ ಸಮಸ್ಯೆ",
    loopRecall: "Hindsight ನೆನಪುಗಳು",
    loopRecommendation: "AI ಶಿಫಾರಸು",
    hindsightLearning: "Hindsight ಕಲಿಕೆ",
    recommendationUsesMemories: (count) => `${count} ಹಿಂದಿನ ಅನುಭವಗಳ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`,
    recommendationNoMemories: "ಹೋಲುವ ನೆನಪು ಸಿಗಲಿಲ್ಲ; ಶಿಫಾರಸು ಪ್ರಸ್ತುತ ಸಮಸ್ಯೆಯನ್ನು ಆಧರಿಸಿದೆ.",
    experienceStored: "ಹೊಸ ಅನುಭವವನ್ನು Hindsight Memoryಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.",
    loopImproved: "ಸುಧಾರಿತ ಕ್ರಮ",
    issuePlaceholder: "ಉದಾ: ನನ್ನ ಖಾತೆಯಿಂದ ಎರಡು ಬಾರಿ ಶುಲ್ಕ ವಿಧಿಸಲಾಗಿದೆ ಮತ್ತು ಮರುಪಾವತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ...",
    actionPlaceholder: "ಸಮಸ್ಯೆ ಪರಿಹರಿಸಲು ತೆಗೆದುಕೊಂಡ ಕ್ರಮವನ್ನು ವಿವರಿಸಿ…",
    verifyPlaceholder: "ಫಲಿತಾಂಶ ಹೇಗೆ ಪರಿಶೀಲಿಸಲಾಯಿತು? ಉದಾ: ಗ್ರಾಹಕರು ಮರುಪಾವತಿ ಸ್ವೀಕರಿಸಿದ್ದಾರೆಂದು ದೃಢಪಡಿಸಿದರು…",
    issueSubtitle: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ",
  },
  Tamil: {
    customerIssue: "வாடிக்கையாளர் பிரச்சனை",
    analyzeIssue: "சிக்கலை பகுப்பாய்வு செய்யவும்",
    analyzing: "பகுப்பாய்வு செய்கிறோம் & நினைவுகளை தேடுகிறோம்…",
    memoryRecall: "முந்தைய அனுபவங்கள்",
    memorySubtitle: "தொடர்புடைய பழைய அனுபவங்கள் மீட்டெடுக்கப்பட்டன",
    aiRec: "AI பரிந்துரை",
    aiRecSubtitle: "சிக்கல் பகுப்பாய்வு + Hindsight நினைவுகளின் அடிப்படையில்",
    recordOutcome: "முடிவைப் பதிவு செய்யவும்",
    recordSubtitle: "ResolveIQ க்கு என்ன நடந்தது என்று கற்பிக்கவும்",
    actionTaken: "எடுக்கப்பட்ட நடவடிக்கை",
    outcome: "முடிவு",
    verificationResult: "சரிபார்ப்பு முடிவு",
    relevantExp: "தொடர்புடைய அனுபவங்கள்",
    teachBtn: "ResolveIQ கற்றுக்கொள்ளச் செய்யவும்",
    teaching: "பதிவு செய்கிறோம் & கற்பிக்கிறோம்…",
    language: "மொழி",
    whatHappened: "என்ன நடந்தது?",
    selectCategory: "சிக்கல் வகையைத் தேர்ந்தெடுக்கவும்",
    resolved: "தீர்க்கப்பட்டது",
    unresolved: "தீர்க்கப்படவில்லை",
    memoriesRecalled: (n) => `${n} நினைவுகள் மீட்டெடுக்கப்பட்டன`,
    noMemory: "பழைய அனுபவங்கள் இல்லை — இது முதல் நினைவாக இருக்கும்.",
    analyzeAnother: "மற்றொரு சிக்கலை பகுப்பாய்வு செய்யவும்",
    successTitle: "ResolveIQ இந்த முடிவிலிருந்து கற்றுக்கொண்டது.",
    successDesc: "இந்த அனுபவம் Hindsight Memory இல் சேமிக்கப்பட்டது மற்றும் எதிர்கால தீர்வுகளை மேம்படுத்தும்.",
    analysisComplete: "பகுப்பாய்வு முடிந்தது",
    fillAll: "முடிவைப் பதிவு செய்வதற்கு முன் அனைத்து புலங்களையும் நிரப்பவும்.",
    loopAction: "நடவடிக்கை",
    loopOutcome: "முடிவு",
    loopLearning: "கற்றல்",
    loopIssue: "வாடிக்கையாளர் பிரச்சனை",
    loopRecall: "Hindsight நினைவுகள்",
    loopRecommendation: "AI பரிந்துரை",
    hindsightLearning: "Hindsight கற்றல்",
    recommendationUsesMemories: (count) => `${count} முந்தைய அனுபவங்களின் அடிப்படையில் பரிந்துரை உருவாக்கப்பட்டது.`,
    recommendationNoMemories: "ஒத்த நினைவு கிடைக்கவில்லை; தற்போதைய பிரச்சனையின் அடிப்படையில் பரிந்துரை உருவாக்கப்பட்டது.",
    experienceStored: "புதிய அனுபவம் Hindsight Memory-யில் சேமிக்கப்பட்டது.",
    loopImproved: "மேம்பட்ட நடவடிக்கை",
    issuePlaceholder: "எ.கா: என் கணக்கிலிருந்து இரண்டு முறை கட்டணம் வசூலிக்கப்பட்டது மற்றும் பணத்தை திரும்ப பெற முடியவில்லை...",
    actionPlaceholder: "சிக்கலை தீர்க்க எடுக்கப்பட்ட நடவடிக்கையை விவரிக்கவும்…",
    verifyPlaceholder: "முடிவு எவ்வாறு சரிபார்க்கப்பட்டது? எ.கா: வாடிக்கையாளர் பணம் திரும்பியதை உறுதிப்படுத்தினார்…",
    issueSubtitle: "சிக்கலை விரிவாக விவரிக்கவும்",
  },
}

// ─── Quick Categories ────────────────────────────────────────────
const CATEGORIES = [
  { icon: "📦", key: "delivery" },
  { icon: "💳", key: "payment" },
  { icon: "🔧", key: "product" },
  { icon: "🔄", key: "refund" },
  { icon: "📱", key: "account" },
  { icon: "💬", key: "other" },
]

const CAT_LABELS = {
  English: { delivery: "Delivery", payment: "Payment", product: "Product Problem", refund: "Refund", account: "Account", other: "Other" },
  Telugu: { delivery: "డెలివరీ", payment: "చెల్లింపు", product: "ఉత్పత్తి సమస్య", refund: "రిఫండ్", account: "ఖాతా", other: "ఇతర" },
  Hindi: { delivery: "डिलीवरी", payment: "भुगतान", product: "उत्पाद समस्या", refund: "रिफंड", account: "खाता", other: "अन्य" },
  Kannada: { delivery: "ವಿತರಣೆ", payment: "ಪಾವತಿ", product: "ಉತ್ಪನ್ನದ ಸಮಸ್ಯೆ", refund: "ಮರುಪಾವತಿ", account: "ಖಾತೆ", other: "ಇತರೆ" },
  Tamil: { delivery: "டெலிவரி", payment: "கட்டணம்", product: "தயாரிப்பு பிரச்சனை", refund: "பணத்தைத் திரும்பப் பெறுதல்", account: "கணக்கு", other: "மற்றவை" },
}

// Issue starters for each category (English - backend understands English)
const ISSUE_STARTERS = {
  delivery: "My order has not been delivered yet and the tracking shows no updates. I placed the order on ",
  payment: "I was charged an incorrect amount for my recent purchase. The charge on my account is ",
  product: "The product I received is defective / not working as expected. The issue is: ",
  refund: "I requested a refund for my order but have not received it yet. My order number is ",
  account: "I am having trouble accessing my account. I cannot log in and ",
  other: "I need help with the following issue: ",
}

function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="markdown-table-wrap"><table>{children}</table></div>
          ),
          pre: ({ children }) => <pre className="markdown-code-block">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// ─── Language Selector ────────────────────────────────────────────
function LanguageSelector({ lang, setLang, t, disabled }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lang-selector-wrap">
      <Globe size={14} className="lang-icon" />
      <span className="lang-label-text">{t.language}:</span>
      <div className="lang-dropdown-wrap">
        <button
          className="lang-btn"
          onClick={() => setOpen(o => !o)}
          disabled={disabled}
          type="button"
        >
          {LANG_LABELS[lang]}
          <ChevronDown size={13} className={`lang-chevron ${open ? "open" : ""}`} />
        </button>
        {open && (
          <div className="lang-menu">
            {Object.keys(LANG_KEYS).map(key => (
              <button
                key={key}
                className={`lang-menu-item ${lang === key ? "active" : ""}`}
                onClick={() => { setLang(key); setOpen(false) }}
                disabled={disabled}
                type="button"
              >
                {LANG_LABELS[key]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Category Chips ───────────────────────────────────────────────
function CategoryChips({ lang, onSelect, t, disabled }) {
  const labels = CAT_LABELS[lang]
  return (
    <div className="cat-wrap">
      <div className="cat-label">{t.selectCategory}</div>
      <div className="cat-chips">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className="cat-chip"
            onClick={() => onSelect(ISSUE_STARTERS[cat.key])}
            disabled={disabled}
            type="button"
          >
            <span className="cat-chip-icon">{cat.icon}</span>
            <span className="cat-chip-text">{labels[cat.key]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────
function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">R</div>
        <div className="header-text">
          <div className="header-title">ResolveIQ</div>
          <div className="header-subtitle">AI Support Agent</div>
        </div>
      </div>
      <div className="status-badge">
        <span className="status-dot" />
        Hindsight Memory Active
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge">
        <Sparkles size={12} />
        Powered by Hindsight Memory
      </div>
      <h1>Support that learns from<br />every outcome.</h1>
      <p>
        ResolveIQ remembers every previous support experience and uses that
        knowledge to deliver smarter, faster resolutions — improving with
        every interaction.
      </p>
    </section>
  )
}

// ─── Issue Section ────────────────────────────────────────────────
function IssueSection({ issue, setIssue, onAnalyze, loading, lang, setLang, t }) {
  return (
    <div className="card fade-up">
      <div className="card-header-row">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-icon accent"><MessageSquare size={18} /></div>
          <div>
            <div className="card-title">{t.customerIssue}</div>
            <div className="card-subtitle">{t.issueSubtitle}</div>
          </div>
        </div>
        <LanguageSelector lang={lang} setLang={setLang} t={t} disabled={loading} />
      </div>

      <CategoryChips lang={lang} onSelect={text => setIssue(text)} t={t} disabled={loading} />

      <textarea
        className="issue-textarea"
        placeholder={t.issuePlaceholder}
        value={issue}
        onChange={e => setIssue(e.target.value)}
        disabled={loading}
        lang={lang === "English" ? "en" : lang === "Telugu" ? "te" : lang === "Hindi" ? "hi" : lang === "Kannada" ? "kn" : "ta"}
      />
      <button
        className="btn btn-primary btn-full"
        onClick={onAnalyze}
        disabled={loading || !issue.trim()}
      >
        {loading ? (
          <>
            <span className="spinner" />
            {t.analyzing}
          </>
        ) : (
          <>
            <Brain size={17} />
            {t.analyzeIssue}
          </>
        )}
      </button>
    </div>
  )
}

// ─── Memory Section ───────────────────────────────────────────────
function MemorySection({ memories, recalledCount, t }) {
  const count = recalledCount ?? (memories ? memories.length : 0)
  return (
    <div className="card fade-up">
      <div className="memory-header-row">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-icon purple"><Brain size={18} /></div>
          <div>
            <div className="card-title">{t.memoryRecall}</div>
            <div className="card-subtitle">{t.memorySubtitle}</div>
          </div>
        </div>
        <div className="memory-count-badge">
          <Brain size={12} />
          {t.memoriesRecalled(count)}
        </div>
      </div>

      {count === 0 ? (
        <div className="no-memory">
          <Brain size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
          {t.noMemory}
        </div>
      ) : (
        <div className="memory-timeline">
          {memories.map((mem, i) => (
            <div className="memory-item" key={i}>
              <div className="memory-dot-col">
                <div className="memory-dot">{i + 1}</div>
              </div>
              <div className="memory-card">
                <div className="memory-card-text">
                  {mem.content || mem.text || mem.memory || JSON.stringify(mem)}
                </div>
                <div className="memory-card-meta">
                  {mem.outcome && (
                    <span className={`memory-tag ${mem.outcome.toLowerCase().includes("resolv") ? "resolved" : "unresolved"}`}>
                      {mem.outcome.toLowerCase().includes("resolv") ? "✓" : "✗"} {mem.outcome}
                    </span>
                  )}
                  {mem.similarity != null && (
                    <span className="memory-tag similarity">{(mem.similarity * 100).toFixed(0)}% match</span>
                  )}
                  {mem.score != null && (
                    <span className="memory-tag similarity">{(mem.score * 100).toFixed(0)}% match</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Recommendation ───────────────────────────────────────────────
function RecommendationSection({ recommendation, memoryCount, t }) {
  const content = typeof recommendation === "string"
    ? recommendation
    : recommendation?.recommendation || recommendation?.content || ""
  return (
    <div className="card fade-up">
      <div className="card-header">
        <div className="card-icon amber"><Lightbulb size={18} /></div>
        <div>
          <div className="card-title">{t.aiRec}</div>
          <div className="card-subtitle">
            {memoryCount > 0 ? t.recommendationUsesMemories(memoryCount) : t.recommendationNoMemories}
          </div>
        </div>
      </div>
      <div className="recommendation-content">
        <MarkdownContent content={content} />
      </div>
    </div>
  )
}

// ─── Outcome Section ──────────────────────────────────────────────
function OutcomeSection({ issue, onSuccess, t }) {
  const [actionTaken, setActionTaken] = useState("")
  const [outcome, setOutcome] = useState("")
  const [verificationResult, setVerification] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRecord = async () => {
    if (loading) return
    if (!actionTaken.trim() || !outcome || !verificationResult.trim()) {
      setError(t.fillAll)
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_issue: issue,
          action_taken: actionTaken.trim(),
          outcome,
          verification_result: verificationResult.trim(),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      const responseData = await res.json()
      if (!responseData.success) {
        throw new Error(responseData.message || "ResolveIQ could not store this outcome in Hindsight Memory.")
      }
      onSuccess({ actionTaken: actionTaken.trim(), outcome, retention: responseData })
    } catch (e) {
      setError(e.message || "Failed to record outcome. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card fade-up">
      <div className="card-header">
        <div className="card-icon green"><CheckCircle2 size={18} /></div>
        <div>
          <div className="card-title">{t.recordOutcome}</div>
          <div className="card-subtitle">{t.recordSubtitle}</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t.actionTaken}</label>
        <textarea
          className="form-textarea"
          placeholder={t.actionPlaceholder}
          value={actionTaken}
          onChange={e => setActionTaken(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t.outcome}</label>
        <div className="outcome-selector">
          <button
            className={`outcome-option ${outcome === "Resolved" ? "selected resolved" : ""}`}
            onClick={() => !loading && setOutcome("Resolved")}
            disabled={loading}
            type="button"
            aria-pressed={outcome === "Resolved"}
          >
            <span className="outcome-icon">✓</span>
            {t.resolved}
          </button>
          <button
            className={`outcome-option ${outcome === "Unresolved" ? "selected unresolved" : ""}`}
            onClick={() => !loading && setOutcome("Unresolved")}
            disabled={loading}
            type="button"
            aria-pressed={outcome === "Unresolved"}
          >
            <span className="outcome-icon">✗</span>
            {t.unresolved}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t.verificationResult}</label>
        <textarea
          className="form-textarea"
          placeholder={t.verifyPlaceholder}
          value={verificationResult}
          onChange={e => setVerification(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          {error}
        </div>
      )}

      <button
        className="btn btn-success btn-full"
        onClick={handleRecord}
        disabled={loading || !actionTaken.trim() || !outcome || !verificationResult.trim()}
      >
        {loading ? (
          <>
            <span className="spinner" />
            {t.teaching}
          </>
        ) : (
          <>
            <Brain size={17} />
            {t.teachBtn}
          </>
        )}
      </button>
    </div>
  )
}

// ─── Success State ─────────────────────────────────────────────────
function SuccessState({ onReset, recordedOutcome, issue, recalledMemoryCount, t }) {
  const steps = [
    { label: t.loopIssue, icon: <MessageSquare size={19} />, tone: "blue", detail: issue },
    { label: t.loopRecall, icon: <Brain size={19} />, tone: "purple", detail: t.memoriesRecalled(recalledMemoryCount) },
    {
      label: t.loopRecommendation,
      icon: <Lightbulb size={19} />,
      tone: "amber",
      detail: recalledMemoryCount > 0 ? t.recommendationUsesMemories(recalledMemoryCount) : t.recommendationNoMemories,
    },
    {
      label: t.loopOutcome,
      icon: <CheckCircle2 size={19} />,
      tone: "green",
      detail: <><strong>{recordedOutcome.outcome}</strong><span>{recordedOutcome.actionTaken}</span></>,
    },
    { label: t.hindsightLearning, icon: <Brain size={19} />, tone: "purple", detail: t.experienceStored },
  ]

  return (
    <div className="success-card fade-up">
      <div className="success-icon">🧠</div>
      <div className="success-title">{t.successTitle}</div>
      <div className="success-desc">{t.successDesc}</div>

      <div className="learning-loop" aria-label={`${t.loopIssue} to ${t.hindsightLearning}`}>
        {steps.map(step => (
          <div className="loop-step" key={step.label}>
            <div className={`loop-step-icon ${step.tone}`}>{step.icon}</div>
            <div className="loop-step-label">{step.label}</div>
            <div className="loop-step-detail">{step.detail}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-reset" onClick={onReset} style={{ marginTop: 24 }}>
        <RotateCcw size={15} />
        {t.analyzeAnother}
      </button>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("English")
  const [issue, setIssue] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setError] = useState("")
  const [result, setResult] = useState(null)
  const [success, setSuccess] = useState(false)
  const [recordedOutcome, setRecordedOutcome] = useState(null)

  const t = T[lang]

  const handleAnalyze = async () => {
    if (!issue.trim() || analyzing) return
    setAnalyzing(true)
    setError("")
    setResult(null)
    setSuccess(false)
    setRecordedOutcome(null)
    setRecordedOutcome(null)

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_issue: issue.trim(),
          language: LANG_KEYS[lang],
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || "Failed to analyze the issue. Is the backend running?")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setIssue("")
    setResult(null)
    setSuccess(false)
    setError("")
    setRecordedOutcome(null)
  }

  const memories = result?.recalled_memories || result?.memories || result?.hindsight_memories || result?.relevant_memories || []
  const recalledMemoryCount = result?.recalled_memories_count ?? memories.length
  const recommendation = result?.recommendation || result?.agent_response || result

  return (
    <div className="app-wrapper">
      <Header />
      <Hero />

      <IssueSection
        issue={issue}
        setIssue={setIssue}
        onAnalyze={handleAnalyze}
        loading={analyzing}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      {analyzeError && (
        <div className="error-banner fade-up" role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          {analyzeError}
        </div>
      )}

      {result && !success && (
        <>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-text">{t.analysisComplete}</div>
            <div className="section-divider-line" />
          </div>

          <MemorySection memories={memories} recalledCount={recalledMemoryCount} t={t} />
          <RecommendationSection recommendation={recommendation} memoryCount={recalledMemoryCount} t={t} />
          <OutcomeSection
            issue={issue}
            onSuccess={outcome => { setRecordedOutcome(outcome); setSuccess(true) }}
            t={t}
          />
        </>
      )}

      {success && (
        <SuccessState
          onReset={handleReset}
          recordedOutcome={recordedOutcome}
          issue={issue}
          recalledMemoryCount={recalledMemoryCount}
          t={t}
        />
      )}
    </div>
  )
}
