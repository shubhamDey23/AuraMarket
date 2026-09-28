export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULE_REQUESTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ConsultationType = 'VIDEO' | 'AUDIO' | 'IN_PERSON' | 'FOLLOW_UP';

export type AppointmentPaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface Appointment {
  id: string;
  bookingReference: string; // e.g. AYU-APT-894123
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  doctorSpecialization?: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "10:30 AM"
  consultationType: ConsultationType;
  feeInINR: number;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  createdAt: string; // ISO date string
  notes?: string; // Primary health concern / symptoms note
  rescheduleDate?: string;
  rescheduleTime?: string;
  cancellationReason?: string;
}

export interface CreateAppointmentDto {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  consultationType: ConsultationType;
  feeInINR: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  notes?: string;
}
