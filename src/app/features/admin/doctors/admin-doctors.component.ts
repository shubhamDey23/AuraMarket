import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { ToastService } from '../../../core/services/toast.service';
import { Doctor } from '../../../core/models/doctor.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6 pb-16">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Admin Console</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933]">Ayurveda Doctor Verification & Moderation</h1>
          <p class="text-xs text-[#64748B] mt-1">Review practitioner applications, verify NCISM/CCIM license credentials, and manage doctor panel status.</p>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white p-5 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-4 text-xs">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="applyFilters()"
              placeholder="Search doctor name, registration no, degree..."
              class="w-full pl-9 pr-3 py-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs focus:outline-none focus:border-[#2F6B4F]"
            />
            <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-[#64748B]"></app-icon>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="font-bold text-[#1F2933]">Verification Status:</span>
              <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="p-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl font-medium">
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">VERIFIED (Approved)</option>
                <option value="PENDING">PENDING (Application Received)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctors Moderation Table -->
      <div class="bg-white rounded-3xl border border-[#DDE7DF] shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] text-[#1F2933] font-bold">
              <tr>
                <th class="p-4">Practitioner Details</th>
                <th class="p-4">Qualifications & Experience</th>
                <th class="p-4">Registration Authority & License</th>
                <th class="p-4">Fee (₹)</th>
                <th class="p-4">Verification Status</th>
                <th class="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
              <tr *ngFor="let doc of paginatedDoctors" class="hover:bg-[#F8FAF7]">
                <!-- Doctor Info -->
                <td class="p-4 font-bold text-[#1F2933]">
                  <div class="flex items-center gap-3">
                    <img [src]="doc.profileImage" class="w-11 h-11 rounded-xl object-cover border border-[#DDE7DF] shrink-0" />
                    <div>
                      <span class="font-extrabold text-[#1F2933] block text-sm">{{ doc.name }}</span>
                      <span class="text-[11px] text-[#64748B] font-normal">{{ doc.languages.join(', ') }}</span>
                    </div>
                  </div>
                </td>

                <!-- Qualifications -->
                <td class="p-4">
                  <span class="font-bold text-[#2F6B4F] block">{{ doc.qualification }}</span>
                  <span class="text-[11px] text-[#64748B]">{{ doc.yearsOfExperience }} Years Experience</span>
                </td>

                <!-- Registration -->
                <td class="p-4">
                  <span class="font-mono font-bold text-[#1F2933] bg-[#F8FAF7] px-2 py-0.5 rounded border border-[#DDE7DF] block w-fit mb-0.5">
                    {{ doc.registrationNumber }}
                  </span>
                  <span class="text-[10px] text-[#64748B] block truncate max-w-[200px]">{{ doc.registrationAuthority }}</span>
                </td>

                <!-- Fee -->
                <td class="p-4 font-extrabold text-[#1F2933]">
                  {{ formatInr(doc.consultationFeeInINR) }}
                </td>

                <!-- Verification Status -->
                <td class="p-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="{
                      'bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30': doc.verificationStatus === 'VERIFIED',
                      'bg-[#FFFDF5] text-[#B7791F] border border-[#B7791F]/30': doc.verificationStatus === 'PENDING',
                      'bg-red-50 text-red-600 border border-red-200': doc.verificationStatus === 'REJECTED'
                    }"
                  >
                    {{ doc.verificationStatus }}
                  </span>
                  <span *ngIf="doc.profileStatus === 'INACTIVE'" class="block text-[10px] text-red-500 font-bold mt-0.5">
                    [SUSPENDED]
                  </span>
                </td>

                <!-- Actions -->
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      *ngIf="doc.verificationStatus !== 'VERIFIED'"
                      (click)="approveDoctor(doc)"
                      class="btn btn-xs bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold px-2.5 py-1 rounded-lg"
                      title="Approve & Mark Verified"
                    >
                      Approve
                    </button>

                    <button
                      *ngIf="doc.verificationStatus === 'VERIFIED'"
                      (click)="suspendDoctor(doc)"
                      class="btn btn-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg"
                      title="Suspend Practitioner"
                    >
                      Suspend
                    </button>

                    <button
                      *ngIf="doc.verificationStatus !== 'REJECTED'"
                      (click)="rejectDoctor(doc)"
                      class="btn btn-xs bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg"
                      title="Reject Application"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredDoctors.length === 0">
                <td colspan="6" class="text-center py-8 text-[#64748B]">No doctor applications found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Universal Pagination -->
        <div class="p-4 border-t border-[#DDE7DF]">
          <app-pagination
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            [totalItems]="filteredDoctors.length"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
  `,
})
export class AdminDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  paginatedDoctors: Doctor[] = [];

  searchQuery = '';
  statusFilter = 'ALL';
  formatInr = formatInr;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private doctorService: DoctorService,
    private activityLogService: ActivityLogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe((res) => {
      this.doctors = res;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let result = [...this.doctors];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.registrationNumber.toLowerCase().includes(q) ||
          d.qualification.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter !== 'ALL') {
      result = result.filter((d) => d.verificationStatus === this.statusFilter);
    }

    this.filteredDoctors = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedDoctors = this.filteredDoctors.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  approveDoctor(doc: Doctor): void {
    doc.verificationStatus = 'VERIFIED';
    doc.profileStatus = 'ACTIVE';
    this.toastService.success(`Practitioner ${doc.name} approved & verified!`, 'Doctor Approved');
    this.activityLogService.logActivity(
      'DOCTOR_APPROVED',
      'USER',
      doc.id,
      `Approved license credentials & marked "${doc.name}" as Verified Ayurveda Specialist.`
    );
    this.applyFilters();
  }

  suspendDoctor(doc: Doctor): void {
    doc.profileStatus = 'INACTIVE';
    this.toastService.warning(`Practitioner ${doc.name} profile suspended.`, 'Doctor Suspended');
    this.activityLogService.logActivity(
      'DOCTOR_SUSPENDED',
      'USER',
      doc.id,
      `Suspended practitioner profile for "${doc.name}".`
    );
    this.applyFilters();
  }

  rejectDoctor(doc: Doctor): void {
    doc.verificationStatus = 'REJECTED';
    doc.profileStatus = 'INACTIVE';
    this.toastService.info(`Application for ${doc.name} rejected.`);
    this.activityLogService.logActivity(
      'DOCTOR_REJECTED',
      'USER',
      doc.id,
      `Rejected practitioner application for "${doc.name}".`
    );
    this.applyFilters();
  }
}
