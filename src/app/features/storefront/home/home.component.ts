import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SellerService } from '../../../core/services/seller.service';
import { BrandService } from '../../../core/services/brand.service';
import { BrandConfigService } from '../../../core/services/brand-config.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Seller } from '../../../core/models/user.model';
import { Brand } from '../../../core/models/brand.model';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { AppIconComponent } from '../../../shared/components/app-icon.component';

interface DoctorPreview {
  id: string;
  name: string;
  degree: string;
  specialization: string;
  experienceYears: number;
  consultationModes: string[];
  avatarUrl: string;
  nextAvailable: string;
  rating: number;
  reviewsCount: number;
}

interface HealthGuide {
  id: string;
  title: string;
  readTime: string;
  category: string;
  summary: string;
  fullContent: string;
  imageUrl: string;
}

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, AppIconComponent],
  template: `
    <div class="space-y-16">
      <!-- 1. Hero Section -->
      <section class="container">
        <div class="relative rounded-3xl bg-[#FFFDF5] border border-[#F5EFE2] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="relative z-10 max-w-xl space-y-6">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4EC] text-[#2F6B4F] text-xs font-extrabold uppercase tracking-wider border border-[#DDE7DF] shadow-xs">
              <app-icon name="sparkles" [size]="14"></app-icon> AYURVEDA & WELLNESS MARKETPLACE
            </span>
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1F2933] leading-[1.15]">
              Discover a More <br class="hidden sm:inline" />
              <span class="text-[#2F6B4F]">Thoughtful Approach</span> to Wellness
            </h1>
            <p class="text-[#64748B] text-base sm:text-lg leading-relaxed font-normal">
              Explore Ayurvedic products, wellness essentials and consultations with qualified Ayurveda practitioners.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <a routerLink="/products" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white shadow-md rounded-xl px-7">
                Explore Ayurvedic Products
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </a>
              <a routerLink="/consultation" class="btn btn-lg bg-white text-[#2F6B4F] border border-[#2F6B4F] hover:bg-[#EAF4EC] rounded-xl px-6 shadow-xs font-bold">
                Consult an Ayurveda Doctor
              </a>
            </div>
          </div>

          <!-- Hero Visual Collage -->
          <div class="relative z-10 w-full lg:w-96 shrink-0 grid grid-cols-2 gap-3">
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-sm hover-lift">
              <img src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400" alt="Chyawanprash" class="w-full h-28 object-cover rounded-xl mb-2" />
              <div class="text-xs font-bold text-[#1F2933] truncate">Organic Chyawanprash</div>
              <div class="text-[11px] text-[#2F6B4F] font-extrabold">₹499</div>
            </div>
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-sm hover-lift translate-y-3">
              <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400" alt="Kumkumadi Serum" class="w-full h-28 object-cover rounded-xl mb-2" />
              <div class="text-xs font-bold text-[#1F2933] truncate">Kumkumadi Face Oil</div>
              <div class="text-[11px] text-[#2F6B4F] font-extrabold">₹899</div>
            </div>
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-sm hover-lift -translate-y-2">
              <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" alt="Ashwagandha Tablets" class="w-full h-28 object-cover rounded-xl mb-2" />
              <div class="text-xs font-bold text-[#1F2933] truncate">Ashwagandha Vitality</div>
              <div class="text-[11px] text-[#2F6B4F] font-extrabold">₹349</div>
            </div>
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-sm hover-lift">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" alt="Bhringraj Hair Oil" class="w-full h-28 object-cover rounded-xl mb-2" />
              <div class="text-xs font-bold text-[#1F2933] truncate">Bhringraj Herbal Oil</div>
              <div class="text-[11px] text-[#2F6B4F] font-extrabold">₹399</div>
            </div>
          </div>

          <!-- Decorative Soft Sage Shapes -->
          <div class="absolute -right-20 -top-20 w-96 h-96 bg-[#8BAF91]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-[#C69A45]/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      <!-- 2. Shop by Wellness Category -->
      <section class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Curated Taxonomy</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Shop by Wellness Category</h2>
            <p class="text-sm text-[#64748B] mt-1">Explore authentic remedies, supplements, and botanical personal care</p>
          </div>
          <a routerLink="/categories" class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
            All Categories <app-icon name="arrow-right" [size]="14"></app-icon>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <a
            *ngFor="let cat of wellnessCategories"
            [routerLink]="['/products']"
            [queryParams]="{ category: cat.slug }"
            class="card p-5 hover:border-[#2F6B4F] hover:shadow-md transition-all group flex flex-col items-center text-center bg-white border-[#DDE7DF] rounded-2xl space-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-[#EAF4EC] text-[#2F6B4F] shadow-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <app-icon [name]="cat.icon" [size]="24"></app-icon>
            </div>
            <h3 class="font-bold text-[#1F2933] text-sm group-hover:text-[#2F6B4F] transition-colors">{{ cat.name }}</h3>
            <p class="text-xs text-[#64748B] line-clamp-1 font-normal">{{ cat.description }}</p>
            <span class="text-[11px] font-bold text-[#2F6B4F] bg-[#EAF4EC] px-2.5 py-0.5 rounded-full mt-1">{{ cat.productCount }} Items</span>
          </a>
        </div>
      </section>

      <!-- 3. Featured Ayurvedic Products -->
      <section class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Handpicked Selections</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Featured Ayurvedic Products</h2>
            <p class="text-sm text-[#64748B] mt-1">Tested, authentic herbal remedies from verified pharmacy sellers</p>
          </div>
          <a routerLink="/products" class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
            See All Products <app-icon name="arrow-right" [size]="14"></app-icon>
          </a>
        </div>

        <div class="grid-products">
          <app-product-card *ngFor="let product of featuredProducts" [product]="product"></app-product-card>
        </div>
      </section>

      <!-- 4. Explore Personal Care -->
      <section class="container">
        <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#EAF4EC] via-[#FFFDF5] to-[#F5EFE2] border border-[#DDE7DF] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-xl">
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Botanical Beauty & Care</span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">Natural Skin & Hair Care Rituals</h2>
            <p class="text-sm text-[#64748B] leading-relaxed">
              Enrich your daily self-care routine with Kumkumadi face oils, Ayurvedic ubtan scrubs, Neem body washes, and Bhringraj hair oil infusions. Formulated with pure plant extracts and traditional herbal recipes.
            </p>
            <div class="flex flex-wrap gap-3 pt-2">
              <a routerLink="/products" [queryParams]="{ category: 'skin-care' }" class="btn btn-primary bg-[#2F6B4F] hover:bg-[#24543D] text-white rounded-xl text-xs font-bold px-5">
                Explore Skincare →
              </a>
              <a routerLink="/products" [queryParams]="{ category: 'hair-care' }" class="btn btn-outline border-[#2F6B4F] text-[#2F6B4F] hover:bg-[#EAF4EC] rounded-xl text-xs font-bold px-5">
                Explore Haircare →
              </a>
            </div>
          </div>
          <div class="w-full lg:w-80 grid grid-cols-2 gap-3 shrink-0">
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-xs">
              <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300" class="w-full h-24 object-cover rounded-xl mb-1.5" />
              <div class="text-xs font-bold text-[#1F2933]">Botanical Cleanser</div>
              <div class="text-[11px] text-[#2F6B4F] font-bold">₹299</div>
            </div>
            <div class="card p-3 bg-white rounded-2xl border border-[#DDE7DF] shadow-xs translate-y-2">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300" class="w-full h-24 object-cover rounded-xl mb-1.5" />
              <div class="text-xs font-bold text-[#1F2933]">Neem Hair Tonic</div>
              <div class="text-[11px] text-[#2F6B4F] font-bold">₹349</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Herbal Oils and Wellness Essentials -->
      <section class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Classical Therapeutics</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Herbal Oils & Daily Adaptogens</h2>
            <p class="text-sm text-[#64748B] mt-1">Traditional Kshirabala, Mahanarayana joint oils, Ashwagandha, and Triphala powders</p>
          </div>
          <a routerLink="/products" [queryParams]="{ category: 'ayurvedic-oils' }" class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1">
            Browse Herbal Oils <app-icon name="arrow-right" [size]="14"></app-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let item of wellnessEssentials" class="card p-6 bg-white border border-[#DDE7DF] rounded-2xl space-y-4 hover-lift">
            <div class="w-12 h-12 rounded-xl bg-[#EAF4EC] text-[#2F6B4F] flex items-center justify-center font-bold">
              <app-icon [name]="item.icon" [size]="24"></app-icon>
            </div>
            <div>
              <h3 class="font-bold text-[#1F2933] text-lg">{{ item.title }}</h3>
              <p class="text-xs text-[#2F6B4F] font-semibold mt-0.5">{{ item.subtitle }}</p>
            </div>
            <p class="text-xs text-[#64748B] leading-relaxed">{{ item.description }}</p>
            <a [routerLink]="item.route" [queryParams]="item.queryParams" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F6B4F] hover:underline pt-2 border-t border-[#DDE7DF] w-full">
              <span>View Collection</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </a>
          </div>
        </div>
      </section>

      <!-- 6. Consult an Ayurveda Doctor (Consultation Promotion) -->
      <section class="container">
        <div class="p-8 sm:p-12 rounded-3xl bg-[#FFFDF5] border border-[#C69A45]/40 space-y-8 shadow-xs">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#F5EFE2] pb-6">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C69A45]/15 text-[#B7791F] text-xs font-extrabold uppercase tracking-wider">
                <app-icon name="user-check" [size]="14"></app-icon> TELE-HEALTHCARE CONSULTATION
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933] mt-2">Personalized Guidance from Ayurveda Practitioners</h2>
              <p class="text-sm text-[#64748B] mt-1">Consult qualified BAMS & MD Ayurveda specialists for holistic Prakriti analysis, dietary guidance, and authentic treatment plans.</p>
            </div>
            <a routerLink="/consultation" class="btn btn-lg bg-[#2F6B4F] hover:bg-[#24543D] text-white font-bold rounded-xl px-7 shadow-xs shrink-0">
              Book Doctor Appointment →
            </a>
          </div>

          <!-- Doctor Preview Cards (With Demo Labels) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let doc of demoDoctors" class="p-5 bg-white rounded-2xl border border-[#DDE7DF] space-y-4 shadow-xs hover-lift">
              <div class="flex items-center gap-3">
                <img [src]="doc.avatarUrl" class="w-14 h-14 rounded-full object-cover border border-[#DDE7DF]" />
                <div>
                  <div class="flex items-center gap-1.5">
                    <h4 class="font-bold text-[#1F2933] text-sm">{{ doc.name }}</h4>
                    <span class="text-[9px] bg-[#EAF4EC] text-[#2F6B4F] px-1.5 py-0.5 rounded font-extrabold uppercase">Demo</span>
                  </div>
                  <div class="text-xs text-[#2F6B4F] font-semibold">{{ doc.degree }} &bull; {{ doc.experienceYears }}+ Yrs Exp</div>
                  <div class="text-[11px] text-[#64748B] font-medium">{{ doc.specialization }}</div>
                </div>
              </div>

              <div class="space-y-1.5 text-xs bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE7DF]">
                <div class="flex items-center justify-between text-[#64748B]">
                  <span>Consultation Modes:</span>
                  <span class="font-bold text-[#1F2933]">{{ doc.consultationModes.join(', ') }}</span>
                </div>
                <div class="flex items-center justify-between text-[#64748B]">
                  <span>Next Available:</span>
                  <span class="font-bold text-[#2F6B4F]">{{ doc.nextAvailable }}</span>
                </div>
              </div>

              <a routerLink="/consultation" class="w-full btn btn-sm bg-[#EAF4EC] hover:bg-[#DCEBDD] text-[#2F6B4F] font-bold rounded-xl text-xs py-2 flex items-center justify-center gap-1">
                Consult {{ doc.name.split(' ')[1] }} →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. How the Platform Works -->
      <section class="container">
        <div class="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Transparent Ecosystem</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">How Aura Ayurveda Works</h2>
          <p class="text-sm text-[#64748B]">Bridging authentic Ayurvedic sellers, certified practitioners, and health-conscious customers.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let step of platformSteps" class="p-6 bg-white rounded-2xl border border-[#DDE7DF] text-center space-y-3 shadow-xs">
            <div class="w-12 h-12 rounded-full bg-[#2F6B4F] text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-xs">
              {{ step.stepNumber }}
            </div>
            <h4 class="font-bold text-[#1F2933] text-base">{{ step.title }}</h4>
            <p class="text-xs text-[#64748B] leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </section>

      <!-- 8. Trusted Sellers & Pharmacies -->
      <section class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Verified Multi-Vendor Stores</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Trusted Ayurvedic Pharmacies</h2>
            <p class="text-sm text-[#64748B] mt-1">Licensed herbal pharmacies and traditional Aushadhalayas</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div *ngFor="let seller of topSellers" class="card p-5 bg-white space-y-3 border border-[#DDE7DF] hover-lift">
            <div class="flex items-center gap-3">
              <img [src]="seller.logoUrl" class="w-10 h-10 rounded-full object-cover border border-[#DDE7DF]" />
              <div>
                <h3 class="font-bold text-[#1F2933] text-sm line-clamp-1">{{ seller.storeName }}</h3>
                <span class="text-[11px] text-[#B7791F] font-semibold">★ {{ seller.rating }} rating</span>
              </div>
            </div>
            <p class="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{{ seller.description }}</p>
            <div class="pt-2.5 border-t border-[#DDE7DF] flex items-center justify-between text-xs">
              <span class="text-[#64748B] font-medium">{{ seller.productCount || 12 }} products</span>
              <a [routerLink]="['/products']" [queryParams]="{sellerId: seller.id}" class="text-[#2F6B4F] font-bold hover:underline">
                Visit Store →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 9. Educational Health Guides -->
      <section class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Ayurvedic Knowledge Hub</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Educational Health Guides</h2>
            <p class="text-sm text-[#64748B] mt-1">Learn about Prakriti, Dinacharya daily rituals, and herbal ingredients</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let guide of healthGuides" class="card bg-white border border-[#DDE7DF] rounded-2xl overflow-hidden hover-lift flex flex-col">
            <img [src]="guide.imageUrl" [alt]="guide.title" class="w-full h-44 object-cover" />
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span class="font-bold text-[#2F6B4F] uppercase tracking-wider">{{ guide.category }}</span>
                  <span>{{ guide.readTime }}</span>
                </div>
                <h3 class="font-bold text-[#1F2933] text-base leading-snug">{{ guide.title }}</h3>
                <p class="text-xs text-[#64748B] line-clamp-3 leading-relaxed">{{ guide.summary }}</p>
              </div>

              <button
                (click)="openGuideModal(guide)"
                class="text-xs font-bold text-[#2F6B4F] hover:underline flex items-center gap-1 pt-2 border-t border-[#DDE7DF] w-full text-left"
              >
                <span>Read Full Article</span>
                <app-icon name="arrow-right" [size]="14"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 10. Frequently Asked Questions & Safety Information -->
      <section class="container">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- FAQ Accordion -->
          <div class="lg:col-span-2 space-y-6">
            <div>
              <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">Common Inquiries</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">Frequently Asked Questions</h2>
            </div>

            <div class="space-y-3">
              <div *ngFor="let faq of faqs; let i = index" class="border border-[#DDE7DF] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  (click)="toggleFAQ(i)"
                  class="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-[#1F2933] text-sm hover:bg-[#F8FAF7] transition-colors"
                >
                  <span>{{ faq.question }}</span>
                  <app-icon
                    name="chevron-down"
                    [size]="16"
                    [customClass]="faq.isOpen ? 'rotate-180-smooth text-[#2F6B4F]' : 'rotate-0-smooth text-[#64748B]'"
                  ></app-icon>
                </button>
                <div *ngIf="faq.isOpen" class="px-4 pb-5 sm:px-5 text-xs text-[#64748B] leading-relaxed border-t border-[#DDE7DF]/60 pt-3">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>

          <!-- Safety & Usage Information Box -->
          <div class="space-y-6">
            <div>
              <span class="text-xs font-bold text-[#C69A45] uppercase tracking-wider">Responsible Healthcare</span>
              <h2 class="text-xl font-extrabold text-[#1F2933]">Safety & Usage Guidelines</h2>
            </div>

            <div class="p-6 rounded-3xl bg-[#FFFDF5] border border-[#C69A45]/30 space-y-4 text-xs text-[#1F2933]">
              <div class="w-10 h-10 rounded-xl bg-[#C69A45]/15 text-[#C69A45] flex items-center justify-center font-bold">
                <app-icon name="shield" [size]="20"></app-icon>
              </div>

              <div class="space-y-2">
                <h4 class="font-bold text-sm text-[#1F2933]">Important Medical Disclaimer</h4>
                <p class="text-[#64748B] leading-relaxed">
                  Information and products listed on Aura Ayurveda are intended for general wellness and educational purposes. They do not replace formal clinical diagnosis or emergency medical care.
                </p>
              </div>

              <ul class="space-y-2 text-[#64748B] pt-2 border-t border-[#F5EFE2]">
                <li class="flex items-start gap-2">
                  <span class="text-[#2F6B4F] font-bold">&bull;</span>
                  <span><strong>Dosage & Use:</strong> Always follow usage instructions on package labels or practitioner prescriptions.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[#2F6B4F] font-bold">&bull;</span>
                  <span><strong>Pre-existing Conditions:</strong> Pregnant/nursing individuals or individuals taking chronic prescription medications should consult a doctor before starting new herbal supplements.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[#2F6B4F] font-bold">&bull;</span>
                  <span><strong>Verified Quality:</strong> All products are sourced from registered Ayurvedic manufacturers with batch licenses.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Health Guide Reader Modal -->
      <div *ngIf="selectedGuide" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2933]/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto border border-[#DDE7DF] shadow-2xl relative">
          <button (click)="selectedGuide = null" class="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#1F2933] rounded-full bg-[#F8FAF7]">
            <app-icon name="x" [size]="20"></app-icon>
          </button>
          <span class="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider">{{ selectedGuide.category }} &bull; {{ selectedGuide.readTime }}</span>
          <h2 class="text-2xl font-extrabold text-[#1F2933]">{{ selectedGuide.title }}</h2>
          <img [src]="selectedGuide.imageUrl" [alt]="selectedGuide.title" class="w-full h-48 object-cover rounded-2xl" />
          <div class="text-xs sm:text-sm text-[#64748B] leading-relaxed space-y-3 whitespace-pre-line">
            {{ selectedGuide.fullContent }}
          </div>
          <div class="pt-4 border-t border-[#DDE7DF] flex justify-end">
            <button (click)="selectedGuide = null" class="btn btn-sm bg-[#2F6B4F] text-white font-bold rounded-xl px-6">
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  topSellers: Seller[] = [];

  selectedGuide: HealthGuide | null = null;

  wellnessCategories = [
    {
      name: 'Ayurvedic Medicines',
      slug: 'ayurvedic-medicines',
      icon: 'package',
      description: 'Kwath, Vati, Asava, Arishta & Churna',
      productCount: 145,
    },
    {
      name: 'Herbal Wellness',
      slug: 'herbal-wellness',
      icon: 'sparkles',
      description: 'Daily adaptogens & traditional rasayanas',
      productCount: 128,
    },
    {
      name: 'Personal Care',
      slug: 'personal-care',
      icon: 'user',
      description: 'Herbal soaps, oral care & body bath powders',
      productCount: 96,
    },
    {
      name: 'Skin Care',
      slug: 'skin-care',
      icon: 'sparkles',
      description: 'Kumkumadi serums, ubtans & botanical oils',
      productCount: 110,
    },
    {
      name: 'Hair Care',
      slug: 'hair-care',
      icon: 'heart',
      description: 'Bhringraj hair oils & herbal shampoos',
      productCount: 88,
    },
    {
      name: 'Ayurvedic Oils',
      slug: 'ayurvedic-oils',
      icon: 'droplet',
      description: 'Therapeutic joint & abhyanga oils',
      productCount: 72,
    },
    {
      name: 'Nutrition & Supplements',
      slug: 'nutrition-supplements',
      icon: 'activity',
      description: 'Chyawanprash, herbal juices & elixirs',
      productCount: 135,
    },
    {
      name: 'Women’s Wellness',
      slug: 'womens-wellness',
      icon: 'heart',
      description: 'Shatavari tonics & menstrual balance',
      productCount: 94,
    },
  ];

  wellnessEssentials = [
    {
      title: 'Therapeutic Joint & Abhyanga Oils',
      subtitle: 'Kshirabala, Mahanarayana & Dhanwantharam',
      description: 'Deeply nourishing botanical oils formulated for joint comfort, muscle relaxation, and traditional warm oil body massage.',
      icon: 'droplet',
      route: ['/products'],
      queryParams: { category: 'ayurvedic-oils' },
    },
    {
      title: 'Daily Vitality Adaptogens',
      subtitle: 'Organic Chyawanprash, Ashwagandha & Triphala',
      description: 'Classical herbal Rasayanas designed to support daily stamina, digestive harmony, and seasonal immunity.',
      icon: 'sparkles',
      route: ['/products'],
      queryParams: { category: 'herbal-wellness' },
    },
    {
      title: 'Botanical Hair & Scalp Oils',
      subtitle: 'Bhringraj, Amla & Brahmi Hair Infusions',
      description: 'Nourishing herbal oils to strengthen roots, soothe scalp dryness, and restore natural hair shine.',
      icon: 'heart',
      route: ['/products'],
      queryParams: { category: 'hair-care' },
    },
  ];

  demoDoctors: DoctorPreview[] = [
    {
      id: 'doc-1',
      name: 'Dr. Ananya Sharma',
      degree: 'BAMS, MD (Kayachikitsa)',
      specialization: 'General Medicine & Metabolic Health',
      experienceYears: 12,
      consultationModes: ['Video Call', 'Audio Call'],
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-78a99478f7b7?w=300',
      nextAvailable: 'Today, 4:00 PM',
      rating: 4.9,
      reviewsCount: 142,
    },
    {
      id: 'doc-2',
      name: 'Dr. Rajesh Vaidya',
      degree: 'BAMS, MD (Panchakarma)',
      specialization: 'Detoxification & Joint Care',
      experienceYears: 15,
      consultationModes: ['Video Call', 'Clinic Visit'],
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
      nextAvailable: 'Tomorrow, 10:30 AM',
      rating: 4.8,
      reviewsCount: 98,
    },
    {
      id: 'doc-3',
      name: 'Dr. Sunita Kulkarni',
      degree: 'BAMS (Dravyaguna)',
      specialization: 'Herbal Pharmacology & Women’s Health',
      experienceYears: 9,
      consultationModes: ['Video Call', 'Audio Call'],
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
      nextAvailable: 'Today, 6:15 PM',
      rating: 4.9,
      reviewsCount: 115,
    },
  ];

  platformSteps = [
    {
      stepNumber: 1,
      title: 'Browse Products & Doctors',
      description: 'Explore verified Ayurvedic remedies from licensed pharmacies or discover qualified BAMS/MD practitioners.',
    },
    {
      stepNumber: 2,
      title: 'Verify Ingredients & Details',
      description: 'Review complete ingredient profiles, dosage guidelines, manufacturer licenses, and safety advisories.',
    },
    {
      stepNumber: 3,
      title: 'Order or Schedule Call',
      description: 'Purchase authentic products with multi-seller shipping or book a direct tele-health video/audio consultation.',
    },
    {
      stepNumber: 4,
      title: 'Doorstep Delivery & Care',
      description: 'Receive genuine herbal formulations at home along with practitioner digital prescriptions and follow-up support.',
    },
  ];

  healthGuides: HealthGuide[] = [
    {
      id: 'guide-1',
      title: 'Understanding Your Prakriti: Vata, Pitta & Kapha',
      readTime: '5 Min Read',
      category: 'Ayurvedic Principles',
      summary: 'Learn how your unique constitutional dosha balance shapes your digestion, sleep, energy, and optimal lifestyle choices.',
      fullContent: `Ayurveda identifies three fundamental bio-energies or Doshas: Vata (Air & Ether), Pitta (Fire & Water), and Kapha (Earth & Water).

