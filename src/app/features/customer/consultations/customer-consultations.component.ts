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
  selector: 'app-customer-consultations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Page Header -->
      <div class="space-y-4">
        <nav class="flex items-center gap-2 text-xs text-[#64748B]">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/account" class="hover:text-[#2F6B4F]">Account</a> /
          <span class="text-[#1F2933] font-medium">My Consultations</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
          <div>
            <h1 class="text-2xl font-extrabold text-[#1F2933] tracking-tight">My Doctor Consultations</h1>
            <p class="text-xs text-[#64748B] mt-1">Manage scheduled Ayurveda consultations, join tele-health calls, and view past session history.</p>
          </div>
          <a routerLink="/consultation/doctors" class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-5 shrink-0 shadow-xs">
            + Book New Consultation
          </a>
        </div>
      </div>

      <!-- Filter Tabs: Upcoming vs Past -->
      <div class="flex items-center gap-2 border-b border-[#DDE7DF] pb-3 text-xs font-bold">
        <button
          (click)="activeTab = 'upcoming'"
          class="px-4 py-2 rounded-xl transition-all"
          [ngClass]="activeTab === 'upcoming' ? 'bg-[#2F6B4F] text-white shadow-xs' : 'text-[#64748B] hover:bg-[#EAF4EC]'"
        >
          Upcoming Sessions ({{ upcomingAppointments.length }})
        </button>

        <button
          (click)="activeTab = 'past'"
          class="px-4 py-2 rounded-xl transition-all"
          [ngClass]="activeTab === 'past' ? 'bg-[#2F6B4F] text-white shadow-xs' : 'text-[#64748B] hover:bg-[#EAF4EC]'"
        >
          Past Consultations ({{ pastAppointments.length }})
        </button>
      </div>

      <!-- Upcoming Appointments List -->
      <div *ngIf="activeTab === 'upcoming'" class="space-y-4">
        <div *ngIf="upcomingAppointments.length > 0; else noUpcoming" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            *ngFor="let apt of upcomingAppointments"
            class="bg-white rounded-3xl border border-[#DDE7DF] p-6 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-[#2F6B4F] bg-[#EAF4EC] px-2.5 py-1 rounded-lg border border-[#2E7D32]/20">
                  {{ apt.bookingReference }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(apt.status)">
                  {{ apt.status }}
                </span>
              </div>

              <!-- Doctor Meta -->
              <div class="flex items-center gap-3">
                <img [src]="apt.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600'" class="w-14 h-14 rounded-2xl object-cover border border-[#DDE7DF] shrink-0" />
                <div>
                  <h3 class="font-extrabold text-[#1F2933] text-base">{{ apt.doctorName }}</h3>
                  <p class="text-xs font-bold text-[#2F6B4F]">{{ apt.doctorSpecialization || 'Ayurveda Specialist' }}</p>
                </div>
              </div>

              <!-- Slot Details -->
              <div class="p-3 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1 text-xs text-[#1F2933]">
                <div class="flex justify-between">
                  <span class="text-[#64748B]">Date & Time:</span>
                  <span class="font-bold">{{ apt.appointmentDate }} at {{ apt.startTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#64748B]">Consultation Mode:</span>
                  <span class="font-bold text-[#2F6B4F]">{{ getModeLabel(apt.consultationType) }}</span>
                </div>
                <div class="flex justify-between border-t border-[#DDE7DF] pt-1">
                  <span class="text-[#64748B]">Fee:</span>
                  <span class="font-bold text-[#2E7D32]">{{ formatInr(apt.feeInINR) }} (PAID)</span>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="pt-3 border-t border-[#DDE7DF] flex items-center justify-between gap-2 flex-wrap text-xs">
              <a [routerLink]="['/consultation/room', apt.id]" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <app-icon name="video" [size]="14"></app-icon> Join Call
              </a>

              <div class="flex items-center gap-2">
                <button (click)="openRescheduleModal(apt)" class="text-[#2F6B4F] hover:underline font-bold text-[11px]">
                  Reschedule
                </button>
                <button (click)="openCancelModal(apt)" class="text-[#C62828] hover:underline font-bold text-[11px]">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noUpcoming>
          <div class="bg-white p-12 rounded-3xl border border-[#DDE7DF] text-center space-y-3">
            <h3 class="text-base font-extrabold text-[#1F2933]">No Upcoming Consultations</h3>
            <p class="text-xs text-[#64748B]">You have no scheduled Ayurveda doctor appointments at the moment.</p>
            <a routerLink="/consultation/doctors" class="btn btn-sm bg-[#2F6B4F] text-white font-bold rounded-xl px-5">
              Book a Consultation
            </a>
          </div>
        </ng-template>
      </div>

      <!-- Past Appointments List -->
      <div *ngIf="activeTab === 'past'" class="space-y-4">
        <div *ngIf="pastAppointments.length > 0; else noPast" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            *ngFor="let apt of pastAppointments"
            class="bg-white rounded-3xl border border-[#DDE7DF] p-6 space-y-4 shadow-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-[#64748B]">{{ apt.bookingReference }}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(apt.status)">
                {{ apt.status }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <img [src]="apt.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600'" class="w-12 h-12 rounded-2xl object-cover border border-[#DDE7DF]" />
              <div>
                <h3 class="font-extrabold text-[#1F2933] text-sm">{{ apt.doctorName }}</h3>
                <p class="text-xs text-[#64748B]">{{ apt.appointmentDate }} at {{ apt.startTime }}</p>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noPast>
          <div class="bg-white p-8 rounded-3xl border border-[#DDE7DF] text-center text-xs text-[#64748B]">
            No past consultation records found.
          </div>
        </ng-template>
      </div>

      <!-- Cancel Appointment Modal -->
      <div *ngIf="selectedCancelApt" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#DDE7DF]">
          <h3 class="font-extrabold text-base text-[#1F2933]">Cancel Appointment</h3>
          <p class="text-xs text-[#64748B]">Are you sure you want to cancel appointment <strong>{{ selectedCancelApt.bookingReference }}</strong>?</p>

          <textarea
            [(ngModel)]="cancelReason"
            rows="3"
            placeholder="Reason for cancellation..."
            class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none"
          ></textarea>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="selectedCancelApt = null" class="btn btn-xs bg-gray-100 font-bold text-[#1F2933] px-3">Keep Slot</button>
            <button (click)="confirmCancel()" class="btn btn-xs bg-red-600 text-white font-bold px-4">Confirm Cancellation</button>
          </div>
        </div>
      </div>

      <!-- Reschedule Appointment Modal -->
      <div *ngIf="selectedRescheduleApt" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#DDE7DF]">
          <h3 class="font-extrabold text-base text-[#1F2933]">Request Reschedule</h3>
          <p class="text-xs text-[#64748B]">Select a new date and time for <strong>{{ selectedRescheduleApt.bookingReference }}</strong>.</p>

          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-[#1F2933] block mb-1">New Date</label>
              <input type="date" [(ngModel)]="newRescheduleDate" class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs" />
            </div>

            <div>
              <label class="font-bold text-[#1F2933] block mb-1">New Time Slot</label>
              <select [(ngModel)]="newRescheduleTime" class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs">
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="05:30 PM">05:30 PM</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="selectedRescheduleApt = null" class="btn btn-xs bg-gray-100 font-bold text-[#1F2933] px-3">Cancel</button>
            <button (click)="confirmReschedule()" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-4">Submit Request</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CustomerConsultationsComponent implements OnInit {
  appointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];
  activeTab: 'upcoming' | 'past' = 'upcoming';

  formatInr = formatInr;

  selectedCancelApt: Appointment | null = null;
  cancelReason = '';

  selectedRescheduleApt: Appointment | null = null;
  newRescheduleDate = '2026-09-29';
  newRescheduleTime = '11:30 AM';

  constructor(
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsForCustomer().subscribe((res) => {
      this.appointments = res;
      this.upcomingAppointments = res.filter(
        (a) => a.status === 'CONFIRMED' || a.status === 'PENDING' || a.status === 'RESCHEDULE_REQUESTED'
      );
      this.pastAppointments = res.filter(
        (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED' || a.status === 'NO_SHOW'
      );
    });
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

  openCancelModal(apt: Appointment): void {
    this.selectedCancelApt = apt;
    this.cancelReason = '';
  }

  confirmCancel(): void {
    if (!this.selectedCancelApt) return;
    this.appointmentService.cancelAppointment(this.selectedCancelApt.id, this.cancelReason).subscribe(() => {
      this.selectedCancelApt = null;
      this.loadAppointments();
    });
  }

  openRescheduleModal(apt: Appointment): void {
    this.selectedRescheduleApt = apt;
  }

  confirmReschedule(): void {
    if (!this.selectedRescheduleApt) return;
    this.appointmentService
      .rescheduleAppointment(this.selectedRescheduleApt.id, this.newRescheduleDate, this.newRescheduleTime)
      .subscribe({
        next: () => {
          this.selectedRescheduleApt = null;
          this.loadAppointments();
        },
      });
  }
}
