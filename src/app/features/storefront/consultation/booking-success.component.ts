import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16 max-w-3xl">
      <div *ngIf="appointment" class="space-y-8">
        <!-- Success Celebration Banner -->
        <div class="bg-gradient-to-br from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] p-8 sm:p-10 rounded-3xl border border-[#DDE7DF] text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-[#2F6B4F] text-white flex items-center justify-center mx-auto font-extrabold text-2xl shadow-md">
            <app-icon name="check-circle" [size]="36"></app-icon>
          </div>
          <div>
            <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Appointment Confirmed</span>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1F2933] mt-1">
              Ayurveda Consultation Booked!
            </h1>
            <p class="text-xs sm:text-sm text-[#64748B] mt-2">
              Booking Reference: <strong class="font-mono text-[#2F6B4F] bg-white px-3 py-1 rounded-lg border border-[#DDE7DF]">{{ appointment.bookingReference }}</strong>
            </p>
          </div>
        </div>

        <!-- Receipt Information Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-6">
          <h3 class="font-extrabold text-lg text-[#1F2933] border-b border-[#DDE7DF] pb-3 flex items-center gap-2">
            <app-icon name="calendar" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
            <span>Appointment Details & Receipt</span>
          </h3>

          <!-- Doctor & Slot Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div class="space-y-3">
              <span class="text-[11px] font-bold text-[#64748B] uppercase block">Assigned Doctor</span>
              <div class="flex items-center gap-3">
                <img [src]="appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600'" class="w-14 h-14 rounded-2xl object-cover border border-[#DDE7DF]" />
                <div>
                  <h4 class="font-extrabold text-[#1F2933] text-sm">{{ appointment.doctorName }}</h4>
                  <p class="text-xs font-bold text-[#2F6B4F]">{{ appointment.doctorSpecialization || 'Ayurveda Specialist' }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-2 bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE7DF]">
              <div class="flex justify-between">
                <span class="text-[#64748B]">Scheduled Date:</span>
                <span class="font-extrabold text-[#1F2933]">{{ appointment.appointmentDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#64748B]">Time Slot:</span>
                <span class="font-extrabold text-[#2F6B4F]">{{ appointment.startTime }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#64748B]">Consultation Mode:</span>
                <span class="font-bold text-[#1F2933]">{{ getModeLabel(appointment.consultationType) }}</span>
              </div>
              <div class="flex justify-between border-t border-[#DDE7DF] pt-2 font-bold">
                <span>Fee Status:</span>
                <span class="text-[#2E7D32]">{{ formatInr(appointment.feeInINR) }} (PAID)</span>
              </div>
            </div>
          </div>

          <!-- Patient Information Summary -->
          <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-2 text-xs text-[#1F2933]">
            <h4 class="font-bold text-[#1F2933] text-xs">Patient Details:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#64748B]">
              <span>Name: <strong class="text-[#1F2933]">{{ appointment.customerName }}</strong></span>
              <span>Phone: <strong class="text-[#1F2933]">{{ appointment.customerPhone }}</strong></span>
              <span>Age: <strong class="text-[#1F2933]">{{ appointment.patientAge || '32' }} Yrs</strong></span>
            </div>
            <div *ngIf="appointment.notes" class="pt-1 border-t border-[#DDE7DF] text-[#64748B]">
              <strong>Primary Health Reason:</strong> {{ appointment.notes }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              [routerLink]="['/consultation/room', appointment.id]"
              class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl flex-1 w-full text-center flex items-center justify-center gap-2 shadow-md"
            >
              <app-icon name="video" [size]="18"></app-icon>
              <span>Join Consultation Room</span>
            </a>

            <a
              routerLink="/account/consultations"
              class="btn btn-lg bg-white border border-[#DDE7DF] text-[#1F2933] hover:bg-[#EAF4EC] font-bold rounded-xl flex-1 w-full text-center shadow-xs"
            >
              View My Consultations
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BookingSuccessComponent implements OnInit {
  appointment?: Appointment;
  formatInr = formatInr;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentService.getAppointmentById(id).subscribe((res) => {
        if (res) this.appointment = res;
      });
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
        return 'Follow-up Check-in';
      default:
        return mode;
    }
  }
}
