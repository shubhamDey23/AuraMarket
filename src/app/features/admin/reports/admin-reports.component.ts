import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ProductService } from '../../../core/services/product.service';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { formatInr } from '../../../core/utils/currency.util';

export type AdminReportType = 
  | 'product-sales' 
  | 'consultations' 
  | 'seller-perf' 
  | 'doctor-activity' 
  | 'returns' 
  | 'cancelled-apts' 
  | 'product-approvals';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatCardComponent],
  template: `
    <div class="space-y-8 pb-16">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DDE7DF] shadow-xs">
        <div>
          <span class="text-xs font-extrabold text-[#2F6B4F] uppercase tracking-wider">Admin Intelligence</span>
          <h1 class="text-2xl font-extrabold text-[#1F2933]">Marketplace Health & Financial Analytics</h1>
          <p class="text-xs text-[#64748B] mt-1">Cross-vendor sales, doctor consultations, returns, and compliance metrics.</p>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <label class="text-[#64748B] font-bold">Window:</label>
          <select [(ngModel)]="dateRange" class="p-2 bg-[#F8FAF7] border border-[#DDE7DF] rounded-xl font-bold">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
          </select>
        </div>
      </div>

      <!-- KPI Summary Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          title="Product Sales GMV"
          [value]="formatInr(totalSales)"
          change="+24.8%"
          [isPositive]="true"
          icon="indian-rupee"
          iconBgClass="bg-[#EAF4EC] text-[#2F6B4F]"
        ></app-stat-card>

        <app-stat-card
          title="Consultation Revenue"
          [value]="formatInr(consultationRevenue)"
          change="+18.2%"
          [isPositive]="true"
          icon="calendar"
          iconBgClass="bg-[#FFFDF5] text-[#B7791F]"
        ></app-stat-card>

        <app-stat-card
          title="Active Doctors"
          [value]="activeDoctorsCount"
          icon="user-check"
          iconBgClass="bg-[#EAF4EC] text-[#2E7D32]"
        ></app-stat-card>

        <app-stat-card
          title="Product Listings Approved"
          [value]="approvedProductsCount"
          icon="package"
          iconBgClass="bg-[#F8FAF7] text-[#1F2933]"
        ></app-stat-card>
      </div>

      <!-- 7 Interactive Report Tabs Navigation -->
      <div class="bg-white rounded-3xl border border-[#DDE7DF] shadow-xs overflow-hidden">
        <div class="flex items-center gap-1 overflow-x-auto border-b border-[#DDE7DF] bg-[#F8FAF7] p-2 no-scrollbar">
          <button
            *ngFor="let tab of reportTabs"
            (click)="activeReport = tab.id"
            class="px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0"
            [ngClass]="activeReport === tab.id ? 'bg-white text-[#2F6B4F] shadow-xs border border-[#DDE7DF]' : 'text-[#64748B] hover:bg-white/50'"
          >
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <div class="p-6 text-xs text-[#1F2933]">
          <!-- Report 1: Product Sales Report -->
          <div *ngIf="activeReport === 'product-sales'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">1. Product Sales GMV Breakdown</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Product Name</th>
                    <th class="p-3">Category</th>
                    <th class="p-3">Units Sold</th>
                    <th class="p-3">Gross Sales (₹)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of salesReportRows">
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.name }}</td>
                    <td class="p-3">{{ row.category }}</td>
                    <td class="p-3 font-bold">{{ row.units }}</td>
                    <td class="p-3 font-extrabold text-[#2F6B4F]">{{ formatInr(row.sales) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 2: Consultation Bookings Report -->
          <div *ngIf="activeReport === 'consultations'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">2. Consultation Bookings Report</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Practitioner</th>
                    <th class="p-3">Specialization</th>
                    <th class="p-3">Bookings Count</th>
                    <th class="p-3">Consultation Fee Volume (₹)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of consultationReportRows">
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.doctorName }}</td>
                    <td class="p-3">{{ row.spec }}</td>
                    <td class="p-3 font-bold">{{ row.count }}</td>
                    <td class="p-3 font-extrabold text-[#2F6B4F]">{{ formatInr(row.volume) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 3: Seller Performance Report -->
          <div *ngIf="activeReport === 'seller-perf'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">3. Seller Pharmacy Performance</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Store Name</th>
                    <th class="p-3">Active Listings</th>
                    <th class="p-3">Orders Handled</th>
                    <th class="p-3">Gross Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of sellerPerfRows">
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.storeName }}</td>
                    <td class="p-3">{{ row.activeCount }}</td>
                    <td class="p-3 font-bold">{{ row.orders }}</td>
                    <td class="p-3 font-extrabold text-[#2F6B4F]">{{ formatInr(row.revenue) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 4: Doctor Activity Report -->
          <div *ngIf="activeReport === 'doctor-activity'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">4. Doctor Tele-Health Activity Audit</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Doctor Name</th>
                    <th class="p-3">License Reg No</th>
                    <th class="p-3">Completed Sessions</th>
                    <th class="p-3">Rating</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of doctorActivityRows">
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.name }}</td>
                    <td class="p-3 font-mono text-xs">{{ row.regNo }}</td>
                    <td class="p-3 font-bold text-[#2F6B4F]">{{ row.completed }}</td>
                    <td class="p-3 font-extrabold text-[#C69A45]">★ {{ row.rating }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 5: Returns Report -->
          <div *ngIf="activeReport === 'returns'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">5. Product Returns & Exchanges Report</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Return Ref</th>
                    <th class="p-3">Product Name</th>
                    <th class="p-3">Reason</th>
                    <th class="p-3">Refund Amount (₹)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of returnsRows">
                    <td class="p-3 font-mono font-bold text-[#1F2933]">{{ row.ref }}</td>
                    <td class="p-3 font-medium text-[#1F2933]">{{ row.product }}</td>
                    <td class="p-3">{{ row.reason }}</td>
                    <td class="p-3 font-extrabold text-[#C62828]">{{ formatInr(row.refund) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 6: Cancelled Appointments Report -->
          <div *ngIf="activeReport === 'cancelled-apts'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">6. Cancelled Appointments Report</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Booking Ref</th>
                    <th class="p-3">Doctor</th>
                    <th class="p-3">Cancellation Reason</th>
                    <th class="p-3">Refund Amount (₹)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of cancelledAptRows">
                    <td class="p-3 font-mono font-bold text-[#1F2933]">{{ row.ref }}</td>
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.doctor }}</td>
                    <td class="p-3">{{ row.reason }}</td>
                    <td class="p-3 font-extrabold text-red-600">{{ formatInr(row.refund) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report 7: Product Approval Status Report -->
          <div *ngIf="activeReport === 'product-approvals'" class="space-y-4">
            <h3 class="font-extrabold text-sm text-[#1F2933]">7. Product Approval Status Report</h3>
            <div class="overflow-x-auto rounded-2xl border border-[#DDE7DF]">
              <table class="w-full text-left">
                <thead class="bg-[#F8FAF7] border-b border-[#DDE7DF] font-bold">
                  <tr>
                    <th class="p-3">Product Name</th>
                    <th class="p-3">Seller Store</th>
                    <th class="p-3">License Info</th>
                    <th class="p-3">Approval Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DDE7DF] text-[#64748B]">
                  <tr *ngFor="let row of productApprovalRows">
                    <td class="p-3 font-bold text-[#1F2933]">{{ row.name }}</td>
                    <td class="p-3">{{ row.seller }}</td>
                    <td class="p-3 font-mono text-xs">{{ row.lic }}</td>
                    <td class="p-3">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" [ngClass]="row.status === 'APPROVED' ? 'bg-[#EAF4EC] text-[#2E7D32]' : 'bg-[#FFFDF5] text-[#B7791F]'">
                        {{ row.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminReportsComponent implements OnInit {
  formatInr = formatInr;
  dateRange = '30d';

  totalSales = 2450000;
  consultationRevenue = 184500;
  activeDoctorsCount = 5;
  approvedProductsCount = 12;

  activeReport: AdminReportType = 'product-sales';

  reportTabs: { id: AdminReportType; label: string }[] = [
    { id: 'product-sales', label: '1. Product Sales' },
    { id: 'consultations', label: '2. Consultation Bookings' },
    { id: 'seller-perf', label: '3. Seller Performance' },
    { id: 'doctor-activity', label: '4. Doctor Activity' },
    { id: 'returns', label: '5. Returns' },
    { id: 'cancelled-apts', label: '6. Cancelled Appointments' },
    { id: 'product-approvals', label: '7. Product Approvals' },
  ];

  salesReportRows = [
    { name: 'Chyawanprash Special (500g)', category: 'Ayurvedic Medicines', units: 480, sales: 189600 },
    { name: 'Kumkumadi Beauty Fluid (12ml)', category: 'Personal Care', units: 320, sales: 958400 },
    { name: 'Triphala Churna Organic Detox', category: 'Ayurvedic Medicines', units: 620, sales: 89900 },
    { name: 'Pure Ashwagandha Gold Capsules', category: 'Nutrition', units: 410, sales: 204590 },
  ];

  consultationReportRows = [
    { doctorName: 'Dr. Ananya Sharma', spec: 'Kayachikitsa', count: 84, volume: 58716 },
    { doctorName: 'Vaidya Rajeshwar Bhatt', spec: 'Dravyaguna', count: 62, volume: 55738 },
    { doctorName: 'Dr. Meera Nambiar', spec: 'Stri Roga', count: 75, volume: 44925 },
  ];

  sellerPerfRows = [
    { storeName: 'Kottakkal Arya Vaidya Sala Demo', activeCount: 6, orders: 420, revenue: 890000 },
    { storeName: 'Kama Ayurveda Demo Store', activeCount: 4, orders: 310, revenue: 1120000 },
  ];

  doctorActivityRows = [
    { name: 'Dr. Ananya Sharma', regNo: 'NCISM/AYU/2014/9841', completed: 84, rating: 4.9 },
    { name: 'Vaidya Rajeshwar Bhatt', regNo: 'GAU/AYU/2004/3142', completed: 62, rating: 4.8 },
  ];

  returnsRows = [
    { ref: 'RET-8941', product: 'Ashwagandha Ghan Vati', reason: 'Damaged outer seal', refund: 299 },
  ];

  cancelledAptRows = [
    { ref: 'AYU-APT-789105', doctor: 'Vaidya Hariprasad Varma', reason: 'Patient travel delay', refund: 750 },
  ];

  productApprovalRows = [
    { name: 'Ashwagandha Ghan Vati', seller: 'Kottakkal Arya Vaidya Sala', lic: 'Lic No KTK/AYU-2022', status: 'APPROVED' },
    { name: 'Kanakasava Liquid', seller: 'Kottakkal Arya Vaidya Sala', lic: 'Lic No KTK/AYU-2022', status: 'APPROVED' },
  ];

  constructor(
    private orderService: OrderService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {}
}
