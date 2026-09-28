export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';
export type ProfileStatus = 'ACTIVE' | 'INACTIVE';
export type ConsultationMode = 'ONLINE_VIDEO' | 'AUDIO_CALL' | 'IN_CLINIC';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:30 AM", "11:00 AM", "04:30 PM"
  period: 'MORNING' | 'AFTERNOON' | 'EVENING';
  isAvailable: boolean;
}

export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  profileImage: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  languages: string[];
  specializations: string[];
  qualification: string; // e.g., "BAMS, MD (Ayurveda)"
  registrationAuthority: string; // e.g., "Central Council of Indian Medicine (CCIM)"
  registrationNumber: string; // e.g., "CCIM/AYU/2016/7892"
  yearsOfExperience: number;
  clinicName?: string;
  clinicAddress?: string;
  consultationTypes: ConsultationMode[];
  consultationFeeInINR: number;
  availableDays: string[];
  availableTimeSlots: TimeSlot[];
  bio: string;
  verificationStatus: VerificationStatus;
  profileStatus: ProfileStatus;
  rating: number;
  reviewCount: number;
  isDemo?: boolean; // Explicit flag for demo data disclosure
}

export interface DoctorFilterParams {
  searchQuery?: string;
  specialization?: string;
  language?: string;
  gender?: string;
  consultationType?: ConsultationMode;
  maxFee?: number;
  verificationStatus?: VerificationStatus;
}
