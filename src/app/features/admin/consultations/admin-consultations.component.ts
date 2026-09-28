import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

@Component({
  selector: 'app-admin-consultations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent, PaginationComponent],
  template: `
    <div class="space-y-6 pb-16">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Admin Console</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933]">Tele-Consultations & Appointments Audit</h1>
          <p class="text-xs text-[#64748B] mt-1">Global audit log of doctor-patient tele-health bookings across the marketplace.</p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white p-5 rounded-3xl border border-[#DDE7DF] shadow-xs space-y-4 text-xs">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="applyFilters()"
              placeholder="Search reference, doctor name, patient name..."
              class="w-full pl-9 pr-3 py-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl text-xs focus:outline-none focus:border-[#2F6B4F]"
            />
            <app-icon name="search" [size]="16" customClass="absolute left-3 top-2.5 text-[#64748B]"></app-icon>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-bold text-[#1F2933]">Status:</span>
            <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="p-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl font-medium">
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="RESCHEDULE_REQUESTED">RESCHEDULE_REQUESTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Appointments Table -->
      <div class="bg-white rounded-3xl border border-[#DDE7DF] shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] text-[#1F2933] font-bold">
              <tr>
                <th class="p-4">Booking Ref</th>
                <th class="p-4">Doctor</th>
                <th class="p-4">Patient Customer</th>
                <th class="p-4">Slot Date & Time</th>
                <th class="p-4">Mode</th>
                <th class="p-4">Fee & Payment</th>
                <th class="p-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
              <tr *ngFor="let apt of paginatedAppointments" class="hover:bg-[#F8FAF7]">
                <td class="p-4 font-mono font-bold text-[#2F6B4F]">{{ apt.bookingReference }}</td>
                <td class="p-4 font-bold text-[#1F2933]">{{ apt.doctorName }}</td>
                <td class="p-4 font-medium text-[#1F2933]">{{ apt.customerName }}</td>
                <td class="p-4">{{ apt.appointmentDate }} at {{ apt.startTime }}</td>
                <td class="p-4 font-semibold text-[#2F6B4F]">{{ getModeLabel(apt.consultationType) }}</td>
                <td class="p-4">
                  <span class="font-extrabold text-[#1F2933] block">{{ formatInr(apt.feeInINR) }}</span>
                  <span class="text-[10px] text-[#2E7D32] font-bold uppercase">{{ apt.paymentStatus }}</span>
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(apt.status)">
                    {{ apt.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="filteredAppointments.length === 0">
                <td colspan="7" class="text-center py-8 text-[#64748B]">No tele-consultations found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t border-[#DDE7DF]">
          <app-pagination
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            [totalItems]="filteredAppointments.length"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
  `,
})
export class AdminConsultationsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  paginatedAppointments: Appointment[] = [];

  searchQuery = '';
  statusFilter = 'ALL';
  formatInr = formatInr;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAllAppointments().subscribe((res) => {
      this.appointments = res;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let result = [...this.appointments];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.bookingReference.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.customerName.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter !== 'ALL') {
      result = result.filter((a) => a.status === this.statusFilter);
    }

    this.filteredAppointments = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedAppointments = this.filteredAppointments.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'VIDEO':
        return 'HD Video';
      case 'AUDIO':
        return 'Audio Call';
      case 'IN_PERSON':
        return 'In-Clinic';
      case 'FOLLOW_UP':
        return 'Follow-up';
      default:
        return mode;
    }
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-[#EAF4EC] text-[#2E7D32] border border-[#2E7D32]/30';
      case 'PENDING':
        return 'bg-[#FFFDF5] text-[#B7791F] border border-[#B7791F]/30';
      case 'RESCHEDULE_REQUESTED':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
