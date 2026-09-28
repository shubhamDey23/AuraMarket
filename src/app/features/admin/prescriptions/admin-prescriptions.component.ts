import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { Prescription } from '../../../core/models/prescription.model';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

@Component({
  selector: 'app-admin-prescriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-6 pb-16">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Admin Console</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933]">Prescription & Rx Verification Audit</h1>
          <p class="text-xs text-[#64748B] mt-1">Review uploaded customer doctor prescriptions and digital Rx memos for prescription-restricted products.</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-[#DDE7DF] shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] text-[#1F2933] font-bold">
              <tr>
                <th class="p-4">Rx Ref</th>
                <th class="p-4">Customer ID</th>
                <th class="p-4">Issuing Doctor</th>
                <th class="p-4">Prescription Date</th>
                <th class="p-4">Document Ref</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Pharmacist Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
              <tr *ngFor="let rx of prescriptions" class="hover:bg-[#F8FAF7]">
                <td class="p-4 font-mono font-bold text-[#2F6B4F]">{{ rx.id }}</td>
                <td class="p-4 font-medium text-[#1F2933]">{{ rx.customerId }}</td>
                <td class="p-4 font-bold text-[#1F2933]">{{ rx.doctorName }}</td>
                <td class="p-4">{{ rx.prescriptionDate }}</td>
                <td class="p-4 font-mono text-[#2F6B4F]">{{ rx.documentReference || 'Attached Upload' }}</td>
                <td class="p-4">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" [ngClass]="rx.status === 'ACTIVE' ? 'bg-[#EAF4EC] text-[#2E7D32]' : 'bg-gray-100 text-gray-700'">
                    {{ rx.status }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button (click)="verifyRx(rx)" class="btn btn-xs bg-[#2F6B4F] text-white font-bold px-3 py-1 rounded-lg">
                    Verify Rx
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminPrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];

  constructor(
    private prescriptionService: PrescriptionService,
    private activityLogService: ActivityLogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.prescriptionService.getPrescriptionsForCustomer('cust-1').subscribe((res) => {
      this.prescriptions = res;
    });
  }

  verifyRx(rx: Prescription): void {
    this.toastService.success(`Prescription ${rx.id} verified by licensed admin pharmacist.`, 'Rx Verified');
    this.activityLogService.logActivity(
      'PRESCRIPTION_VERIFIED',
      'USER',
      rx.id,
      `Verified prescription document issued by "${rx.doctorName}".`
    );
  }
}
