import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { InventoryItem, InventoryTransaction, StockTransactionType } from '../../../core/models/inventory.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { InventoryStatusBadgeComponent } from '../../../shared/components/inventory-status-badge.component';

@Component({
  selector: 'app-admin-inventory-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppIconComponent,
    InventoryStatusBadgeComponent,
  ],
  template: `
    <div class="container space-y-6 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/admin/dashboard" class="hover:text-indigo-600">Admin Console</a> /
        <a routerLink="/admin/inventory" class="hover:text-indigo-600">Global Inventory</a> /
        <span class="text-slate-800 font-medium">Controlled Inventory Audit</span>
      </nav>

      <div *ngIf="inventoryItem" class="space-y-6">
        <!-- Overview Header Card -->
        <div class="card p-6 sm:p-8 bg-white space-y-6 border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 class="text-2xl font-extrabold text-slate-900">{{ inventoryItem.productName }}</h1>
              <p class="text-xs text-slate-500 mt-1">
                Seller: <strong>{{ inventoryItem.sellerName }}</strong> (ID: <span class="font-mono">{{ inventoryItem.sellerId }}</span>) • SKU: <span class="font-mono uppercase font-bold">{{ inventoryItem.sku }}</span>
              </p>
            </div>
            <app-inventory-status-badge [status]="inventoryItem.status"></app-inventory-status-badge>
          </div>

          <!-- Stock Numbers -->
          <div class="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <div class="text-slate-500 text-[11px]">Available Stock</div>
              <div class="text-xl font-extrabold text-slate-900 mt-0.5">{{ inventoryItem.availableQuantity }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Reserved Stock</div>
              <div class="text-xl font-extrabold text-indigo-600 mt-0.5">{{ inventoryItem.reservedQuantity }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Damaged Stock</div>
              <div class="text-xl font-extrabold text-red-600 mt-0.5">{{ inventoryItem.damagedQuantity }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Reorder Level</div>
              <div class="text-xl font-extrabold text-slate-700 mt-0.5">{{ inventoryItem.reorderLevel }}</div>
            </div>
          </div>
        </div>

        <!-- Controlled Admin Adjustment Card -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <app-icon name="edit" [size]="16" customClass="text-indigo-600"></app-icon> Controlled Admin Stock Correction
          </h3>
          <p class="text-xs text-slate-500">
            Admin inventory adjustments do not silently mutate stock. Every correction creates a logged transaction ledger entry and records an Admin Audit action.
          </p>

          <form [formGroup]="adjustForm" (ngSubmit)="onSubmitAdjustment()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Adjustment Direction *</label>
                <select formControlName="direction" class="form-select">
                  <option value="ADD">Add Stock (+)</option>
                  <option value="REMOVE">Remove Stock (-)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Adjustment Reason *</label>
                <select formControlName="transactionType" class="form-select">
                  <option value="MANUAL_ADJUSTMENT">Admin Warehouse Audit Correction</option>
                  <option value="STOCK_RECEIVED">Stock Received (Verified PO)</option>
                  <option value="DAMAGED">Damaged / Expired Item Clearance</option>
                  <option value="STOCK_TRANSFER">Stock Transfer Between Hubs</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Quantity Delta *</label>
                <input type="number" formControlName="quantity" class="form-input" placeholder="e.g. 10" />
              </div>

              <div class="form-group">
                <label class="form-label">Audit Reference Code</label>
                <input type="text" formControlName="reference" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Admin Reason / Audit Notes *</label>
              <textarea formControlName="notes" class="form-textarea" rows="2" placeholder="Required audit justification for modifying seller inventory..."></textarea>
              <div *ngIf="adjustForm.get('notes')?.invalid && adjustForm.get('notes')?.touched" class="text-red-500 text-[11px] mt-1">
                Audit justification notes are required for administrative stock changes.
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" [disabled]="adjustForm.invalid" class="btn btn-primary disabled:opacity-50">
                Apply Controlled Audit Adjustment
              </button>
            </div>
          </form>
        </div>

        <!-- Inventory History Ledger -->
        <div class="card p-6 bg-white space-y-4 border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Item Transaction History Ledger ({{ transactions.length }})</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Transaction Type</th>
                  <th>Quantity Change</th>
                  <th>Stock Delta</th>
                  <th>Reference</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let tx of transactions">
                  <td class="text-xs text-slate-500">{{ tx.createdAt | date:'medium' }}</td>
                  <td><span class="badge badge-neutral text-[10px]">{{ tx.type }}</span></td>
                  <td class="font-extrabold text-xs" [ngClass]="tx.quantityChange >= 0 ? 'text-emerald-600' : 'text-red-600'">
                    {{ tx.quantityChange >= 0 ? '+' + tx.quantityChange : tx.quantityChange }}
                  </td>
                  <td class="text-xs font-semibold text-slate-700">{{ tx.previousQuantity }} → {{ tx.newQuantity }}</td>
                  <td class="font-mono text-xs text-slate-600">{{ tx.reference }}</td>
                  <td class="text-xs text-slate-500">{{ tx.performedBy }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminInventoryDetailComponent implements OnInit {
  inventoryItemId: string | null = null;
  inventoryItem: InventoryItem | null = null;
  transactions: InventoryTransaction[] = [];
  adjustForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.inventoryItemId = this.route.snapshot.paramMap.get('id');

    this.adjustForm = new FormGroup({
      direction: new FormControl('ADD', [Validators.required]),
      transactionType: new FormControl<StockTransactionType>('MANUAL_ADJUSTMENT', [Validators.required]),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      reference: new FormControl(`ADMIN-AUDIT-${Date.now().toString().slice(-4)}`),
      notes: new FormControl('', [Validators.required]),
    });

    if (this.inventoryItemId) {
      this.loadItemData(this.inventoryItemId);
    }
  }

  loadItemData(id: string): void {
    this.inventoryService.getInventory().subscribe((items) => {
      const item = items.find((i) => i.id === id || i.productId === id);
      if (item) {
        this.inventoryItem = item;
        this.inventoryService.getTransactions(item.sellerId).subscribe((txs) => {
          this.transactions = txs.filter((t) => t.inventoryItemId === item.id);
        });
      }
    });
  }

  onSubmitAdjustment(): void {
    if (this.adjustForm.invalid || !this.inventoryItem) return;

    const val = this.adjustForm.value;
    const change = val.direction === 'ADD' ? Number(val.quantity) : -Number(val.quantity);

    if (val.direction === 'REMOVE' && Number(val.quantity) > this.inventoryItem.availableQuantity) {
      this.toastService.error(`Cannot remove ${val.quantity} units. Available stock is only ${this.inventoryItem.availableQuantity}.`);
      return;
    }

    this.inventoryService
      .updateStock(
        this.inventoryItem.id,
        change,
        val.transactionType,
        val.reference || 'ADMIN-AUDIT',
        'Eleanor Vance (Marketplace Admin)',
        val.notes
      )
      .subscribe((updated) => {
        if (updated) {
          this.inventoryItem = updated;
          this.toastService.success(`Controlled stock adjustment recorded! New quantity is ${updated.availableQuantity}.`);
          this.activityLogService.logActivity(
            'INVENTORY_AUDIT_ADJUSTED',
            'INVENTORY',
            updated.id,
            `Admin adjusted inventory for "${updated.productName}" (Seller: ${updated.sellerName}) by ${change >= 0 ? '+' : ''}${change} units. Reason: ${val.notes}`
          );
          this.loadItemData(updated.id);
        }
      });
  }
}
