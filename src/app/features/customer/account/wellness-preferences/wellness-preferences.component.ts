import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';

@Component({
  selector: 'app-wellness-preferences',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16 max-w-4xl">
      <!-- Breadcrumbs & Header -->
      <div class="space-y-4">
        <nav class="flex items-center gap-2 text-xs text-[#64748B]">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/account" class="hover:text-[#2F6B4F]">Account</a> /
          <span class="text-[#1F2933] font-medium">Ayurvedic Wellness Preferences</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
          <div>
            <h1 class="text-2xl font-extrabold text-[#1F2933] tracking-tight">Ayurvedic Wellness Preferences</h1>
            <p class="text-xs text-[#64748B] mt-1">Customize your Prakriti constitution profile, dietary preferences, and personal health goals.</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-8">
        <!-- 1. Prakriti Constitution -->
        <div class="space-y-3">
          <h3 class="font-extrabold text-base text-[#1F2933] flex items-center gap-2">
            <app-icon name="sparkles" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
            <span>Dominant Prakriti (Body Constitution)</span>
          </h3>
          <p class="text-xs text-[#64748B]">Select your primary Prakriti assessment if diagnosed by an Ayurveda physician.</p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <button
              *ngFor="let p of prakritiOptions"
              (click)="selectedPrakriti = p.value"
              class="p-4 rounded-2xl border text-left space-y-1 transition-all"
              [ngClass]="selectedPrakriti === p.value ? 'bg-[#EAF4EC] border-[#2F6B4F] text-[#2F6B4F] font-bold shadow-xs' : 'bg-[#F8FAF7] border-[#DDE7DF] text-[#1F2933] hover:bg-[#EAF4EC]/50'"
            >
              <span class="block text-sm font-extrabold">{{ p.label }}</span>
              <span class="block text-[11px] opacity-80 leading-snug">{{ p.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Primary Health & Wellness Goals -->
        <div class="space-y-3 border-t border-[#DDE7DF] pt-6">
          <h3 class="font-extrabold text-base text-[#1F2933] flex items-center gap-2">
            <app-icon name="target" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
            <span>Primary Health & Wellness Goals</span>
          </h3>
          <p class="text-xs text-[#64748B]">Select key areas you wish to focus on with herbal care.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label *ngFor="let goal of wellnessGoals" class="p-3.5 bg-[#F8FAF7] border border-[#DDE7DF] rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-[#EAF4EC]/40">
              <input type="checkbox" [(ngModel)]="goal.selected" class="rounded text-[#2F6B4F] focus:ring-[#2F6B4F] w-4 h-4" />
              <span class="font-bold text-[#1F2933]">{{ goal.label }}</span>
            </label>
          </div>
        </div>

        <!-- 3. Dietary Preferences -->
        <div class="space-y-3 border-t border-[#DDE7DF] pt-6">
          <h3 class="font-extrabold text-base text-[#1F2933] flex items-center gap-2">
            <app-icon name="package" [size]="20" customClass="text-[#2F6B4F]"></app-icon>
            <span>Dietary & Product Preferences</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="font-bold text-[#1F2933] block mb-1">Dietary Regiment</label>
              <select [(ngModel)]="dietaryPreference" class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs">
                <option value="SATTVIC">Sattvic Pure Vegetarian</option>
                <option value="VEGAN">100% Plant-Based Vegan</option>
                <option value="HERBAL_TEA">Herbal Infusion & Tea Lover</option>
                <option value="GLUTEN_FREE">Gluten-Free Preferred</option>
              </select>
            </div>

            <div>
              <label class="font-bold text-[#1F2933] block mb-1">Daily Dinacharya Reminders</label>
              <select [(ngModel)]="dinacharyaReminder" class="w-full p-3 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs">
                <option value="DAILY">Daily Morning & Evening Reminders</option>
                <option value="WEEKLY">Weekly Herbal Summary</option>
                <option value="NONE">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4 border-t border-[#DDE7DF] flex justify-end">
          <button (click)="savePreferences()" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-8 shadow-md">
            Save Wellness Profile
          </button>
        </div>
      </div>
    </div>
  `,
})
export class WellnessPreferencesComponent {
  selectedPrakriti = 'VATA_PITTA';

  prakritiOptions = [
    { value: 'VATA', label: 'Vata Dominant', desc: 'Air & Ether - Energetic, creative, dry skin, light sleep.' },
    { value: 'PITTA', label: 'Pitta Dominant', desc: 'Fire & Water - Focused, warm body, strong metabolism.' },
    { value: 'KAPHA', label: 'Kapha Dominant', desc: 'Earth & Water - Calm, steady, strong immunity, smooth skin.' },
    { value: 'VATA_PITTA', label: 'Vata-Pitta Dual', desc: 'Air & Fire - Energetic, sharp intellect, active digestive fire.' },
    { value: 'PITTA_KAPHA', label: 'Pitta-Kapha Dual', desc: 'Fire & Earth - Strong stamina, warm, steady endurance.' },
    { value: 'TRIDOSHIC', label: 'Balanced Tridoshic', desc: 'Equal equilibrium of Vata, Pitta, and Kapha.' },
  ];

  wellnessGoals = [
    { label: 'Digestive Harmony & Detox (Agni Support)', selected: true },
    { label: 'Stress Resilience & Restful Sleep', selected: true },
    { label: 'Joint Flexibility & Spinal Care', selected: false },
    { label: 'Skin Radiance & Botanical Haircare', selected: true },
    { label: 'Hormonal & Women’s Health', selected: false },
    { label: 'Immunity & Seasonal Vitality', selected: true },
  ];

  dietaryPreference = 'SATTVIC';
  dinacharyaReminder = 'DAILY';

  constructor(private toastService: ToastService) {}

  savePreferences(): void {
    this.toastService.success('Your Ayurvedic Wellness Profile has been updated successfully!', 'Profile Saved');
  }
}
