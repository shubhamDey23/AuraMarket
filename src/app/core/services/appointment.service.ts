import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Appointment, AppointmentStatus, CreateAppointmentDto } from '../models/appointment.model';
import { MOCK_APPOINTMENTS } from '../../data/mock/appointments.mock';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  readonly appointments = signal<Appointment[]>(MOCK_APPOINTMENTS);

  constructor(private toastService: ToastService) {}

  isSlotBooked(doctorId: string, date: string, time: string): boolean {
    return this.appointments().some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.appointmentDate === date &&
        apt.startTime === time &&
        apt.status !== 'CANCELLED'
    );
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    // Prevent double booking validation
    if (this.isSlotBooked(dto.doctorId, dto.appointmentDate, dto.startTime)) {
      const err = `This consultation slot (${dto.appointmentDate} at ${dto.startTime}) is already booked by another patient. Please select a different time slot.`;
      this.toastService.error(err, 'Slot Unavailable');
      return throwError(() => new Error(err));
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingReference: `AYU-APT-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: 'cust-1', // Mock logged-in customer ID
      customerName: dto.customerName,
      customerEmail: dto.customerEmail || 'customer@example.com',
      customerPhone: dto.customerPhone,
      patientAge: dto.patientAge,
      patientGender: dto.patientGender,
      doctorId: dto.doctorId,
      doctorName: 'Dr. Ayurveda Specialist',
      appointmentDate: dto.appointmentDate,
      startTime: dto.startTime,
      endTime: dto.endTime || '30 Mins',
      consultationType: dto.consultationType,
      feeInINR: dto.feeInINR,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
      notes: dto.notes,
    };

    this.appointments.update((current) => [newAppointment, ...current]);
    this.toastService.success(
      `Appointment ${newAppointment.bookingReference} confirmed for ${newAppointment.appointmentDate} at ${newAppointment.startTime}!`,
      'Booking Confirmed'
    );

    return of(newAppointment);
  }

  getAppointmentsForCustomer(customerId = 'cust-1'): Observable<Appointment[]> {
    const list = this.appointments().filter((a) => a.customerId === customerId);
    return of(list);
  }

  getAppointmentsForDoctor(doctorId: string): Observable<Appointment[]> {
    const list = this.appointments().filter((a) => a.doctorId === doctorId);
    return of(list);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return of(this.appointments());
  }

  getAppointmentById(id: string): Observable<Appointment | undefined> {
    const apt = this.appointments().find((a) => a.id === id || a.bookingReference === id);
    return of(apt);
  }

  cancelAppointment(id: string, reason = 'Cancelled by customer'): Observable<Appointment | undefined> {
    let updated: Appointment | undefined;
    this.appointments.update((current) =>
      current.map((a) => {
        if (a.id === id || a.bookingReference === id) {
          updated = {
            ...a,
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            cancellationReason: reason,
          };
          return updated;
        }
        return a;
      })
    );

    if (updated) {
      this.toastService.info(`Appointment ${updated.bookingReference} has been cancelled.`);
    }

    return of(updated);
  }

  rescheduleAppointment(id: string, newDate: string, newTime: string): Observable<Appointment | undefined> {
    let updated: Appointment | undefined;

    const existing = this.appointments().find((a) => a.id === id || a.bookingReference === id);
    if (existing && this.isSlotBooked(existing.doctorId, newDate, newTime)) {
      this.toastService.error(`The slot on ${newDate} at ${newTime} is not available.`, 'Slot Conflict');
      return throwError(() => new Error('Slot conflict'));
    }

    this.appointments.update((current) =>
      current.map((a) => {
        if (a.id === id || a.bookingReference === id) {
          updated = {
            ...a,
            status: 'RESCHEDULE_REQUESTED',
            rescheduleDate: newDate,
            rescheduleTime: newTime,
          };
          return updated;
        }
        return a;
      })
    );

    if (updated) {
      this.toastService.success(`Reschedule requested for ${newDate} at ${newTime}.`, 'Reschedule Requested');
    }

    return of(updated);
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<Appointment | undefined> {
    let updated: Appointment | undefined;
    this.appointments.update((current) =>
      current.map((a) => {
        if (a.id === id || a.bookingReference === id) {
          updated = { ...a, status };
          return updated;
        }
        return a;
      })
    );

    if (updated) {
      this.toastService.info(`Appointment ${updated.bookingReference} status updated to ${status}.`);
    }

    return of(updated);
  }
}
