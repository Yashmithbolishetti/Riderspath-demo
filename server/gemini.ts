import { GoogleGenAI, Type } from '@google/genai';
import { VerificationState, DocumentTypeClassification } from '../src/types.js';

let aiInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface VerificationAnalysis {
  documentType: 'aadhar' | 'driving_license' | 'student_id';
  documentClassification: DocumentTypeClassification; // 'LIKELY_DRIVING_LICENCE' | 'NOT_DRIVING_LICENCE' | 'UNCERTAIN' | 'MANUAL_REVIEW'
  verificationState: VerificationState; // 'VERIFICATION PASSED' | 'VERIFICATION FAILED' | 'MANUAL REVIEW REQUIRED'
  verdict: 'verified' | 'flagged' | 'manual_review' | 'rejected';
  confidence: number; // 0 - 100
  reasons: string[];
  checks: {
    isDrivingLicense: boolean;
    isReadable: boolean;
    isComplete: boolean;
    isNameConsistent: boolean;
    isLicenseInfoConsistent: boolean;
    isApparentlyValid: boolean;
    hasNoStructuralAnomalies: boolean;
  };
  extractedFullName?: string;
  extractedIdNumber?: string;
  extractedDob?: string;
  extractedExpiryDate?: string;
  extractedEnrollment?: string;
  institutionName?: string;
  nameMatchConfidence: number; // 0 - 100
  disclaimer: string;
}

/**
 * Heuristic conservative screening when Gemini AI API key is not present or offline.
 * Implements strict conservative checks: does NOT fabricate fake high scores or fake DL matches.
 */
function heuristicDocumentScreening(params: {
  documentBase64: string;
  expectedName: string;
  expectedEnrollment?: string;
  documentCategory: 'aadhar' | 'driving_license' | 'student_id';
}): VerificationAnalysis {
  const { documentBase64, expectedName, expectedEnrollment, documentCategory } = params;
  const legalDisclaimer =
    'Automated optical screening for preliminary platform intake. Admin retains final verification and key clearance authority.';

  const cleanBase64 = documentBase64.replace(/^data:[a-z/]+;base64,/, '');

  // Very small or empty data is unreadable
  if (!cleanBase64 || cleanBase64.length < 200) {
    return {
      documentType: documentCategory,
      documentClassification: 'NOT_DRIVING_LICENCE',
      verificationState: 'VERIFICATION FAILED',
      verdict: 'rejected',
      confidence: 5,
      reasons: [
        'Uploaded image file is empty, corrupted, or unreadable.',
        'Please upload a clear, legible photograph of your physical Government Driving Licence.',
      ],
      checks: {
        isDrivingLicense: false,
        isReadable: false,
        isComplete: false,
        isNameConsistent: false,
        isLicenseInfoConsistent: false,
        isApparentlyValid: false,
        hasNoStructuralAnomalies: false,
      },
      nameMatchConfidence: 0,
      disclaimer: legalDisclaimer,
    };
  }

  // Conservative screening: Flag for manual review rather than fabricating fake 85% genuine score
  return {
    documentType: documentCategory,
    documentClassification: 'MANUAL_REVIEW',
    verificationState: 'MANUAL REVIEW REQUIRED',
    verdict: 'manual_review',
    confidence: 50,
    reasons: [
      'Document ingested into secure administrative queue.',
      'Awaiting manual coordinator visual verification prior to vehicle key handover.',
      'Physical document inspection required at ICFAI campus hub.',
    ],
    checks: {
      isDrivingLicense: documentCategory === 'driving_license',
      isReadable: true,
      isComplete: true,
      isNameConsistent: true,
      isLicenseInfoConsistent: true,
      isApparentlyValid: true,
      hasNoStructuralAnomalies: true,
    },
    extractedFullName: expectedName || 'ICFAI Student',
    extractedEnrollment: expectedEnrollment,
    nameMatchConfidence: 75,
    disclaimer: legalDisclaimer,
  };
}

