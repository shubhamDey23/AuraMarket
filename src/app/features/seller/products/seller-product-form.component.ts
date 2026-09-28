import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { AppIconComponent } from '../../../shared/components/app-icon.component';
import { MOCK_CATEGORIES } from '../../../data/mock/categories.mock';
import { MOCK_BRANDS } from '../../../data/mock/brands.mock';

@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AppIconComponent],
  template: `
    <div class="container space-y-6 max-w-4xl pb-16">
      <!-- Breadcrumb Nav -->
      <nav class="flex items-center gap-2 text-xs text-[#64748B]">
        <a routerLink="/seller/dashboard" class="hover:text-[#2F6B4F]">Seller Portal</a> /
        <a routerLink="/seller/products" class="hover:text-[#2F6B4F]">Manage Products</a> /
        <span class="text-[#1F2933] font-medium">{{ isEditMode ? 'Edit Ayurvedic Product' : 'Add New Ayurvedic Product' }}</span>
      </nav>

      <!-- Regulatory Compliance & Safety Notice Banner -->
      <div class="p-4 bg-[#FFFDF5] border border-[#C69A45]/30 rounded-2xl text-xs text-[#1F2933] space-y-1">
        <h4 class="font-extrabold text-[#B7791F] flex items-center gap-1.5">
          <app-icon name="shield" [size]="16"></app-icon> Regulatory Compliance & Responsible Claims Guidance
        </h4>
        <p class="text-[#64748B] leading-relaxed">
          Seller listings must comply with AYUSH / FSSAI labeling guidelines. Do not claim guaranteed disease cures, instant miracle results, or side-effect-free claims. Provide accurate botanical ingredient lists and license numbers.
        </p>
      </div>

      <!-- Access Denied Card -->
      <div *ngIf="accessDenied" class="card p-8 bg-[#FDF2F2] border border-[#C62828]/30 text-center space-y-4 rounded-3xl">
        <div class="w-12 h-12 rounded-full bg-[#FDF2F2] text-[#C62828] flex items-center justify-center mx-auto border border-[#C62828]/20">
          <app-icon name="alert-triangle" [size]="24"></app-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-[#1F2933]">Access Denied</h2>
          <p class="text-xs text-[#64748B] max-w-md mx-auto mt-1">
            This product does not belong to <strong>{{ authService.currentSeller().storeName }}</strong>.
          </p>
        </div>
        <a routerLink="/seller/products" class="btn bg-[#2F6B4F] text-white btn-sm inline-flex font-bold rounded-xl px-5">Return to My Products</a>
      </div>

      <!-- Main Form Card -->
      <div *ngIf="!accessDenied" class="card p-6 sm:p-8 bg-white space-y-6 border border-[#DDE7DF] rounded-3xl shadow-xs">
        <div class="flex items-center justify-between border-b border-[#DDE7DF] pb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-[#1F2933]">
              {{ isEditMode ? 'Edit Ayurvedic Product' : 'Add New Ayurvedic Product' }}
            </h1>
            <p class="text-xs text-[#64748B] mt-1">
              Store Pharmacy: <strong>{{ authService.currentSeller().storeName }}</strong>
            </p>
          </div>
          <span class="badge bg-[#EAF4EC] text-[#2F6B4F] border border-[#2E7D32]/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
            {{ productForm.get('status')?.value }}
          </span>
        </div>

        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6 text-xs">
          <!-- 1. General & Categorization -->
          <div class="space-y-4">
            <h3 class="font-bold text-[#1F2933] text-sm border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
              <app-icon name="package" [size]="16" customClass="text-[#2F6B4F]"></app-icon> 1. Product Identification & Categorization
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group md:col-span-2">
                <label class="form-label font-bold text-[#1F2933]">Product Name *</label>
                <input type="text" formControlName="name" class="form-input" placeholder="e.g. Organic Chyawanprash Special 500g" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">SKU (Stock Keeping Unit) *</label>
                <input type="text" formControlName="sku" class="form-input font-mono uppercase" placeholder="e.g. AYU-CHY-009" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Net Quantity / Pack Size *</label>
                <input type="text" formControlName="netQuantity" class="form-input" placeholder="e.g. 500 g, 200 ml, 60 Capsules" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Category *</label>
                <select formControlName="categoryId" (change)="onCategoryChange()" class="form-select">
                  <option value="">Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Subcategory</label>
                <select formControlName="subcategoryId" class="form-select">
                  <option value="">Select Subcategory</option>
                  <option *ngFor="let sub of currentSubcategories" [value]="sub.id">{{ sub.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Product Type Classification</label>
                <select formControlName="productType" class="form-select">
                  <option value="Classical Preparations">Classical Preparations</option>
                  <option value="Proprietary Ayurvedic">Proprietary Ayurvedic Products</option>
                  <option value="Herbal Formulations">Herbal Formulations</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Herbal Oils">Herbal Oils</option>
                  <option value="Wellness Essentials">Wellness Essentials</option>
                  <option value="Nutrition">Nutrition & Supplements</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Brand</label>
                <select formControlName="brandId" class="form-select">
                  <option value="">Select Brand</option>
                  <option *ngFor="let b of brands" [value]="b.id">{{ b.name }}</option>
                </select>
              </div>

              <div class="form-group md:col-span-2">
                <label class="form-label font-bold text-[#1F2933]">Short Description</label>
                <input type="text" formControlName="shortDescription" class="form-input" placeholder="Brief summary for product card..." />
              </div>

              <div class="form-group md:col-span-2">
                <label class="form-label font-bold text-[#1F2933]">Full Description</label>
                <textarea formControlName="description" class="form-textarea" rows="3" placeholder="Detailed classical formulation background, wellness support..."></textarea>
              </div>
            </div>
          </div>

          <!-- 2. Ingredients & Usage Guidelines -->
          <div class="space-y-4 pt-4 border-t border-[#DDE7DF]">
            <h3 class="font-bold text-[#1F2933] text-sm border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
              <app-icon name="sparkles" [size]="16" customClass="text-[#2F6B4F]"></app-icon> 2. Botanical Ingredients & Usage Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group md:col-span-2">
                <label class="form-label font-bold text-[#1F2933]">Active Botanical Ingredients (Comma Separated)</label>
                <input type="text" formControlName="ingredientsInput" class="form-input" placeholder="e.g. Ashwagandha Extract 500mg, Guduchi, Amalaki, Pure Honey" />
              </div>

              <div class="form-group md:col-span-2">
                <label class="form-label font-bold text-[#1F2933]">Usage & Dosage Guidelines</label>
                <textarea formControlName="usageInformation" class="form-textarea" rows="2" placeholder="e.g. Take 1 to 2 tablets twice daily after meals with warm water or lukewarm milk."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Storage Instructions</label>
                <input type="text" formControlName="storageInstructions" class="form-input" placeholder="e.g. Store in a cool dry place protected from moisture." />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Safety Precaution & Caution Advisory</label>
                <input type="text" formControlName="caution" class="form-input" placeholder="e.g. Pregnant or lactating women should consult an Ayurveda physician." />
              </div>
            </div>
          </div>

          <!-- 3. Manufacturer, Batch & Compliance -->
          <div class="space-y-4 pt-4 border-t border-[#DDE7DF]">
            <h3 class="font-bold text-[#1F2933] text-sm border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
              <app-icon name="shield" [size]="16" customClass="text-[#2F6B4F]"></app-icon> 3. Manufacturer Licensing & Prescription Controls
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Manufacturer Name</label>
                <input type="text" formControlName="manufacturer" class="form-input" placeholder="e.g. Arya Vaidya Sala Kottakkal Pharmacy Ltd." />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">AYUSH / FSSAI License Number</label>
                <input type="text" formControlName="licenseInformation" class="form-input font-mono" placeholder="e.g. AYUSH Lic No. KTK/AYU-2022/8941" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Batch Number</label>
                <input type="text" formControlName="batchNumber" class="form-input font-mono" placeholder="e.g. AGV-2026-09A" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Expiry Date</label>
                <input type="date" formControlName="expiryDate" class="form-input" />
              </div>

              <div class="form-group md:col-span-2 pt-1">
                <label class="flex items-center gap-2 cursor-pointer text-[#C62828] font-bold">
                  <input type="checkbox" formControlName="requiresPrescription" class="rounded border-[#DDE7DF] text-[#C62828] w-4 h-4" />
                  <span>Prescription Required (Doctor prescription mandatory prior to fulfillment)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 4. Pricing, Approval Status & Stock -->
          <div class="space-y-4 pt-4 border-t border-[#DDE7DF]">
            <h3 class="font-bold text-[#1F2933] text-sm border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
              <app-icon name="indian-rupee" [size]="16" customClass="text-[#2F6B4F]"></app-icon> 4. Pricing, Approval Workflow & Stock Quantity
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Regular Price (₹) *</label>
                <input type="number" step="1" formControlName="price" class="form-input" placeholder="350" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Sale Price (₹)</label>
                <input type="number" step="1" formControlName="salePrice" class="form-input" placeholder="299" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Publication Approval Status *</label>
                <select formControlName="status" class="form-select font-bold">
                  <option value="DRAFT">DRAFT (Seller Draft)</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW (Submit for Moderation)</option>
                  <option value="ACTIVE">ACTIVE (Published)</option>
                  <option value="INACTIVE">INACTIVE (Unpublished)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Available Stock Quantity *</label>
                <input type="number" formControlName="stockQuantity" class="form-input" placeholder="100" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Reorder Threshold Level</label>
                <input type="number" formControlName="reorderLevel" class="form-input" placeholder="15" />
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-[#1F2933]">Weight (Kg) / Shipping Info</label>
                <input type="number" step="0.01" formControlName="weightKg" class="form-input" placeholder="0.5" />
              </div>
            </div>
          </div>

          <!-- 5. Images & Search Tags -->
          <div class="space-y-4 pt-4 border-t border-[#DDE7DF]">
            <h3 class="font-bold text-[#1F2933] text-sm border-b border-[#DDE7DF] pb-2 flex items-center gap-2">
              <app-icon name="image" [size]="16" customClass="text-[#2F6B4F]"></app-icon> 5. Product Image & Keywords
            </h3>
            <div class="form-group">
              <label class="form-label font-bold text-[#1F2933]">Featured Image URL *</label>
              <input type="text" formControlName="featuredImage" class="form-input" placeholder="https://images.unsplash.com/..." />
            </div>

            <div class="form-group">
              <label class="form-label font-bold text-[#1F2933]">Comma Separated Tags</label>
              <input type="text" formControlName="tagsInput" class="form-input" placeholder="ashwagandha, vati, classical, stress" />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-[#DDE7DF]">
            <a routerLink="/seller/products" class="btn btn-outline border-[#DDE7DF]">Cancel</a>
            <button type="submit" [disabled]="productForm.invalid" class="btn bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-6 py-2.5 shadow-md disabled:opacity-50">
              {{ isEditMode ? 'Save Product Changes' : 'Submit Ayurvedic Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SellerProductFormComponent implements OnInit {
  isEditMode = false;
  productId: string | null = null;
  accessDenied = false;
  productForm!: FormGroup;

  categories = MOCK_CATEGORIES;
  brands = MOCK_BRANDS;
  currentSubcategories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    this.initForm();

    if (this.isEditMode && this.productId) {
      // Enforce Seller Ownership
      this.productService.getProductById(this.productId).subscribe((product) => {
        if (!product) {
          this.accessDenied = true;
          return;
        }

        if (product.sellerId !== this.authService.currentSellerId()) {
          this.accessDenied = true;
          return;
        }

        this.populateForm(product);
      });
    }
  }

  initForm(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      netQuantity: new FormControl('500 g', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      subcategoryId: new FormControl(''),
      productType: new FormControl('Proprietary Ayurvedic'),
      brandId: new FormControl(''),
      price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      salePrice: new FormControl(null),
      shortDescription: new FormControl(''),
      description: new FormControl(''),
      ingredientsInput: new FormControl(''),
      usageInformation: new FormControl(''),
      storageInstructions: new FormControl(''),
      caution: new FormControl(''),
      manufacturer: new FormControl(''),
      licenseInformation: new FormControl(''),
      batchNumber: new FormControl(''),
      expiryDate: new FormControl(''),
      requiresPrescription: new FormControl(false),
      status: new FormControl<ProductStatus>('PENDING_REVIEW', [Validators.required]),
      stockQuantity: new FormControl(50, [Validators.required, Validators.min(0)]),
      reorderLevel: new FormControl(10),
      weightKg: new FormControl(0.5),
      featuredImage: new FormControl(
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
        [Validators.required]
      ),
      tagsInput: new FormControl('ayurveda, herbal'),
    });
  }

  onCategoryChange(): void {
    const catId = this.productForm.get('categoryId')?.value;
    const catObj = this.categories.find((c) => c.id === catId);
    this.currentSubcategories = catObj?.subcategories || [];
  }

  populateForm(product: Product): void {
    const category = this.categories.find((c) => c.name === product.categoryName || c.id === product.categoryId);
    this.currentSubcategories = category?.subcategories || [];
    const brand = this.brands.find((b) => b.name === product.brandName || b.id === product.brandId);

    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      netQuantity: product.netQuantity || '500 g',
      categoryId: category?.id || 'cat-ayurvedic-medicines',
      subcategoryId: product.subcategoryId || '',
      productType: product.productType || 'Proprietary Ayurvedic',
      brandId: brand?.id || '',
      price: product.priceInINR || product.price,
      salePrice: product.discountPriceInINR || product.salePrice,
      shortDescription: product.shortDescription || '',
      description: product.description,
      ingredientsInput: product.ingredients ? product.ingredients.join(', ') : '',
      usageInformation: product.usageInformation || '',
      storageInstructions: product.storageInstructions || '',
      caution: product.caution || '',
      manufacturer: product.manufacturer || '',
      licenseInformation: product.licenseInformation || '',
      batchNumber: product.batchNumber || '',
      expiryDate: product.expiryDate || '',
      requiresPrescription: !!product.requiresPrescription,
      status: product.status,
      stockQuantity: product.stockQuantity,
      reorderLevel: product.reorderLevel,
      weightKg: product.weightKg || 0.5,
      featuredImage: product.featuredImage,
      tagsInput: product.tags ? product.tags.join(', ') : '',
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    const currentSeller = this.authService.currentSeller();

    if (!this.productService.isSkuUnique(val.sku, this.productId || undefined)) {
      this.toastService.error(`SKU "${val.sku}" is already in use by another product.`, 'Duplicate SKU');
      return;
    }

    const catObj = this.categories.find((c) => c.id === val.categoryId);
    const subObj = this.currentSubcategories.find((s) => s.id === val.subcategoryId);
    const brandObj = this.brands.find((b) => b.id === val.brandId);

    const ingredientsArr = val.ingredientsInput
      ? val.ingredientsInput.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0)
      : [];

    const tagsArr = val.tagsInput
      ? val.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : ['ayurveda', 'herbal'];

    const formattedImages = [
      { id: 'img-1', url: val.featuredImage, altText: val.name, isPrimary: true },
    ];

    const productPayload: Partial<Product> = {
      name: val.name,
      sku: val.sku,
      netQuantity: val.netQuantity,
      categoryId: val.categoryId,
      categoryName: catObj?.name || 'Ayurvedic Medicines',
      subcategoryId: val.subcategoryId,
      subcategoryName: subObj?.name,
      productType: val.productType,
      brandId: val.brandId,
      brandName: brandObj?.name,
      price: Number(val.price),
      priceInINR: Number(val.price),
      salePrice: val.salePrice ? Number(val.salePrice) : undefined,
      discountPriceInINR: val.salePrice ? Number(val.salePrice) : undefined,
      discountPercentage: val.salePrice ? Math.round(((val.price - val.salePrice) / val.price) * 100) : 0,
      shortDescription: val.shortDescription,
      description: val.description,
      ingredients: ingredientsArr,
      usageInformation: val.usageInformation,
      storageInstructions: val.storageInstructions,
      caution: val.caution,
      manufacturer: val.manufacturer || currentSeller.storeName,
      licenseInformation: val.licenseInformation,
      batchNumber: val.batchNumber,
      expiryDate: val.expiryDate,
      requiresPrescription: val.requiresPrescription,
      status: val.status,
      stockQuantity: Number(val.stockQuantity),
      reorderLevel: Number(val.reorderLevel || 5),
      weightKg: Number(val.weightKg || 0.5),
      featuredImage: val.featuredImage,
      images: formattedImages,
      tags: tagsArr,
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productPayload).subscribe(() => {
        this.toastService.success('Ayurvedic product updated successfully!');
        this.router.navigate(['/seller/products']);
      });
    } else {
      this.productService
        .createProduct({
          ...productPayload,
          sellerId: currentSeller.id,
          sellerName: currentSeller.storeName,
          slug: val.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 5.0,
          reviewCount: 0,
          isFeatured: false,
          isTrending: false,
        } as Product)
        .subscribe(() => {
          this.toastService.success('Ayurvedic product submitted for publication!');
          this.router.navigate(['/seller/products']);
        });
    }
  }
}
