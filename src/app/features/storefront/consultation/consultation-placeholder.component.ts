import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

interface Specialization {
  title: string;
  description: string;
  icon: string;
  count: number;
}

interface ConsultationType {
  title: string;
  duration: string;
  mode: string;
  description: string;
  icon: string;
  badge: string;
}

@Component({
  selector: 'app-consultation-placeholder',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-12">
      <!-- 1. Hero Banner -->
      <section class="container">
        <div class="relative rounded-3xl bg-gradient-to-br from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] border border-[#DDE7DF] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-sm">
          <div class="relative z-10 max-w-2xl space-y-6">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F6B4F]/10 text-[#2F6B4F] text-xs font-extrabold uppercase tracking-wider border border-[#8BAF91]/40 shadow-xs">
              <app-icon name="user-check" [size]="14"></app-icon> Verified Ayurvedic Practitioners
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F2933] leading-[1.15]">
              Consult Certified <br class="hidden sm:inline" />
              <span class="text-[#2F6B4F]">Ayurveda Doctors</span> Online
            </h1>
            <p class="text-[#64748B] text-base sm:text-lg leading-relaxed font-normal">
              Get personalized holistic healthcare consultations, personalized Prakriti assessment, lifestyle guidance, and authentic herbal treatment plans from licensed BAMS & MD Ayurveda specialists.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <a href="#specializations" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white shadow-md rounded-xl px-7">
                Explore Specializations
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </a>
              <a href="#how-it-works" class="btn btn-lg bg-white text-[#1F2933] border border-[#DDE7DF] hover:bg-[#EAF4EC] rounded-xl px-6 shadow-xs">
                How Consultation Works
              </a>
            </div>
          </div>

          <!-- Decorative subtle elements -->
          <div class="absolute -right-16 -top-16 w-80 h-80 bg-[#8BAF91]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-16 -bottom-16 w-72 h-72 bg-[#C69A45]/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      <!-- 2. Safety & Medical Notice -->
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

      <!-- 3. Doctor Discovery Entry Point by Specialization -->
      <section id="specializations" class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Clinical Disciplines</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Ayurveda Specializations</h2>
          </div>
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
              <button class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
                Find Doctor →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Consultation Formats / Types -->
      <section class="container">
        <div class="p-8 sm:p-12 rounded-3xl bg-[#F8FAF7] border border-[#DDE7DF] space-y-8">
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Flexible Modes</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Consultation Options</h2>
            <p class="text-xs sm:text-sm text-[#64748B]">Choose your preferred interaction mode with our Ayurveda experts.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let type of consultationTypes" class="p-6 bg-white rounded-2xl border border-[#DDE7DF] space-y-4 shadow-xs">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center">
                  <app-icon [name]="type.icon" [size]="20"></app-icon>
                </div>
                <span class="badge badge-primary text-[10px]">{{ type.badge }}</span>
              </div>
              <div>
                <h4 class="font-bold text-[#1F2933] text-base">{{ type.title }}</h4>
                <div class="text-xs text-[#2F6B4F] font-semibold mt-0.5">{{ type.duration }} &bull; {{ type.mode }}</div>
              </div>
              <p class="text-xs text-[#64748B] leading-relaxed">{{ type.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. How Consultation Works (3 Step Process) -->
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

      <!-- 6. Coming Implementation Section -->
      <section class="container pb-8">
        <div class="p-8 rounded-3xl bg-[#FFFDF5] border border-[#C69A45]/40 text-center space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A45]/20 text-[#B7791F] text-xs font-bold uppercase tracking-wider">
            <app-icon name="clock" [size]="14"></app-icon> Doctor Booking & Tele-Consultation Engine
          </div>
          <h3 class="text-xl sm:text-2xl font-extrabold text-[#1F2933]">Live Consultation Booking Launching Soon</h3>
          <p class="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto">
            Our doctor onboarding, real-time slot booking calendar, and integrated video consultation platform are currently being expanded. Verified Ayurvedic practitioners will be open for appointments shortly.
          </p>
        </div>
      </section>
    </div>
  `,
})
export class ConsultationPlaceholderComponent {
  specializations: Specialization[] = [
    {
      title: 'Kayachikitsa (General Medicine)',
      description: 'Internal medicine, digestive health, metabolic disorders, chronic immunity, and wellness regimens.',
      icon: 'activity',
      count: 24,
    },
    {
      title: 'Panchakarma & Detoxification',
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
      title: 'Tvak Roga (Ayurvedic Dermatology)',
      description: 'Holistic skin & hair wellness, eczema care, herbal topicals, and blood purification.',
      icon: 'sun',
      count: 16,
    },
  ];

  consultationTypes: ConsultationType[] = [
    {
      title: 'Video Consultation',
      duration: '30 Mins',
      mode: 'Live HD Video Call',
      description: 'Face-to-face interaction with doctor for visual evaluation, tongue assessment, and detailed discussion.',
      icon: 'video',
      badge: 'Most Popular',
    },
    {
      title: 'Audio Call Consultation',
      duration: '20 Mins',
      mode: 'Phone / Audio Call',
      description: 'Quick confidential consultation for follow-ups, herb dosage checks, and general diet advice.',
      icon: 'phone',
      badge: 'Quick Check',
    },
    {
      title: 'Clinic Visit Booking',
      duration: 'In-Person',
      mode: 'Physical Examination',
      description: 'Book physical Nadi Pariksha (pulse diagnosis) and in-clinic consultation at verified partner centers.',
      icon: 'map-pin',
      badge: 'In-Clinic',
    },
  ];
}
