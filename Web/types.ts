export type RecyclableStatus = 'Yes' | 'No' | 'Conditional';
// Fix: Moved Theme type here from App.tsx to serve as the single source of truth and resolve export errors.
export type Theme = 'default' | 'ocean' | 'sunset' | 'dark';
export type Language = 'vi' | 'en';

export interface WasteInfo {
  wasteType: string;
  material: string;
  recyclable: RecyclableStatus;
  disposalInstructions: string;
  funFact: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  itemName: string;
  imageUrl?: string; // The base64 image string, now optional
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type DeviceType = 'phone' | 'computer';

// New types for setup and settings
export type Salutation = 'Anh' | 'Chị' | 'Bạn' | 'Mr' | 'Ms' | 'Friend';
export type Gender = 'Nam' | 'Nữ' | 'Khác' | 'Male' | 'Female' | 'Other';


export interface UserProfile {
  name: string;
  deviceType: DeviceType | null;
  gender: Gender | null;
  dob: string;
  salutation: Salutation | null;
  setupComplete: boolean;
}

export interface AppSettings {
    theme: Theme;
    language: Language;
    autoScanInterval: number; // in milliseconds
    expertMode: boolean;
    enableReminder: boolean;
    reminderTime: string; // e.g., "09:00"
    soundEffects: boolean;
}

export interface Feedback {
  timestamp: string;
  reportedItem: WasteInfo;
  feedbackType: string[];
  comments: string;
}