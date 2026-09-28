import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { RatingComponent } from '../../../shared/components/rating.component';
import { formatInr } from '../../../core/utils/currency.util';

interface SpecializationCard {
  title: string;
  description: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-consultation-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, RatingComponent],
  template: `
    <div class="space-y-12 pb-16">
      <!-- 1. Hero Section -->
      <section class="container">
        <div class="relative rounded-3xl bg-gradient-to-br from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] border border-[#DDE7DF] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xs">
          <div class="relative z-10 max-w-2xl space-y-6">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F6B4F]/10 text-[#2F6B4F] text-xs font-extrabold uppercase tracking-wider border border-[#8BAF91]/40 shadow-xs">
              <app-icon name="user-check" [size]="14"></app-icon> Verified Ayurvedic Practitioners
            </span>

            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F2933] leading-[1.15]">
              Consult Certified <br class="hidden sm:inline" />
              <span class="text-[#2F6B4F]">Ayurveda Doctors</span> Online
            </h1>

            <p class="text-[#64748B] text-base sm:text-lg leading-relaxed font-normal">
              Book confidential video, audio, or in-clinic consultations with registered BAMS and MD Ayurveda medical specialists. Get personalized Prakriti assessment and authentic treatment plans.
            </p>

            <!-- Search Bar in Hero -->
            <div class="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#DDE7DF] shadow-sm max-w-lg">
              <div class="relative flex-1">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="onSearch()"
                  placeholder="Search doctor name or specialization..."
                  class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:outline-none"
                />
                <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-[#64748B]"></app-icon>
              </div>
              <button (click)="onSearch()" class="btn btn-sm bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0">
                Find Doctor
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-2">
              <a routerLink="/consultation/doctors" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white shadow-md rounded-xl px-7 font-bold">
                Explore All Doctors
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </a>
              <a href="#how-it-works" class="btn btn-lg bg-white text-[#1F2933] border border-[#DDE7DF] hover:bg-[#EAF4EC] rounded-xl px-6 shadow-xs font-bold">
                How Consultation Works
              </a>
            </div>
          </div>

          <!-- Subtle Background Shapes -->
          <div class="absolute -right-16 -top-16 w-80 h-80 bg-[#8BAF91]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-16 -bottom-16 w-72 h-72 bg-[#C69A45]/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      <!-- 2. Medical Safety Advisory Banner -->
      <section class="container">
        <div class="p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] border border-[#C69A45]/30 text-[#1F2933] flex items-start gap-4 shadow-xs">
          <div class="w-10 h-10 rounded-xl bg-[#C69A45]/15 text-[#C69A45] flex items-center justify-center shrink-0 mt-0.5">
            <app-icon name="shield" [size]="20"></app-icon>
          </div>
          <div class="space-y-1 text-xs sm:text-sm">
            <h4 class="font-bold text-[#1F2933]">Medical & Practitioner Safety Notice</h4>
            <p class="text-[#64748B] leading-relaxed">
              All consultations on Aura Ayurveda are conducted by registered BAMS/MD Ayurvedic medical practitioners holding valid state and central council licenses. Online consultations supplement healthcare and are not intended for acute emergency conditions. In emergency scenarios, please visit your nearest hospital immediately.
            </p>
          </div>
        </div>
      </section>

      <!-- 3. Featured Doctors Carousel / Grid -->
      <section class="container space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Top Specialists</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Featured Ayurveda Practitioners</h2>
          </div>
          <a routerLink="/consultation/doctors" class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
            View All Doctors ({{ doctors.length }}) →
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let doc of featuredDoctors" class="bg-white rounded-3xl border border-[#DDE7DF] p-6 space-y-4 shadow-xs hover:border-[#8BAF91] transition-all flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <img [src]="doc.profileImage" [alt]="doc.name" class="w-16 h-16 rounded-2xl object-cover border border-[#DDE7DF] shrink-0 bg-[#F8FAF7]" />
                <div class="min-w-0">
                  <h3 class="font-extrabold text-[#1F2933] text-base truncate">{{ doc.name }}</h3>
                  <p class="text-xs font-bold text-[#2F6B4F] truncate">{{ doc.qualification }}</p>
                  <div class="flex items-center gap-1 text-xs text-[#64748B] mt-0.5">
                    <app-rating [rating]="doc.rating" [reviewCount]="doc.reviewCount"></app-rating>
                  </div>
                </div>
              </div>

              <!-- Specialization Pills -->
              <div class="flex flex-wrap gap-1 text-[11px]">
                <span *ngFor="let spec of doc.specializations.slice(0, 2)" class="bg-[#EAF4EC] text-[#2F6B4F] px-2 py-0.5 rounded-full font-medium">
                  {{ spec }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-[#DDE7DF] flex items-center justify-between">
              <div>
                <span class="text-[10px] text-[#64748B] uppercase font-bold block">Fee</span>
                <span class="text-base font-extrabold text-[#1F2933]">{{ formatInr(doc.consultationFeeInINR) }}</span>
              </div>
              <a [routerLink]="['/consultation/doctors', doc.id]" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg">
                Book Slot
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Specializations Grid -->
      <section class="container space-y-6">
        <div>
          <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Clinical Disciplines</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Explore by Specialization</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let spec of specializations" class="card p-6 bg-white hover-lift border border-[#DDE7DF] rounded-2xl space-y-3">
            <div class="w-12 h-12 rounded-xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center font-bold">
              <app-icon [name]="spec.icon" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-[#1F2933] text-lg">{{ spec.title }}</h3>
            <p class="text-xs text-[#64748B] leading-relaxed">{{ spec.description }}</p>
            <div class="pt-2 flex items-center justify-between border-t border-[#DDE7DF]">
              <span class="text-xs text-[#2F6B4F] font-semibold">{{ spec.count }} Verified Doctors</span>
              <a [routerLink]="['/consultation/doctors']" [queryParams]="{ specialization: spec.title }" class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
                Find Doctor →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. How Consultation Works Process -->
      <section id="how-it-works" class="container">
        <div class="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Simple Process</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">How Online Consultation Works</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#DDE7DF] shadow-xs">
            <div class="w-12 h-12 rounded-full bg-[#2F6B4F] text-white font-extrabold text-lg flex items-center justify-center mx-auto">1</div>
            <h4 class="font-bold text-[#1F2933] text-base">Select Specialist & Slot</h4>
            <p class="text-xs text-[#64748B] leading-relaxed">Choose an Ayurveda doctor based on specialization, language, experience, and convenient consultation slot.</p>
          </div>
          <div class="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#DDE7DF] shadow-xs">
            <div class="w-12 h-12 rounded-full bg-[#2F6B4F] text-white font-extrabold text-lg flex items-center justify-center mx-auto">2</div>
            <h4 class="font-bold text-[#1F2933] text-base">Share Health Profile</h4>
            <p class="text-xs text-[#64748B] leading-relaxed">Fill your health history questionnaire and Prakriti assessment form before the video or audio call session.</p>
          </div>
          <div class="text-center space-y-3 p-6 bg-white rounded-2xl border border-[#DDE7DF] shadow-xs">
            <div class="w-12 h-12 rounded-full bg-[#2F6B4F] text-white font-extrabold text-lg flex items-center justify-center mx-auto">3</div>
            <h4 class="font-bold text-[#1F2933] text-base">Consult & Receive Treatment Plan</h4>
            <p class="text-xs text-[#64748B] leading-relaxed">Discuss symptoms with your doctor and get a digital Ayurvedic prescription with herbal product recommendations.</p>
          </div>
        </div>
      </section>

      <!-- 6. Doctor Registration CTA Banner -->
      <section class="container">
        <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#2F6B4F] to-[#24543D] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div class="space-y-2 text-center md:text-left">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#8BAF91]">Are you an Ayurveda Doctor?</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold">Join Aura Ayurveda Practitioner Panel</h3>
            <p class="text-xs sm:text-sm text-[#EAF4EC] max-w-xl">
              Register your clinical practice, offer video consultation sessions, and connect with wellness seekers across India.
            </p>
          </div>
          <a routerLink="/consultation/doctors" class="btn btn-lg bg-white text-[#2F6B4F] hover:bg-[#EAF4EC] font-extrabold rounded-xl px-7 shrink-0 shadow-sm">
            Join Practitioner Panel
          </a>
        </div>
      </section>
    </div>
  `,
})
export class ConsultationHubComponent implements OnInit {
  doctors: Doctor[] = [];
  featuredDoctors: Doctor[] = [];
  searchQuery = '';
  formatInr = formatInr;

