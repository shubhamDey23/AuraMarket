import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SellerRegisterData } from '../../core/auth/auth.models';
import { AppIconComponent } from '../../shared/components/app-icon.component';

@Component({
  selector: 'app-seller-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-[#635BFF] text-white flex items-center justify-center font-black text-lg">A</div>
            <span class="text-xl font-black text-slate-900">Aura<span class="text-[#635BFF]">Market</span> Seller Onboarding</span>
          </a>
          <p class="text-xs text-slate-500">Step {{ currentStep }} of 5: {{ getStepTitle(currentStep) }}</p>
        </div>

        <!-- Stepper Progress Bar -->
        <div class="card p-4 bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <ng-container *ngFor="let s of [1, 2, 3, 4, 5]; let last = last">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all"
                  [ngClass]="{
                    'bg-indigo-600 text-white ring-4 ring-indigo-100': currentStep === s,
                    'bg-emerald-600 text-white': currentStep > s,
                    'bg-slate-100 text-slate-400': currentStep < s
                  }"
                >
                  <app-icon *ngIf="currentStep > s" name="check" [size]="14"></app-icon>
                  <span *ngIf="currentStep <= s">{{ s }}</span>
                </div>
                <span class="hidden sm:inline text-xs font-semibold" [ngClass]="currentStep >= s ? 'text-slate-900' : 'text-slate-400'">
                  {{ getStepTitle(s) }}
                </span>
              </div>
              <div *ngIf="!last" class="flex-1 h-0.5 mx-2 bg-slate-200">
                <div class="h-full bg-indigo-600 transition-all duration-300" [style.width]="currentStep > s ? '100%' : '0%'"></div>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Form Card -->
        <div class="card p-8 bg-white border border-slate-200 shadow-xl rounded-3xl space-y-6">
          <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <app-icon name="alert-triangle" [size]="16" class="text-red-500 shrink-0"></app-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Step 1: Business Details -->
          <div *ngIf="currentStep === 1" class="space-y-4 text-xs">
            <h3 class="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">1. Business Information</h3>
            <div>
              <label class="form-label font-bold text-slate-700">Store / Business Name *</label>
              <input type="text" [(ngModel)]="data.businessName" required placeholder="e.g. Apex Electronics India" class="form-input text-xs py-2.5 mt-1" />
            </div>
            <div>
              <label class="form-label font-bold text-slate-700">Business Type *</label>
              <select [(ngModel)]="data.businessType" class="form-select text-xs py-2.5 mt-1">
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Private Limited Company">Private Limited Company</option>
                <option value="Partnership / LLP">Partnership / LLP</option>
                <option value="Individual Seller">Individual Seller</option>
              </select>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label font-bold text-slate-700">GSTIN Number *</label>
                <input type="text" [(ngModel)]="data.gstin" required placeholder="22AAAAA0000A1Z5" class="form-input text-xs py-2.5 mt-1 uppercase font-mono" />
              </div>
              <div>
                <label class="form-label font-bold text-slate-700">PAN Number *</label>
                <input type="text" [(ngModel)]="data.pan" required placeholder="ABCDE1234F" class="form-input text-xs py-2.5 mt-1 uppercase font-mono" />
              </div>
            </div>
          </div>

          <!-- Step 2: Contact Details -->
          <div *ngIf="currentStep === 2" class="space-y-4 text-xs">
            <h3 class="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">2. Owner & Contact Information</h3>
            <div>
              <label class="form-label font-bold text-slate-700">Owner / Authorized Name *</label>
              <input type="text" [(ngModel)]="data.ownerName" required placeholder="Vikram Mehta" class="form-input text-xs py-2.5 mt-1" />
            </div>
            <div>
              <label class="form-label font-bold text-slate-700">Official Business Email *</label>
              <input type="email" [(ngModel)]="data.email" required placeholder="contact&#64;apexelectronics.in" class="form-input text-xs py-2.5 mt-1" />
            </div>
            <div>
              <label class="form-label font-bold text-slate-700">Mobile Phone Number (+91) *</label>
              <input type="tel" [(ngModel)]="data.phone" required placeholder="+91 98765 43210" class="form-input text-xs py-2.5 mt-1" />
            </div>
          </div>

          <!-- Step 3: Store Profile & Address -->
          <div *ngIf="currentStep === 3" class="space-y-4 text-xs">
            <h3 class="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">3. Registered Address & Store Description</h3>
            <div>
              <label class="form-label font-bold text-slate-700">Warehouse / Store Address *</label>
              <input type="text" [(ngModel)]="data.addressLine" required placeholder="Plot 45, Industrial Area Phase 2" class="form-input text-xs py-2.5 mt-1" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="form-label font-bold text-slate-700">City *</label>
                <input type="text" [(ngModel)]="data.city" required placeholder="Bengaluru" class="form-input text-xs py-2.5 mt-1" />
              </div>
              <div>
                <label class="form-label font-bold text-slate-700">State *</label>
                <input type="text" [(ngModel)]="data.state" required placeholder="Karnataka" class="form-input text-xs py-2.5 mt-1" />
              </div>
              <div>
                <label class="form-label font-bold text-slate-700">PIN Code *</label>
                <input type="text" [(ngModel)]="data.postalCode" required placeholder="560001" class="form-input text-xs py-2.5 mt-1 font-mono" />
              </div>
            </div>
            <div>
              <label class="form-label font-bold text-slate-700">Store Description</label>
              <textarea [(ngModel)]="data.description" rows="3" placeholder="Briefly describe your product catalog..." class="form-input text-xs mt-1"></textarea>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div *ngIf="currentStep === 4" class="space-y-4 text-xs">
            <h3 class="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">4. Review Application Details</h3>
            <div class="bg-slate-50 p-4 rounded-xl space-y-2 text-slate-700 border border-slate-200">
              <div class="flex justify-between"><span>Store Name:</span><strong class="text-slate-900">{{ data.businessName }}</strong></div>
              <div class="flex justify-between"><span>Business Type:</span><strong>{{ data.businessType }}</strong></div>
              <div class="flex justify-between"><span>GSTIN / PAN:</span><strong class="font-mono">{{ data.gstin }} / {{ data.pan }}</strong></div>
              <div class="flex justify-between"><span>Owner Name:</span><strong>{{ data.ownerName }}</strong></div>
              <div class="flex justify-between"><span>Contact Email:</span><strong>{{ data.email }}</strong></div>
              <div class="flex justify-between"><span>City / State:</span><strong>{{ data.city }}, {{ data.state }} ({{ data.postalCode }})</strong></div>
            </div>
            <label class="flex items-start gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" [(ngModel)]="data.acceptTerms" required class="mt-0.5 rounded border-slate-300 text-indigo-600" />
              <span>I certify that the GSTIN and business information provided are accurate.</span>
            </label>
          </div>

          <!-- Step 5: Submission Complete -->
          <div *ngIf="currentStep === 5" class="text-center py-6 space-y-4">
            <div class="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <app-icon name="check-circle" [size]="32"></app-icon>
            </div>
            <h3 class="font-extrabold text-slate-900 text-xl">Seller Application Submitted!</h3>
            <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your store <strong>{{ data.businessName }}</strong> has been registered with status <span class="badge badge-warning text-xs">PENDING APPROVAL</span>. Platform administrators will review your GSTIN document before activating full dispatch privileges.
            </p>
            <div class="pt-4">
              <button (click)="goToSellerDashboard()" class="btn btn-lg btn-primary font-bold px-6">
                Go to Seller Control Panel
              </button>
            </div>
          </div>

          <!-- Stepper Buttons -->
          <div *ngIf="currentStep < 5" class="flex items-center justify-between pt-4 border-t border-slate-100">
            <button *ngIf="currentStep > 1" (click)="prevStep()" class="btn btn-outline text-xs">Previous</button>
            <div *ngIf="currentStep === 1"></div>

            <button *ngIf="currentStep < 4" (click)="nextStep()" class="btn btn-primary text-xs font-bold">Continue</button>
            <button *ngIf="currentStep === 4" (click)="submitOnboarding()" [disabled]="isLoading" class="btn btn-primary text-xs font-bold">
              {{ isLoading ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SellerOnboardingComponent {
  currentStep = 1;
  isLoading = false;
  errorMessage: string | null = null;

  data: SellerRegisterData = {
    businessName: 'Apex Electronics India',
    ownerName: 'Vikram Mehta',
    email: 'contact@apexelectronics.in',
    phone: '+91 98765 43210',
    businessType: 'Private Limited Company',
    gstin: '29AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    addressLine: 'Plot 45, Electronics City',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
    description: 'Premier supplier of authentic wireless audio, consumer electronics and gadgets.',
    acceptTerms: true,
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Business Details';
      case 2: return 'Contact';
      case 3: return 'Store Profile';
      case 4: return 'Review';
      case 5: return 'Complete';
      default: return '';
    }
  }

  nextStep(): void {
    this.errorMessage = null;
    if (this.currentStep === 1 && (!this.data.businessName || !this.data.gstin || !this.data.pan)) {
      this.errorMessage = 'Please complete all required business information fields.';
      return;
    }
    if (this.currentStep === 2 && (!this.data.ownerName || !this.data.email || !this.data.phone)) {
      this.errorMessage = 'Please complete contact details.';
      return;
    }
    if (this.currentStep === 3 && (!this.data.addressLine || !this.data.city || !this.data.postalCode)) {
      this.errorMessage = 'Please complete store address.';
      return;
    }
    this.currentStep++;
  }

  prevStep(): void {
    this.errorMessage = null;
    if (this.currentStep > 1) this.currentStep--;
  }

  submitOnboarding(): void {
    if (!this.data.acceptTerms) {
      this.errorMessage = 'Please accept the declaration terms.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.registerSeller(this.data).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 5;
        this.toastService.success('Seller store onboarded successfully!');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Onboarding submission failed.';
      },
    });
  }

  goToSellerDashboard(): void {
    this.router.navigate(['/seller/dashboard']);
  }
}
