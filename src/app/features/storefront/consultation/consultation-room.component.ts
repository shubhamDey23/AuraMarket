import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { ToastService } from '../../../core/services/toast.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-consultation-room',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6 pb-16 max-w-5xl">
      <div *ngIf="appointment" class="space-y-6">
        <!-- Room Header Bar -->
        <div class="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-[#DDE7DF] shadow-xs flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#2F6B4F] text-white flex items-center justify-center font-bold">
              <app-icon name="video" [size]="20"></app-icon>
            </div>
            <div>
              <h2 class="font-extrabold text-[#1F2933] text-base">Tele-Consultation Room</h2>
              <p class="text-xs text-[#64748B]">Booking Ref: <span class="font-mono font-bold text-[#2F6B4F]">{{ appointment.bookingReference }}</span></p>
            </div>
          </div>

          <div class="flex items-center gap-3 text-xs">
            <span class="px-3 py-1 bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30 rounded-full font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span> Live Session Ready
            </span>
            <span class="font-mono bg-[#F8FAF7] border border-[#DDE7DF] px-3 py-1 rounded-xl text-[#1F2933] font-bold">⏱ 29:45 Mins Remaining</span>
          </div>
        </div>

        <!-- Main Room Viewport & Controls Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2-Cols: Video Viewport Canvas -->
          <div class="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between overflow-hidden shadow-xl text-white">
            <!-- Top Overlay: Doctor Info Badge -->
            <div class="flex items-center justify-between z-10">
              <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                <img [src]="appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600'" class="w-10 h-10 rounded-xl object-cover" />
                <div class="text-xs">
                  <h4 class="font-extrabold text-white">{{ appointment.doctorName }}</h4>
                  <span class="text-[10px] text-emerald-400 font-bold">BAMS/MD Ayurveda Specialist</span>
                </div>
              </div>

              <span class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                HD Encrypted
              </span>
            </div>

            <!-- Center Viewport Animation Placeholder -->
            <div class="my-auto text-center space-y-3 z-10">
              <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <app-icon name="video" [size]="36"></app-icon>
              </div>
              <h3 class="text-xl font-bold text-white">Video Call Room Integration Placeholder</h3>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                Camera & Audio feeds connected. In production, WebRTC/Twilio video SDK stream renders here seamlessly.
              </p>
            </div>

            <!-- Small Self Video Preview Overlay -->
            <div class="absolute right-4 bottom-20 w-28 h-20 sm:w-36 sm:h-24 bg-slate-800 rounded-2xl border border-white/20 overflow-hidden shadow-lg flex items-center justify-center text-xs text-slate-400">
              <span>Patient Preview</span>
            </div>

            <!-- Bottom Media Control Bar -->
            <div class="flex items-center justify-center gap-4 z-10 pt-4 border-t border-white/10">
              <button
                (click)="isMicMuted = !isMicMuted"
                class="p-3.5 rounded-2xl font-bold transition-all text-xs flex items-center gap-1.5"
                [ngClass]="isMicMuted ? 'bg-red-500/80 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'"
              >
                <app-icon [name]="isMicMuted ? 'slash' : 'mic'" [size]="18"></app-icon>
                <span>{{ isMicMuted ? 'Unmute' : 'Mute' }}</span>
              </button>

              <button
                (click)="isCameraOff = !isCameraOff"
                class="p-3.5 rounded-2xl font-bold transition-all text-xs flex items-center gap-1.5"
                [ngClass]="isCameraOff ? 'bg-red-500/80 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'"
              >
                <app-icon name="video" [size]="18"></app-icon>
                <span>{{ isCameraOff ? 'Cam On' : 'Cam Off' }}</span>
              </button>

              <button (click)="endCall()" class="p-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md">
                <app-icon name="phone-off" [size]="18"></app-icon>
                <span>End Call</span>
              </button>
            </div>
          </div>

          <!-- Right Column: Consultation Summary & Digital Prescription Panel -->
          <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-4 text-xs">
              <h3 class="font-extrabold text-sm text-[#1F2933] border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
                <app-icon name="file-text" [size]="16" customClass="text-[#2F6B4F]"></app-icon>
                <span>Consultation Notes & Rx</span>
              </h3>

              <div class="space-y-2 text-[#64748B]">
                <div>
                  <span class="font-bold text-[#1F2933]">Patient:</span> {{ appointment.customerName }}
                </div>
                <div>
                  <span class="font-bold text-[#1F2933]">Doctor:</span> {{ appointment.doctorName }}
                </div>
                <div>
                  <span class="font-bold text-[#1F2933]">Scheduled Slot:</span> {{ appointment.startTime }}
                </div>
                <div *ngIf="appointment.notes" class="p-2.5 bg-[#F8FAF7] rounded-xl border border-[#DDE7DF] text-[#1F2933]">
                  <strong>Symptoms Note:</strong> {{ appointment.notes }}
                </div>
              </div>

              <div class="p-4 bg-[#EAF4EC] rounded-2xl border border-[#2E7D32]/30 space-y-2 text-[#2E7D32]">
                <h4 class="font-bold text-xs flex items-center gap-1">
                  <app-icon name="check-circle" [size]="14"></app-icon> Digital Prescription
                </h4>
                <p class="text-[11px] leading-relaxed text-[#1F2933]">
                  Once the doctor completes consultation notes, your digital Rx and herbal product recommendations will be automatically linked to your account.
                </p>
              </div>

              <button (click)="endCall()" class="btn btn-sm bg-[#2F6B4F] text-white font-bold rounded-xl w-full">
                Complete Session & Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConsultationRoomComponent implements OnInit {
  appointment?: Appointment;
  isMicMuted = false;
  isCameraOff = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentService.getAppointmentById(id).subscribe((res) => {
        if (res) this.appointment = res;
      });
    }
  }

  endCall(): void {
    this.toastService.info('Consultation session ended.');
    this.router.navigate(['/account/consultations']);
  }
}
