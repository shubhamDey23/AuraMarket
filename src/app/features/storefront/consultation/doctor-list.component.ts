import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor, DoctorFilterParams, ConsultationMode } from '../../../core/models/doctor.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { RatingComponent } from '../../../shared/components/rating.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, RatingComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Header Banner & Breadcrumbs -->
      <div class="space-y-4">
        <nav class="flex items-center gap-2 text-xs text-[#64748B]">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/consultation" class="hover:text-[#2F6B4F]">Ayurveda Tele-Health</a> /
          <span class="text-[#1F2933] font-medium">Doctor Discovery</span>
        </nav>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] p-6 sm:p-8 rounded-3xl border border-[#DDE7DF]">
          <div class="space-y-2 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F6B4F]/10 text-[#2F6B4F] text-xs font-extrabold uppercase tracking-wider">
              <app-icon name="user-check" [size]="14"></app-icon> Registered Ayurveda Specialists
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1F2933] tracking-tight">
              Find & Consult Verified <span class="text-[#2F6B4F]">Ayurveda Doctors</span>
            </h1>
            <p class="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Book confidential video, audio, or in-clinic consultations with certified BAMS and MD Ayurveda medical practitioners.
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <div class="p-3 bg-white/80 backdrop-blur rounded-2xl border border-[#DDE7DF] text-center text-xs">
              <span class="block font-extrabold text-[#2F6B4F] text-lg">{{ doctors.length }}</span>
              <span class="text-[#64748B] font-medium">Available Doctors</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Bar -->
      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-4">
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search doctor name, specialization (e.g. Kayachikitsa, Panchakarma), language or bio..."
            class="w-full pl-11 pr-4 py-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl text-xs sm:text-sm text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
          />
          <app-icon name="search" [size]="18" customClass="absolute left-4 top-3.5 text-[#64748B]"></app-icon>
        </div>

        <!-- Filter Controls Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <!-- Specialization Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#1F2933] mb-1">Specialization</label>
            <select
              [(ngModel)]="selectedSpecialization"
              (ngModelChange)="onFilterChange()"
              class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
            >
              <option value="">All Specializations</option>
              <option *ngFor="let spec of allSpecializations" [value]="spec">{{ spec }}</option>
            </select>
          </div>

          <!-- Language Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#1F2933] mb-1">Language Spoken</label>
            <select
              [(ngModel)]="selectedLanguage"
              (ngModelChange)="onFilterChange()"
              class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
            >
              <option value="">All Languages</option>
              <option *ngFor="let lang of allLanguages" [value]="lang">{{ lang }}</option>
            </select>
          </div>

          <!-- Consultation Mode Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#1F2933] mb-1">Consultation Mode</label>
            <select
              [(ngModel)]="selectedConsultationMode"
              (ngModelChange)="onFilterChange()"
              class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
            >
              <option value="">All Modes</option>
              <option value="ONLINE_VIDEO">HD Video Call</option>
              <option value="AUDIO_CALL">Phone / Audio Call</option>
              <option value="IN_CLINIC">In-Clinic Visit</option>
            </select>
          </div>

          <!-- Gender Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#1F2933] mb-1">Gender</label>
            <select
              [(ngModel)]="selectedGender"
              (ngModelChange)="onFilterChange()"
              class="w-full p-2.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs text-[#1F2933] focus:outline-none focus:border-[#2F6B4F]"
            >
              <option value="">Any Gender</option>
              <option value="FEMALE">Female Doctor</option>
              <option value="MALE">Male Doctor</option>
            </select>
          </div>
        </div>

        <!-- Filter Actions & Reset -->
        <div class="flex items-center justify-between pt-2 border-t border-[#DDE7DF] text-xs">
          <span class="text-[#64748B]">Showing <strong class="text-[#1F2933]">{{ filteredDoctors.length }}</strong> verified doctors</span>
          <button (click)="resetFilters()" class="text-[#2F6B4F] hover:underline font-bold">Clear All Filters</button>
        </div>
      </div>

      <!-- Doctor Cards Grid -->
      <div *ngIf="filteredDoctors.length > 0; else noResults" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          *ngFor="let doc of filteredDoctors"
          class="bg-white rounded-3xl border border-[#DDE7DF] p-6 space-y-5 shadow-xs hover:border-[#8BAF91] transition-all flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Doctor Info Header -->
            <div class="flex items-start gap-4">
              <img [src]="doc.profileImage" [alt]="doc.name" class="w-20 h-20 rounded-2xl object-cover border border-[#DDE7DF] shrink-0 bg-[#F8FAF7]" />
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-extrabold text-[#1F2933] text-lg truncate">{{ doc.name }}</h3>
                  <!-- Strict Verification Status Badge based ONLY on explicit data field -->
                  <span *ngIf="doc.verificationStatus === 'VERIFIED'" class="bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0">
                    <app-icon name="check-circle" [size]="12"></app-icon> Verified
                  </span>
                </div>
                <p class="text-xs font-bold text-[#2F6B4F]">{{ doc.qualification }}</p>
                <div class="flex items-center gap-2 text-xs text-[#64748B]">
                  <span><strong>{{ doc.yearsOfExperience }} Years</strong> Experience</span> &bull;
                  <app-rating [rating]="doc.rating" [reviewCount]="doc.reviewCount"></app-rating>
                </div>
              </div>
            </div>

            <!-- Demo Data Disclosure Tag -->
            <div *ngIf="doc.isDemo" class="px-2.5 py-1 bg-[#FFFDF5] border border-[#C69A45]/30 rounded-lg text-[10px] text-[#B7791F] font-semibold flex items-center justify-between">
              <span>[Demo Practitioner Profile]</span>
              <span class="font-mono text-[9px]">{{ doc.registrationNumber }}</span>
            </div>

            <!-- Specializations List -->
            <div class="space-y-1 text-xs">
              <span class="font-bold text-[#1F2933] text-[11px]">Specializations:</span>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let spec of doc.specializations" class="bg-[#EAF4EC] text-[#2F6B4F] px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                  {{ spec }}
                </span>
              </div>
            </div>

            <!-- Languages & Available Days -->
            <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#DDE7DF] text-[#64748B]">
              <div>
                <span class="text-[10px] uppercase font-bold text-[#1F2933] block">Languages</span>
                <span class="font-medium text-[#1F2933]">{{ doc.languages.join(', ') }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-[#1F2933] block">Available Days</span>
                <span class="font-medium text-[#2F6B4F]">{{ doc.availableDays.join(', ') }}</span>
              </div>
            </div>

            <!-- Short Bio -->
            <p class="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
              {{ doc.bio }}
            </p>
          </div>

          <!-- Bottom Card Footer: Fee & Action CTA -->
          <div class="pt-4 border-t border-[#DDE7DF] flex items-center justify-between flex-wrap gap-3">
            <div>
              <span class="text-[10px] font-bold text-[#64748B] uppercase block">Consultation Fee</span>
              <span class="text-lg font-extrabold text-[#1F2933]">{{ formatInr(doc.consultationFeeInINR) }}</span>
            </div>

            <a
              [routerLink]="['/consultation/doctors', doc.id]"
              class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>View Profile & Book</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </a>
          </div>
        </div>
      </div>

      <!-- No Doctors Found Empty State -->
      <ng-template #noResults>
        <div class="bg-white p-12 rounded-3xl border border-[#DDE7DF] text-center space-y-4 max-w-lg mx-auto">
          <div class="w-14 h-14 rounded-full bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center mx-auto font-bold text-xl">
            🩺
          </div>
          <h3 class="text-lg font-extrabold text-[#1F2933]">No Ayurveda Doctors Found</h3>
          <p class="text-xs text-[#64748B]">
            No practitioners matched your current search filters. Try adjusting your specialization or language preferences.
          </p>
          <button (click)="resetFilters()" class="btn btn-sm bg-[#2F6B4F] text-white font-bold rounded-xl px-5">
            Reset Filters
          </button>
        </div>
      </ng-template>
    </div>
  `,
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  formatInr = formatInr;

  searchQuery = '';
  selectedSpecialization = '';
  selectedLanguage = '';
  selectedGender = '';
  selectedConsultationMode = '';

  allSpecializations: string[] = [];
  allLanguages: string[] = [];

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allSpecializations = this.doctorService.getSpecializations();
    this.allLanguages = this.doctorService.getLanguages();

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['specialization']) {
        this.selectedSpecialization = queryParams['specialization'];
      }
      if (queryParams['search']) {
        this.searchQuery = queryParams['search'];
      }
      this.loadDoctors();
    });
  }

  loadDoctors(): void {
    const params: DoctorFilterParams = {
      searchQuery: this.searchQuery,
      specialization: this.selectedSpecialization,
      language: this.selectedLanguage,
      gender: this.selectedGender,
      consultationType: (this.selectedConsultationMode as ConsultationMode) || undefined,
    };

    this.doctorService.getDoctors(params).subscribe((res) => {
      this.doctors = res;
      this.filteredDoctors = res;
    });
  }

  onFilterChange(): void {
    this.loadDoctors();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedSpecialization = '';
    this.selectedLanguage = '';
    this.selectedGender = '';
    this.selectedConsultationMode = '';
    this.loadDoctors();
  }
}
