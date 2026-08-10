import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App lazily to avoid duplicate initializations
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const GOOGLE_FORMS_SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

const provider = new GoogleAuthProvider();
GOOGLE_FORMS_SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Google Provider');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      console.info('Google sign-in popup was closed by user.');
      return null;
    }
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface GoogleFormDetails {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle?: string;
  };
  responderUri: string;
  revisionId?: string;
}

export interface GoogleFormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers?: Record<string, { textAnswers?: { answers: { value: string }[] } }>;
}

export const createAdmissionGoogleForm = async (
  accessToken: string,
  title: string = 'V.S.R.P.T Admissions & Demo Enquiry Form'
): Promise<GoogleFormDetails> => {
  // 1. Create the blank form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: title,
        documentTitle: title,
      },
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create form (${createRes.status})`);
  }

  const formData: GoogleFormDetails = await createRes.json();
  const formId = formData.formId;

  // 2. Add question items via batchUpdate
  const batchRequests = {
    requests: [
      {
        createItem: {
          item: {
            title: 'Student Full Name',
            description: 'Enter the student full name',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Parent / Guardian Name',
            description: 'Enter parent or guardian name',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 1 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Contact Phone Number',
            description: 'Provide a 10-digit phone number with WhatsApp access',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 2 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Email Address',
            description: 'Email for sending demo schedules & fee structures',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 3 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Current Academic Class / Standard',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Class 11th' },
                    { value: 'Class 12th' },
                    { value: 'Repeater / Dropper Batch' },
                    { value: 'Foundation (8th - 10th)' },
                  ],
                },
              },
            },
          },
          location: { index: 4 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Target Course / Exam Program',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'NEET Physics Elite' },
                    { value: 'JEE Main + Advanced Physics' },
                    { value: 'MHT-CET Physics Speed' },
                    { value: 'XI + XII Board Mastery' },
                  ],
                },
              },
            },
          },
          location: { index: 5 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Preferred Learning Mode',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Offline at Kothrud Depot, Pune' },
                    { value: 'Online Live Interactive' },
                  ],
                },
              },
            },
          },
          location: { index: 6 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Student Questions / Message',
            description: 'Any specific concepts or topics you want guidance on?',
            questionItem: {
              question: {
                required: false,
                textQuestion: { paragraph: true },
              },
            },
          },
          location: { index: 7 },
        },
      },
    ],
  };

  const batchRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchRequests),
  });

  if (!batchRes.ok) {
    console.warn('Batch update notice:', await batchRes.text());
  }

  // Fetch updated form info
  return fetchFormDetails(formId, accessToken);
};

export const fetchFormDetails = async (
  formId: string,
  accessToken: string
): Promise<GoogleFormDetails> => {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch form details (${res.status})`);
  }
  return res.json();
};

export const fetchFormResponses = async (
  formId: string,
  accessToken: string
): Promise<GoogleFormResponse[]> => {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch form responses (${res.status})`);
  }
  const data = await res.json();
  return data.responses || [];
};