  specializations: SpecializationCard[] = [
    {
      title: 'Kayachikitsa (General Medicine)',
      description: 'Internal medicine, digestive health, metabolic disorders, chronic immunity, and wellness regimens.',
      icon: 'activity',
      count: 24,
    },
    {
      title: 'Panchakarma & Detox',
      description: 'Body purification therapies, seasonal cleansing guidance, and rejuvenation plans.',
      icon: 'sparkles',
      count: 18,
    },
    {
      title: 'Rasayana (Anti-Aging & Vitality)',
      description: 'Rejuvenation therapy, tissue nourishment, memory enhancement, and longevity care.',
      icon: 'heart',
      count: 15,
    },
    {
      title: 'Stri Roga (Women’s Health)',
      description: 'Menstrual harmony, hormonal balance, postnatal care, and natural wellness remedies.',
      icon: 'user',
      count: 20,
    },
    {
      title: 'Dravyaguna (Herbal Pharmacology)',
      description: 'Herbal formulation advice, single herb usage, safety, and dosage guidance.',
      icon: 'package',
      count: 12,
    },
    {
      title: 'Manovikara (Mental Wellness)',
      description: 'Ayurvedic mind-body wellness, stress resilience, insomnia, and bio-rhythms.',
      icon: 'sun',
      count: 16,
    },
  ];

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe((res) => {
      this.doctors = res;
      this.featuredDoctors = res.slice(0, 3);
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/consultation/doctors'], {
        queryParams: { search: this.searchQuery },
      });
    } else {
      this.router.navigate(['/consultation/doctors']);
    }
  }
}
