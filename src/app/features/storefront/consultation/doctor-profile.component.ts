import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Doctor, TimeSlot } from '../../../core/models/doctor.model';
import { CreateAppointmentDto, ConsultationType } from '../../../core/models/appointment.model';
import { ToastService } from '../../../core/services/toast.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { RatingComponent } from '../../../shared/components/rating.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, RatingComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <div *ngIf="doctor" class="space-y-8">
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs text-[#64748B]">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/consultation" class="hover:text-[#2F6B4F]">Ayurveda Tele-Health</a> /
          <a routerLink="/consultation/doctors" class="hover:text-[#2F6B4F]">Doctors</a> /
          <span class="text-[#1F2933] font-medium truncate">{{ doctor.name }}</span>
        </nav>

        <!-- Doctor Profile Main Header Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <!-- Left: Photo & Core Metadata -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img [src]="doctor.profileImage" [alt]="doctor.name" class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-[#DDE7DF] shrink-0 bg-[#F8FAF7]" />

              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933] tracking-tight">{{ doctor.name }}</h1>
                  <!-- Explicit Verification Status Badge based strictly on data field -->
                  <span *ngIf="doctor.verificationStatus === 'VERIFIED'" class="bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1">
                    <app-icon name="check-circle" [size]="14"></app-icon> Verified Ayurveda Specialist
                  </span>
                </div>

                <p class="text-xs sm:text-sm font-bold text-[#2F6B4F]">{{ doctor.qualification }}</p>

                <div class="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                  <span><strong>{{ doctor.yearsOfExperience }} Years</strong> Clinical Experience</span> &bull;
                  <app-rating [rating]="doctor.rating" [reviewCount]="doctor.reviewCount"></app-rating>
                </div>

                <!-- Registration Information -->
                <div class="p-2.5 bg-[#F8FAF7] rounded-xl border border-[#DDE7DF] text-xs text-[#64748B] flex flex-wrap items-center gap-2">
                  <span class="font-bold text-[#1F2933]">Reg Authority:</span> {{ doctor.registrationAuthority }}
                  <span class="font-mono bg-white px-2 py-0.5 rounded border border-[#DDE7DF] text-[#2F6B4F] font-bold">{{ doctor.registrationNumber }}</span>
                </div>
              </div>
            </div>

            <!-- Right: Fee & Quick Booking Callout -->
            <div class="p-5 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-3 text-center md:text-right shrink-0">
              <div>
                <span class="text-xs font-bold text-[#64748B] uppercase block">Consultation Fee</span>
                <span class="text-3xl font-extrabold text-[#1F2933]">{{ formatInr(doctor.consultationFeeInINR) }}</span>
              </div>
              <a href="#booking-calendar" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-6 w-full sm:w-auto shadow-md block">
                Book Consultation
              </a>
            </div>
          </div>
        </div>

        <!-- Two-Column Profile Details & Booking Slot Picker -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left 2-Cols: Information & Credentials -->
          <div class="lg:col-span-2 space-y-6">

            <!-- About Doctor -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] space-y-3 shadow-xs">
              <h3 class="font-extrabold text-lg text-[#1F2933] flex items-center gap-2">
                <app-icon name="user" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
                <span>About {{ doctor.name }}</span>
              </h3>
              <p class="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {{ doctor.bio }}
              </p>
            </div>

            <!-- Qualifications & Professional Registration -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] space-y-4 shadow-xs">
              <h3 class="font-extrabold text-lg text-[#1F2933] flex items-center gap-2">
                <app-icon name="shield" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
                <span>Medical Registration & Qualifications</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-[#64748B] font-bold">Academic Degree</span>
                  <p class="font-bold text-[#1F2933]">{{ doctor.qualification }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-[#64748B] font-bold">Registration License No</span>
                  <p class="font-mono font-bold text-[#2F6B4F]">{{ doctor.registrationNumber }}</p>
                </div>
                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1 sm:col-span-2">
                  <span class="text-[#64748B] font-bold">State / Central Registration Authority</span>
                  <p class="font-bold text-[#1F2933]">{{ doctor.registrationAuthority }}</p>
                </div>
              </div>
            </div>

            <!-- Specializations & Clinical Focus -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] space-y-4 shadow-xs">
              <h3 class="font-extrabold text-lg text-[#1F2933] flex items-center gap-2">
                <app-icon name="sparkles" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
                <span>Clinical Specializations</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div *ngFor="let spec of doctor.specializations" class="p-3.5 bg-[#EAF4EC]/60 border border-[#DDE7DF] rounded-2xl flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-[#2F6B4F] text-white flex items-center justify-center font-bold">🌿</span>
                  <span class="font-bold text-[#1F2933]">{{ spec }}</span>
                </div>
              </div>
            </div>

            <!-- Clinic & Online Consultation Details -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] space-y-4 shadow-xs">
              <h3 class="font-extrabold text-lg text-[#1F2933] flex items-center gap-2">
                <app-icon name="store" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
                <span>Practice Locations & Consultation Modes</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div *ngIf="doctor.clinicName" class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-[#64748B] font-bold">In-Clinic Practice</span>
                  <p class="font-bold text-[#1F2933]">{{ doctor.clinicName }}</p>
                  <p class="text-[#64748B] text-[11px]">{{ doctor.clinicAddress }}</p>
                </div>

                <div class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1">
                  <span class="text-[#64748B] font-bold">Supported Consultation Modes</span>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <span *ngFor="let mode of doctor.consultationTypes" class="px-2.5 py-1 bg-[#2F6B4F] text-white rounded-lg font-bold text-[11px]">
                      {{ getModeLabel(mode) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Interactive Appointment Calendar & Slot Picker -->
          <div id="booking-calendar" class="space-y-6">
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-6 sticky top-24">
              <div>
                <h3 class="font-extrabold text-lg text-[#1F2933] flex items-center gap-2">
                  <app-icon name="calendar" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
                  <span>Select Consultation Slot</span>
                </h3>
                <p class="text-xs text-[#64748B] mt-1">Pick a convenient day and time slot.</p>
              </div>

              <!-- Select Consultation Mode -->
              <div class="space-y-2 text-xs">
                <label class="font-bold text-[#1F2933] block">Consultation Type:</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    *ngFor="let mode of consultationTypeOptions"
                    (click)="selectedConsultationType = mode.value"
                    class="p-2 rounded-xl border text-[11px] font-bold text-center transition-all"
                    [ngClass]="selectedConsultationType === mode.value ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' : 'bg-[#F8FAF7] text-[#1F2933] border-[#DDE7DF] hover:bg-[#EAF4EC]'"
                  >
                    {{ mode.label }}
                  </button>
                </div>
              </div>

              <!-- Date Picker Buttons -->
              <div class="space-y-2 text-xs">
                <label class="font-bold text-[#1F2933] block">Select Date:</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    *ngFor="let date of availableDates"
                    (click)="selectedDate = date"
                    class="p-2.5 rounded-xl border text-center transition-all"
                    [ngClass]="selectedDate === date ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' : 'bg-[#F8FAF7] text-[#1F2933] border-[#DDE7DF] hover:bg-[#EAF4EC]'"
                  >
                    <span class="block text-[10px] font-bold uppercase opacity-80">{{ date.dayName }}</span>
                    <span class="block font-extrabold text-xs">{{ date.dateString }}</span>
                  </button>
                </div>
              </div>

              <!-- Time Slots Grid -->
              <div class="space-y-2 text-xs">
                <label class="font-bold text-[#1F2933] block">Select Time Slot:</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    *ngFor="let slot of doctor.availableTimeSlots"
                    (click)="selectedSlot = slot"
                    class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
                    [ngClass]="selectedSlot?.id === slot.id ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' : 'bg-[#F8FAF7] text-[#1F2933] border-[#DDE7DF] hover:bg-[#EAF4EC]'"
                  >
                    <app-icon name="clock" [size]="12"></app-icon>
                    <span>{{ slot.time }}</span>
                  </button>
                </div>
              </div>

              <!-- Booking Confirmation CTA -->
              <div class="pt-4 border-t border-[#DDE7DF] space-y-3">
                <div *ngIf="selectedSlot && selectedDate" class="p-3 bg-[#EAF4EC] rounded-xl text-xs text-[#2E7D32] font-semibold space-y-1">
                  <div class="flex items-center gap-1 font-bold">
                    <app-icon name="check-circle" [size]="14"></app-icon> Selected Slot:
                  </div>
                  <p>{{ selectedDate.dayName }}, {{ selectedDate.dateString }} at {{ selectedSlot.time }} ({{ getModeLabel(selectedConsultationType) }})</p>
                </div>

                <button
                  (click)="openBookingModal()"
                  [disabled]="!selectedSlot || !selectedDate"
                  class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl w-full flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <app-icon name="calendar" [size]="18"></app-icon>
                  <span>Proceed to Book Appointment</span>
                </button>

                <p class="text-[11px] text-[#64748B] text-center">
                  Instant appointment token generation & booking receipt upon confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Information Modal -->
      <div *ngIf="showBookingModal && doctor" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#DDE7DF] shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <div>
              <h3 class="font-extrabold text-lg text-[#1F2933]">Enter Patient Information</h3>
              <p class="text-xs text-[#64748B]">Complete booking details for appointment review.</p>
            </div>
            <button (click)="showBookingModal = false" class="text-[#64748B] hover:text-[#1F2933] font-bold text-lg">✕</button>
          </div>

          <!-- Appointment Summary Badge -->
          <div class="p-3 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] text-xs space-y-1 text-[#1F2933]">
            <div class="flex justify-between font-bold">
              <span>Doctor: {{ doctor.name }}</span>
              <span class="text-[#2F6B4F]">{{ formatInr(doctor.consultationFeeInINR) }}</span>
            </div>
            <div class="text-[#64748B]">
              <span>Date & Time: <strong>{{ selectedDate?.dateString }} at {{ selectedSlot?.time }}</strong></span> &bull;
              <span>Mode: <strong>{{ getModeLabel(selectedConsultationType) }}</strong></span>
            </div>
          </div>

          <!-- Patient Form Fields -->
          <div class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-[#1F2933] mb-1">Patient Full Name *</label>
              <input
                type="text"
                [(ngModel)]="patientName"
                placeholder="Enter patient full name"
                class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-[#1F2933] mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  [(ngModel)]="patientPhone"
                  placeholder="+91 98765 43210"
                  class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
                />
              </div>
              <div>
                <label class="block font-bold text-[#1F2933] mb-1">Patient Age</label>
                <input
                  type="number"
                  [(ngModel)]="patientAge"
                  placeholder="30"
                  class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
                />
              </div>
            </div>

            <div>
              <label class="block font-bold text-[#1F2933] mb-1">Primary Health Reason / Symptoms Note (Optional)</label>
              <textarea
                [(ngModel)]="healthNotes"
                rows="3"
                placeholder="Briefly describe symptoms (e.g., hyperacidity, joint stiffness, stress)..."
                class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
              ></textarea>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#DDE7DF]">
            <button (click)="showBookingModal = false" class="btn btn-sm bg-gray-100 hover:bg-gray-200 text-[#1F2933] font-bold rounded-xl px-4">
              Cancel
            </button>
            <button
              (click)="submitBooking()"
              [disabled]="isSubmitting || !patientName || !patientPhone"
              class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-6 shadow-md disabled:opacity-50"
            >
              {{ isSubmitting ? 'Confirming...' : 'Confirm Appointment' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DoctorProfileComponent implements OnInit {
  doctor?: Doctor;
  formatInr = formatInr;

  selectedConsultationType: ConsultationType = 'VIDEO';
  selectedDate: { dayName: string; dateString: string; fullDate: string } | null = null;
  selectedSlot: TimeSlot | null = null;

  consultationTypeOptions: { value: ConsultationType; label: string }[] = [
    { value: 'VIDEO', label: 'HD Video' },
    { value: 'AUDIO', label: 'Audio Call' },
    { value: 'IN_PERSON', label: 'In-Clinic' },
    { value: 'FOLLOW_UP', label: 'Follow-up' },
  ];

  availableDates = [
    { dayName: 'Today', dateString: '19 Sep', fullDate: '2026-09-19' },
    { dayName: 'Tomorrow', dateString: '20 Sep', fullDate: '2026-09-20' },
    { dayName: 'Monday', dateString: '22 Sep', fullDate: '2026-09-22' },
  ];

  // Booking Modal Form State
  showBookingModal = false;
  isSubmitting = false;
  patientName = 'Shubham Sharma';
  patientPhone = '+91 98765 43210';
  patientAge = 32;
  healthNotes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.doctorService.getDoctorById(id).subscribe((res) => {
        if (res) {
          this.doctor = res;
          if (res.availableTimeSlots.length > 0) {
            this.selectedSlot = res.availableTimeSlots[0];
          }
          this.selectedDate = this.availableDates[0];
        }
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

  openBookingModal(): void {
    if (!this.selectedSlot || !this.selectedDate || !this.doctor) {
      this.toastService.warning('Please select a date and time slot first.', 'Selection Required');
      return;
    }
    this.showBookingModal = true;
  }

  submitBooking(): void {
    if (!this.doctor || !this.selectedSlot || !this.selectedDate) return;

    this.isSubmitting = true;
    const dto: CreateAppointmentDto = {
      doctorId: this.doctor.id,
      appointmentDate: this.selectedDate.fullDate,
      startTime: this.selectedSlot.time,
      consultationType: this.selectedConsultationType,
      feeInINR: this.doctor.consultationFeeInINR,
      customerName: this.patientName,
      customerPhone: this.patientPhone,
      patientAge: this.patientAge,
      notes: this.healthNotes,
    };

    this.appointmentService.createAppointment(dto).subscribe({
      next: (appointment) => {
        this.isSubmitting = false;
        this.showBookingModal = false;
        this.router.navigate(['/consultation/booking-success', appointment.id]);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