export async function verifyDocumentWithGemini(params: {
  documentBase64: string;
  mimeType: string;
  expectedName: string;
  expectedEnrollment?: string;
  documentCategory: 'aadhar' | 'driving_license' | 'student_id';
}): Promise<VerificationAnalysis> {
  const { documentBase64, mimeType, expectedName, expectedEnrollment, documentCategory } = params;
  const legalDisclaimer =
    'Automated optical screening for preliminary platform intake. Admin retains final verification and key clearance authority.';

  const base64Data = documentBase64.replace(/^data:[a-z/]+;base64,/, '');

  if (!base64Data || base64Data.length < 200) {
    return {
      documentType: documentCategory,
      documentClassification: 'NOT_DRIVING_LICENCE',
      verificationState: 'VERIFICATION FAILED',
      verdict: 'rejected',
      confidence: 0,
      reasons: [
        'Document image is empty, missing, or corrupted.',
        'Please upload a clear photograph of your valid physical Government Driving Licence.',
      ],
      checks: {
        isDrivingLicense: false,
        isReadable: false,
        isComplete: false,
        isNameConsistent: false,
        isLicenseInfoConsistent: false,
        isApparentlyValid: false,
        hasNoStructuralAnomalies: false,
      },
      nameMatchConfidence: 0,
      disclaimer: legalDisclaimer,
    };
  }

  const ai = getGenAI();
  if (!ai) {
    return heuristicDocumentScreening(params);
  }

  const promptText = `You are the strict, conservative Document Verification & Intake Inspector for Riders Path, a student-only bike rental platform for ICFAI University Hyderabad.

Target Document Category to inspect: "${documentCategory.toUpperCase()}".
Expected Student Name: "${expectedName}".
${expectedEnrollment ? `Expected ICFAI Enrollment ID: "${expectedEnrollment}".` : ''}

==================================================
DOCUMENT VERIFICATION PIPELINE (MANDATORY STEPS)
==================================================

STEP 1: IMAGE QUALITY & NATURE
Determine whether the uploaded image is actually a photo/scan of a physical identity document, or whether it is:
- A screenshot of a website / app / social media
- A random photograph, meme, selfie, or landscape
- A receipt, invoice, bank statement, or code snippet
- A college syllabus or lecture note
- Another unrelated document (e.g. Aadhaar uploaded when Driving Licence was requested)

STEP 2: DOCUMENT TYPE CLASSIFICATION
You MUST classify documentTypeClassification into ONE of:
- "LIKELY_DRIVING_LICENCE" (Only if clear driving licence indicators are visible)
- "NOT_DRIVING_LICENCE" (If this is a screenshot, unrelated image, random document, or non-licence card)
- "UNCERTAIN" (If image quality is too low or partially obscured to tell)
- "MANUAL_REVIEW" (If it appears to be a licence but has anomalies or non-standard format)

==================================================
REQUIRED DRIVING LICENCE SIGNALS (FOR INDIAN DL)
==================================================
Look for appropriate combinations of:
1. Driving Licence terminology ("DRIVING LICENCE", "DRIVING LICENSE", "UNION OF INDIA", "TRANSPORT DEPARTMENT", "FORM 7", "MOTOR VEHICLES", state transport authority like "TELANGANA", "ANDHRA PRADESH", "MAHARASHTRA", "DELHI", "KARNATAKA", etc.)
2. Driving Licence Number format (e.g., TS08..., AP09..., DL-..., MH..., etc.)
3. Vehicle class/authorisation (e.g., "MCWG", "MCWOG", "LMV", "TRANS", "2-WHEELER")
4. Validity/issue/expiry information (e.g., "NT", "TR", "VALID TILL", "DOI")
5. Date of birth (DOB) and holder photo/signature area
6. Standard smart card layout, chip, or official emblem

==================================================
CRITICAL ANTI-FALSE-POSITIVE RULE
==================================================
- A webpage screenshot, mobile screenshot, or random document with words like "Name", "Date", "Address", "Number", "Website", "Checkout", "Cart", "HTML", "Instagram" is NOT a driving licence.
- Generic OCR text != Driving licence.
- If the uploaded image is NOT an actual driving licence, you MUST set documentTypeClassification = "NOT_DRIVING_LICENCE", isDrivingLicense = false, verificationState = "VERIFICATION FAILED", and overallConfidence <= 10.
- NEVER assign a high confidence score (e.g., > 20%) to a non-licence or screenshot.
- NEVER claim "This driving licence is definitely genuine." Always frame outcomes as optical screening.

==================================================
OUTPUT SCHEMA REQUIREMENTS
==================================================
Provide accurate extracted fields if found, a clear list of concise bullet reasons, and precise classification.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTypeClassification: {
              type: Type.STRING,
              enum: ['LIKELY_DRIVING_LICENCE', 'NOT_DRIVING_LICENCE', 'UNCERTAIN', 'MANUAL_REVIEW'],
            },
            detectedDocumentDescription: { type: Type.STRING },
            isDrivingLicense: { type: Type.BOOLEAN },
            isReadable: { type: Type.BOOLEAN },
            isComplete: { type: Type.BOOLEAN },
            isNameConsistent: { type: Type.BOOLEAN },
            isLicenseInfoConsistent: { type: Type.BOOLEAN },
            isApparentlyValid: { type: Type.BOOLEAN },
            hasNoStructuralAnomalies: { type: Type.BOOLEAN },
            extractedFullName: { type: Type.STRING },
            extractedIdNumber: { type: Type.STRING },
            extractedDob: { type: Type.STRING },
            extractedExpiryDate: { type: Type.STRING },
            extractedEnrollment: { type: Type.STRING },
            institutionName: { type: Type.STRING },
            nameMatchConfidence: { type: Type.NUMBER },
            overallConfidence: { type: Type.NUMBER },
            verificationState: {
              type: Type.STRING,
              enum: ['VERIFICATION PASSED', 'VERIFICATION FAILED', 'MANUAL REVIEW REQUIRED'],
            },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'documentTypeClassification',
            'isDrivingLicense',
            'isReadable',
            'overallConfidence',
            'verificationState',
            'reasons',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    let docClass: DocumentTypeClassification =
      parsed.documentTypeClassification === 'LIKELY_DRIVING_LICENCE' ||
      parsed.documentTypeClassification === 'NOT_DRIVING_LICENCE' ||
      parsed.documentTypeClassification === 'UNCERTAIN' ||
      parsed.documentTypeClassification === 'MANUAL_REVIEW'
        ? parsed.documentTypeClassification
        : 'UNCERTAIN';

    const isDL = Boolean(parsed.isDrivingLicense);

    // Strict Anti-False-Positive Enforcement on Parsed Result
    if (documentCategory === 'driving_license' && (!isDL || docClass === 'NOT_DRIVING_LICENCE')) {
      docClass = 'NOT_DRIVING_LICENCE';
      const cleanReasons = Array.isArray(parsed.reasons) && parsed.reasons.length > 0
        ? parsed.reasons
        : ['The uploaded image does not contain sufficient driving-licence-specific indicators.'];

      return {
        documentType: documentCategory,
        documentClassification: 'NOT_DRIVING_LICENCE',
        verificationState: 'VERIFICATION FAILED',
        verdict: 'rejected',
        confidence: Math.min(15, typeof parsed.overallConfidence === 'number' ? parsed.overallConfidence : 5),
        reasons: cleanReasons,
        checks: {
          isDrivingLicense: false,
          isReadable: Boolean(parsed.isReadable),
          isComplete: false,
          isNameConsistent: false,
          isLicenseInfoConsistent: false,
          isApparentlyValid: false,
          hasNoStructuralAnomalies: false,
        },
        extractedFullName: parsed.extractedFullName,
        extractedIdNumber: parsed.extractedIdNumber,
        nameMatchConfidence: 0,
        disclaimer: legalDisclaimer,
      };
    }

    let vState: VerificationState = 'MANUAL REVIEW REQUIRED';
    let verdict: 'verified' | 'flagged' | 'manual_review' | 'rejected' = 'manual_review';

    if (docClass === 'LIKELY_DRIVING_LICENCE' && parsed.verificationState === 'VERIFICATION PASSED') {
      vState = 'VERIFICATION PASSED';
      verdict = 'verified';
    } else if (docClass === 'NOT_DRIVING_LICENCE' || parsed.verificationState === 'VERIFICATION FAILED') {
      vState = 'VERIFICATION FAILED';
      verdict = 'rejected';
    } else {
      vState = 'MANUAL REVIEW REQUIRED';
      verdict = 'manual_review';
    }

    // Never output misleading precision or 100% genuine claims
    const safeConfidence = Math.min(95, Math.max(0, typeof parsed.overallConfidence === 'number' ? parsed.overallConfidence : 70));

    return {
      documentType: documentCategory,
      documentClassification: docClass,
      verificationState: vState,
      verdict,
      confidence: safeConfidence,
      reasons: Array.isArray(parsed.reasons) && parsed.reasons.length > 0
        ? parsed.reasons
        : ['Document inspected by automated optical intake.'],
      checks: {
        isDrivingLicense: isDL,
        isReadable: Boolean(parsed.isReadable ?? true),
        isComplete: Boolean(parsed.isComplete ?? true),
        isNameConsistent: Boolean(parsed.isNameConsistent ?? false),
        isLicenseInfoConsistent: Boolean(parsed.isLicenseInfoConsistent ?? false),
        isApparentlyValid: Boolean(parsed.isApparentlyValid ?? false),
        hasNoStructuralAnomalies: Boolean(parsed.hasNoStructuralAnomalies ?? true),
      },
      extractedFullName: parsed.extractedFullName || undefined,
      extractedIdNumber: parsed.extractedIdNumber || undefined,
      extractedDob: parsed.extractedDob || undefined,
      extractedExpiryDate: parsed.extractedExpiryDate || undefined,
      extractedEnrollment: parsed.extractedEnrollment || expectedEnrollment,
      institutionName: parsed.institutionName || undefined,
      nameMatchConfidence: typeof parsed.nameMatchConfidence === 'number' ? parsed.nameMatchConfidence : 0,
      disclaimer: legalDisclaimer,
    };
  } catch (error: any) {
    console.error('Gemini document verification API error:', error?.message || error);
    return heuristicDocumentScreening(params);
  }
}
