import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrescriptionService } from '../../../../core/services/prescription.service';
import { Prescription } from '../../../../core/models/prescription.model';
import { AppIconComponent } from '../../../../shared/components/app-icon.component';

@Component({
  selector: 'app-prescriptions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-8 pb-16">
      <!-- Breadcrumbs & Header -->
      <div class="space-y-4">
        <nav class="flex items-center gap-2 text-xs text-[#64748B]">
          <a routerLink="/" class="hover:text-[#2F6B4F]">Home</a> /
          <a routerLink="/account" class="hover:text-[#2F6B4F]">Account</a> /
          <span class="text-[#1F2933] font-medium">Digital Prescriptions</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
          <div>
            <h1 class="text-2xl font-extrabold text-[#1F2933] tracking-tight">My Digital Prescriptions Vault</h1>
            <p class="text-xs text-[#64748B] mt-1">Access verified digital prescriptions issued by your Ayurveda doctors.</p>
          </div>

          <div class="px-3.5 py-1.5 bg-[#EAF4EC] border border-[#2E7D32]/30 rounded-xl text-xs text-[#2E7D32] font-bold flex items-center gap-1.5 shrink-0">
            <app-icon name="shield" [size]="16"></app-icon> Confidential Medical Vault
          </div>
        </div>
      </div>

      <!-- Prescriptions List -->
      <div *ngIf="prescriptions.length > 0; else noPrescriptions" class="space-y-6">
        <div
          *ngFor="let rx of prescriptions"
          class="bg-white rounded-3xl border border-[#DDE7DF] p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <!-- Rx Card Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE7DF] pb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-extrabold text-[#1F2933] text-lg">{{ rx.doctorName }}</span>
                <span class="text-xs font-bold text-[#2F6B4F] bg-[#EAF4EC] px-2.5 py-0.5 rounded-full">{{ rx.doctorQualification }}</span>
              </div>
              <p class="text-xs text-[#64748B]">
                Reg License: <strong class="text-[#1F2933] font-mono">{{ rx.doctorRegistrationNumber }}</strong> &bull; Date: {{ rx.prescriptionDate }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span *ngIf="rx.isDemo" class="text-[10px] text-[#B7791F] bg-[#FFFDF5] border border-[#C69A45]/30 px-2.5 py-1 rounded-lg font-semibold">
                [Demo Medical Record]
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(rx.status)">
                {{ rx.status }}
              </span>
            </div>
          </div>

          <!-- Prescribed Herbal Items Table -->
          <div class="space-y-3">
            <h4 class="font-extrabold text-sm text-[#1F2933] flex items-center gap-2 text-[#2F6B4F]">
              <app-icon name="package" [size]="18"></app-icon> Prescribed Herbal Formulations
            </h4>

            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] text-[#1F2933] font-bold">
                  <tr>
                    <th class="p-3">Formulation Name</th>
                    <th class="p-3">Dosage</th>
                    <th class="p-3">Frequency</th>
                    <th class="p-3">Vehicle (Anupana)</th>
                    <th class="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let item of rx.items" class="hover:bg-[#F8FAF7]">
                    <td class="p-3 font-bold text-[#1F2933]">
                      <a *ngIf="item.productId" [routerLink]="['/products', item.productId]" class="hover:text-[#2F6B4F] underline decoration-dotted">
                        {{ item.productName }} ↗
                      </a>
                      <span *ngIf="!item.productId">{{ item.productName }}</span>
                    </td>
                    <td class="p-3 font-medium text-[#1F2933]">{{ item.dosage }}</td>
                    <td class="p-3">{{ item.frequency }}</td>
                    <td class="p-3 text-[#2F6B4F] font-semibold">{{ item.vehicle || 'Warm Water' }}</td>
                    <td class="p-3 font-bold text-[#1F2933]">{{ item.duration }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Doctor Lifestyle & Dietary Advice -->
          <div *ngIf="rx.instructions" class="p-4 bg-[#F8FAF7] rounded-2xl border border-[#DDE7DF] space-y-1.5 text-xs">
            <h4 class="font-bold text-[#1F2933] text-xs flex items-center gap-1.5">
              <app-icon name="sparkles" [size]="14" customClass="text-[#2F6B4F]"></app-icon> Doctor Dietary & Lifestyle Guidance (Dinacharya):
            </h4>
            <p class="text-[#64748B] leading-relaxed font-medium">
              {{ rx.instructions }}
            </p>
          </div>

          <!-- Rx Actions -->
          <div class="pt-3 border-t border-[#DDE7DF] flex items-center justify-between flex-wrap gap-3 text-xs">
            <span class="text-[#64748B]">Linked Appointment Ref: <strong class="font-mono text-[#1F2933]">{{ rx.appointmentReference || rx.appointmentId }}</strong></span>

            <div class="flex items-center gap-2">
              <a [routerLink]="['/products']" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs">
                <app-icon name="shopping-cart" [size]="14"></app-icon> Order Prescribed Products
              </a>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noPrescriptions>
        <div class="bg-white p-12 rounded-3xl border border-[#DDE7DF] text-center space-y-3">
          <h3 class="text-base font-extrabold text-[#1F2933]">No Digital Prescriptions Found</h3>
          <p class="text-xs text-[#64748B]">You currently have no prescriptions issued in your account vault.</p>
          <a routerLink="/consultation/doctors" class="btn btn-sm bg-[#2F6B4F] text-white font-bold rounded-xl px-5">
            Consult an Ayurveda Doctor
          </a>
        </div>
      </ng-template>
    </div>
  `,
})
export class PrescriptionsListComponent implements OnInit {
  prescriptions: Prescription[] = [];

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.prescriptionService.getPrescriptionsForCustomer().subscribe((res) => {
      this.prescriptions = res;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30';
      case 'FULFILLED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
