export type PrescriptionStatus = 'ACTIVE' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';

export interface PrescriptionItem {
  id: string;
  productName: string;
  productId?: string; // Links to product catalog if available
  dosage: string; // e.g. "1 Tablet", "10ml", "1 tsp"
  frequency: string; // e.g. "Twice daily after meals", "Once daily morning"
  duration: string; // e.g. "30 Days", "15 Days"
  vehicle?: string; // Anupana e.g. "Warm Water", "Lukewarm Milk"
  instructions: string;
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName?: string;
  doctorId: string;
  doctorName: string;
  doctorQualification?: string;
  doctorRegistrationNumber?: string;
  appointmentId: string;
  appointmentReference?: string;
  prescriptionDate: string; // YYYY-MM-DD
  items: PrescriptionItem[];
  instructions: string; // General dietary advice & Dinacharya lifestyle recommendations
  status: PrescriptionStatus;
  documentReference?: string; // PDF memo reference e.g., RX-2026-98412.pdf
  isDemo?: boolean;
}
