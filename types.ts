export enum View {
  Dashboard = 'DASHBOARD',
  Scan = 'SCAN',
  Updates = 'UPDATES',
  History = 'HISTORY',
  Settings = 'SETTINGS',
}

export enum ScanType {
  Quick = 'Quick Scan',
  Full = 'Full System Scan',
  Custom = 'Custom Scan',
}

export interface Threat {
  id: string;
  filePath: string;
  threatName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ScanState {
  status: 'idle' | 'scanning' | 'complete';
  progress: number;
  filesScanned: number;
  threatsFound: number;
  currentFile: string;
  elapsedTime: number; // in seconds
  scanType?: ScanType;
  results: Threat[];
}

// --- New Types for Auth ---

export enum AuthStatus {
    Loading = 'LOADING',
    LoggedIn = 'LOGGED_IN',
    LoggedOut = 'LOGGED_OUT',
}

export enum LicenseStatus {
    Missing = 'missing',
    Trial = 'trial',
    Active = 'active',
    TrialExpired = 'trial_expired',
    Expired = 'expired',
    Blocked = 'blocked'
}

export interface License {
    status: LicenseStatus;
    expires: string; // ISO-date string
    seats: number;
}