Every individual possesses a unique proportion of these doshas established at birth, known as Prakriti.

1. Vata: Governs movement, circulation, and nervous activity. When balanced, it fosters creativity and enthusiasm.
2. Pitta: Controls metabolism, digestion, and body temperature. Balanced Pitta promotes sharp intellect and clear skin.
3. Kapha: Provides structural stability, lubrication, and emotional calmness. Balanced Kapha yields strength and endurance.

Understanding your Prakriti enables you to choose foods, herbal supplements, and daily habits tailored to your inherent constitution.`,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    },
    {
      id: 'guide-2',
      title: 'Dinacharya: Daily Ayurvedic Habits for Vitality',
      readTime: '4 Min Read',
      category: 'Lifestyle & Routine',
      summary: 'Incorporate time-tested morning rituals such as tongue scraping, warm water hydration, and self-massage (Abhyanga).',
      fullContent: `Dinacharya is the Ayurvedic practice of aligning your daily routine with natural circadian rhythms.

Key Morning Rituals:
1. Early Rising (Brahma Muhurta): Waking during early dawn supports mental clarity.
2. Hydration: Drinking warm water cleanses the digestive tract and activates Agni (digestive fire).
3. Jivha Nirlekhana (Tongue Scraping): Removes accumulated toxins (Ama) from the tongue surface.
4. Abhyanga (Self-Massage): Applying warm sesame or Kshirabala oil before bathing nourishes tissues and calms the nervous system.

