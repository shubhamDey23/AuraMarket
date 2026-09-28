import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { InventoryItem, StockTransactionType } from '../../../core/models/inventory.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { InventoryStatusBadgeComponent } from '../../../shared/components/inventory-status-badge.component';

@Component({
  selector: 'app-seller-inventory-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppIconComponent,
    InventoryStatusBadgeComponent,
  ],
  template: `
    <div class="container space-y-6 max-w-3xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a routerLink="/seller/dashboard" class="hover:text-indigo-600">Seller Portal</a> /
        <a routerLink="/seller/inventory" class="hover:text-indigo-600">Inventory</a> /
        <span class="text-slate-800 font-medium">Adjust Stock</span>
      </nav>

      <!-- Access Denied Card -->
      <div *ngIf="accessDenied" class="card p-8 bg-red-50/80 border border-red-200 text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <app-icon name="alert-triangle" [size]="24"></app-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">Access Denied</h2>
          <p class="text-xs text-slate-600 max-w-md mx-auto mt-1">
            This inventory record does not belong to <strong>{{ authService.currentSeller().storeName }}</strong>. You cannot modify stock levels for other stores.
          </p>
        </div>
        <a routerLink="/seller/inventory" class="btn btn-primary btn-sm inline-flex">Return to Inventory</a>
      </div>

      <!-- Inventory Adjustment Form -->
      <div *ngIf="!accessDenied && inventoryItem" class="card p-6 sm:p-8 bg-white space-y-6 border border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">Stock Adjustment</h1>
            <p class="text-xs text-slate-500 mt-1">Product: <strong>{{ inventoryItem.productName }}</strong> (SKU: <span class="font-mono">{{ inventoryItem.sku }}</span>)</p>
          </div>
          <app-inventory-status-badge [status]="inventoryItem.status"></app-inventory-status-badge>
        </div>

        <!-- Current Stock Cards -->
        <div class="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
          <div>
            <div class="text-slate-500 text-[11px]">Available Stock</div>
            <div class="text-xl font-extrabold text-slate-900 mt-0.5">{{ inventoryItem.availableQuantity }}</div>
          </div>
          <div>
            <div class="text-slate-500 text-[11px]">Reserved Stock</div>
            <div class="text-xl font-extrabold text-indigo-600 mt-0.5">{{ inventoryItem.reservedQuantity }}</div>
          </div>
          <div>
            <div class="text-slate-500 text-[11px]">Reorder Level</div>
            <div class="text-xl font-extrabold text-slate-700 mt-0.5">{{ inventoryItem.reorderLevel }}</div>
          </div>
        </div>

        <form [formGroup]="adjustForm" (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Adjustment Direction *</label>
              <select formControlName="direction" class="form-select">
                <option value="ADD">Add Stock (+)</option>
                <option value="REMOVE">Remove Stock (-)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Transaction Type *</label>
              <select formControlName="transactionType" class="form-select">
                <option value="STOCK_RECEIVED">Stock Received (New Purchase Order)</option>
                <option value="MANUAL_ADJUSTMENT">Manual Count Adjustment</option>
                <option value="RETURN_RECEIVED">Returned Customer Item</option>
                <option value="DAMAGED">Damaged / Expired Inventory</option>
                <option value="STOCK_TRANSFER">Stock Transfer</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input type="number" formControlName="quantity" class="form-input" placeholder="e.g. 25" />
              <div *ngIf="adjustForm.get('quantity')?.invalid && adjustForm.get('quantity')?.touched" class="text-red-500 text-[11px] mt-1">
                Please enter a valid positive quantity.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Reference Code / PO Number</label>
              <input type="text" formControlName="reference" class="form-input" placeholder="PO-20260905-01" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Reason / Internal Notes</label>
            <textarea formControlName="notes" class="form-textarea" rows="3" placeholder="Provide audit reasoning for stock level change..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <a routerLink="/seller/inventory" class="btn btn-outline">Cancel</a>
            <button type="submit" [disabled]="adjustForm.invalid" class="btn btn-primary disabled:opacity-50">
              Apply Stock Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SellerInventoryDetailComponent implements OnInit {
  inventoryItemId: string | null = null;
  inventoryItem: InventoryItem | null = null;
  accessDenied = false;
  adjustForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private inventoryService: InventoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.inventoryItemId = this.route.snapshot.paramMap.get('id');
    this.adjustForm = new FormGroup({
      direction: new FormControl('ADD', [Validators.required]),
      transactionType: new FormControl<StockTransactionType>('STOCK_RECEIVED', [Validators.required]),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      reference: new FormControl('PO-MANUAL-' + Date.now().toString().slice(-4)),
      notes: new FormControl(''),
    });

    if (this.inventoryItemId) {
      const sellerId = this.authService.currentSellerId();
      this.inventoryService.getInventory({ sellerId }).subscribe((items) => {
        const item = items.find((i) => i.id === this.inventoryItemId || i.productId === this.inventoryItemId);
        if (!item) {
          this.accessDenied = true;
          return;
        }

        if (item.sellerId !== sellerId) {
          this.accessDenied = true;
          return;
        }

        this.inventoryItem = item;
      });
    }
  }

  onSubmit(): void {
    if (this.adjustForm.invalid || !this.inventoryItem) return;

    const val = this.adjustForm.value;
    const change = val.direction === 'ADD' ? Number(val.quantity) : -Number(val.quantity);

    if (val.direction === 'REMOVE' && Number(val.quantity) > this.inventoryItem.availableQuantity) {
      this.toastService.error(
        `Cannot remove ${val.quantity} units. Available stock is only ${this.inventoryItem.availableQuantity}.`,
        'Insufficient Stock'
      );
      return;
    }

    const performer = `${this.authService.currentSeller().ownerName} (${this.authService.currentSeller().storeName})`;

    this.inventoryService
      .updateStock(
        this.inventoryItem.id,
        change,
        val.transactionType,
        val.reference || 'Stock Audit',
        performer,
        val.notes
      )
      .subscribe((updated) => {
        if (updated) {
          this.toastService.success(
            `Stock updated successfully! New available quantity is ${updated.availableQuantity}.`,
            'Inventory Adjusted'
          );
          this.router.navigate(['/seller/inventory']);
        }
      });
  }
}
