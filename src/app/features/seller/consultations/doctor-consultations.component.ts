import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';
import { ToastService } from '../../../core/services/toast.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-doctor-consultations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Header Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Practitioner Portal</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933]">Doctor Tele-Consultation Schedule</h1>
          <p class="text-xs text-[#64748B] mt-1">Review upcoming patient appointments, confirm slots, and update consultation status.</p>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-[#DDE7DF] text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-[#1F2933]">Status Filter:</span>
          <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()" class="p-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl font-medium">
            <option value="ALL">All Appointments</option>
            <option value="PENDING">Pending Confirmation</option>
            <option value="CONFIRMED">Confirmed Slots</option>
            <option value="RESCHEDULE_REQUESTED">Reschedule Requested</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <span class="text-[#64748B]">Showing <strong class="text-[#1F2933]">{{ filteredAppointments.length }}</strong> appointments</span>
      </div>

      <!-- Appointments List -->
      <div *ngIf="filteredAppointments.length > 0; else noAppointments" class="space-y-4">
        <div
          *ngFor="let apt of filteredAppointments"
          class="bg-white rounded-3xl border border-[#DDE7DF] p-6 space-y-4 shadow-xs"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE7DF] pb-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-[#2F6B4F] bg-[#EAF4EC] px-2.5 py-1 rounded-lg">{{ apt.bookingReference }}</span>
              <span class="text-[#64748B]">Booked on: {{ apt.createdAt | date:'mediumDate' }}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(apt.status)">
                {{ apt.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold text-[#64748B]">Patient Details</span>
              <h4 class="font-extrabold text-[#1F2933] text-sm">{{ apt.customerName }}</h4>
              <p class="text-[#64748B]">{{ apt.customerPhone }} &bull; Age: {{ apt.patientAge || '32' }}</p>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold text-[#64748B]">Slot & Mode</span>
              <p class="font-bold text-[#1F2933]">{{ apt.appointmentDate }} at {{ apt.startTime }}</p>
              <p class="text-[#2F6B4F] font-semibold">{{ getModeLabel(apt.consultationType) }} ({{ formatInr(apt.feeInINR) }})</p>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold text-[#64748B]">Symptoms / Reason</span>
              <p class="text-[#64748B] leading-relaxed bg-[#F8FAF7] p-2.5 rounded-xl border border-[#DDE7DF]">
                {{ apt.notes || 'Routine general wellness consultation.' }}
              </p>
            </div>
          </div>

          <!-- Doctor Actions Bar -->
          <div class="pt-3 border-t border-[#DDE7DF] flex items-center justify-end gap-2 text-xs">
            <button
              *ngIf="apt.status === 'PENDING'"
              (click)="updateStatus(apt.id, 'CONFIRMED')"
              class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg"
            >
              Confirm Appointment
            </button>

            <button
              *ngIf="apt.status === 'CONFIRMED' || apt.status === 'PENDING'"
              (click)="updateStatus(apt.id, 'COMPLETED')"
              class="btn btn-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg"
            >
              Mark Completed
            </button>

            <button
              *ngIf="apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'"
              (click)="updateStatus(apt.id, 'CANCELLED')"
              class="btn btn-xs bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <ng-template #noAppointments>
        <div class="bg-white p-12 rounded-3xl border border-[#DDE7DF] text-center text-xs text-[#64748B]">
          No appointments found matching current filter.
        </div>
      </ng-template>
    </div>
  `,
})
export class DoctorConsultationsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  statusFilter = 'ALL';
  formatInr = formatInr;

  constructor(
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe((res) => {
      this.appointments = res;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'ALL') {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter((a) => a.status === this.statusFilter);
    }
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'VIDEO':
        return 'HD Video Call';
      case 'AUDIO':
        return 'Audio Call';
      case 'IN_PERSON':
        return 'In-Clinic Visit';
      case 'FOLLOW_UP':
        return 'Follow-up';
      default:
        return mode;
    }
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30';
      case 'PENDING':
        return 'bg-[#FFFDF5] text-[#B7791F] border border-[#B7791F]/30';
      case 'RESCHEDULE_REQUESTED':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  updateStatus(id: string, status: AppointmentStatus): void {
    this.appointmentService.updateAppointmentStatus(id, status).subscribe(() => {
      this.loadAppointments();
    });
  }
}