Consistency in daily routine forms the cornerstone of preventive Ayurvedic health.`,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600',
    },
    {
      id: 'guide-3',
      title: 'Herbal Monograph: The Synergy of Ashwagandha & Triphala',
      readTime: '6 Min Read',
      category: 'Herbal Science',
      summary: 'Discover how Ashwagandha promotes adaptogenic stress resilience while Triphala gently supports colon health.',
      fullContent: `Ashwagandha (Withania somnifera) and Triphala are two of the most widely revered herbal formulations in classical Ayurveda.

Ashwagandha (Adaptogenic Vitality):
- Known as Indian Ginseng, Ashwagandha supports cortisol modulation and sleep quality.
- Nourishes Dhatus (body tissues) and promotes stamina.

Triphala (Three Fruits Formulation):
- Composed of Amalaki, Haritaki, and Bibhitaki.
- Gently regulates bowel movements without habit-forming laxative effects.
- Rich in natural antioxidants and Vitamin C.

Consult an Ayurvedic practitioner to determine the ideal dosage and timing suited for your digestive capacity (Agni).`,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
    },
  ];

  faqs: FAQItem[] = [
    {
      question: 'How are Ayurvedic products on Aura Ayurveda verified for quality?',
      answer: 'All products listed on Aura Ayurveda are supplied by registered manufacturers and licensed pharmacies. Sellers must provide official manufacturing batch information, AYUSH/FDA license numbers, and complete ingredient lists.',
      isOpen: false,
    },
    {
      question: 'How does an online consultation with an Ayurveda doctor work?',
      answer: 'You can choose a qualified doctor by specialization, view available slots, and book a video or audio appointment. After the call, your doctor uploads a digital prescription with dietary guidelines and herbal recommendations.',
      isOpen: false,
    },
    {
      question: 'Are Ayurvedic supplements safe for daily long-term use?',
      answer: 'Rasayana and daily wellness items like Chyawanprash, Triphala, or Amla juice are traditionally designed for daily nutritional support. However, classical therapeutic medicines should be used under practitioner guidance.',
      isOpen: false,
    },
    {
      question: 'Can I order products from multiple sellers in a single checkout?',
      answer: 'Yes! Aura Ayurveda supports multi-vendor checkout. Your order items will be routed to the respective verified sellers, who will ship your packages directly to your address.',
      isOpen: false,
    },
    {
      question: 'What should I do if I am taking prescription medications?',
      answer: 'If you take chronic prescription drugs, are pregnant, or have pre-existing conditions, we advise consulting our online Ayurvedic doctors or your primary physician before starting new herbal regimens.',
      isOpen: false,
    },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private sellerService: SellerService,
    private brandService: BrandService,
    public brandConfig: BrandConfigService
  ) {}

  ngOnInit(): void {
    this.productService.getProductsPaginated({ isFeatured: true, pageSize: 8 }).subscribe((res) => {
      this.featuredProducts = res.products;
    });

    this.sellerService.getSellers().subscribe((sellers) => {
      this.topSellers = sellers.slice(0, 4);
    });
  }

  toggleFAQ(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  openGuideModal(guide: HealthGuide): void {
    this.selectedGuide = guide;
  }
}
