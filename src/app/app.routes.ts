import { Routes } from '@angular/router';
import { StorefrontLayoutComponent } from './layout/storefront-layout/storefront-layout.component';
import { SellerLayoutComponent } from './layout/seller-layout/seller-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { customerGuard } from './core/guards/customer.guard';
import { sellerGuard } from './core/guards/seller.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Public Auth Standalone Routes
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./features/auth/access-denied.component').then((m) => m.AccessDeniedComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/auth/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'seller/register',
    loadComponent: () =>
      import('./features/auth/seller-register.component').then((m) => m.SellerRegisterComponent),
  },
  {
    path: 'seller/onboarding',
    loadComponent: () =>
      import('./features/auth/seller-onboarding.component').then((m) => m.SellerOnboardingComponent),
  },

  // Storefront & Customer Routes
  {
    path: '',
    component: StorefrontLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/storefront/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/storefront/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import(
            './features/storefront/product-details/product-details.component'
          ).then((m) => m.ProductDetailComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './features/storefront/categories/categories.component'
          ).then((m) => m.CategoriesComponent),
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('./features/storefront/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'consultation',
        loadComponent: () =>
          import(
            './features/storefront/consultation/consultation-hub.component'
          ).then((m) => m.ConsultationHubComponent),
      },
      {
        path: 'consultation/doctors',
        loadComponent: () =>
          import(
            './features/storefront/consultation/doctor-list.component'
          ).then((m) => m.DoctorListComponent),
      },
      {
        path: 'consultation/doctors/:id',
        loadComponent: () =>
          import(
            './features/storefront/consultation/doctor-profile.component'
          ).then((m) => m.DoctorProfileComponent),
      },
      {
        path: 'consultation/booking-success/:id',
        loadComponent: () =>
          import(
            './features/storefront/consultation/booking-success.component'
          ).then((m) => m.BookingSuccessComponent),
      },
      {
        path: 'consultation/room/:id',
        loadComponent: () =>
          import(
            './features/storefront/consultation/consultation-room.component'
          ).then((m) => m.ConsultationRoomComponent),
      },

      // Department Pages
      {
        path: 'men',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: "Men's Fashion & Collection",
          description: "Explore men's clothing, streetwear, sneakers, watches, and grooming accessories from verified independent sellers.",
          icon: 'user',
          departmentType: 'gender',
          gender: 'MEN',
        },
      },
      {
        path: 'women',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: "Women's Collection & Beauty",
          description: 'Shop designer dresses, ethnic apparel, footwear, luxury handbags, jewelry, and organic cosmetics.',
          icon: 'heart',
          departmentType: 'gender',
          gender: 'WOMEN',
        },
      },
      {
        path: 'kids',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Kids, Baby & Toys',
          description: 'Discover kids clothing, baby care products, educational toys, school gear, and footwear.',
          icon: 'smile',
          departmentType: 'gender',
          gender: 'KIDS',
        },
      },
      {
        path: 'electronics',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Electronics & Gadgets',
          description: 'High-performance wireless audio, laptops, smart wearables, cameras, and computing accessories.',
          icon: 'headphones',
          departmentType: 'department',
          department: 'Electronics',
        },
      },
      {
        path: 'beauty',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Beauty & Skincare',
          description: 'Botanical serums, clean makeup, organic haircare, herbal fragrances, and personal grooming kits.',
          icon: 'sparkles',
          departmentType: 'department',
          department: 'Beauty & Personal Care',
        },
      },
      {
        path: 'home-living',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Home & Living',
          description: 'Scandinavian furniture, ceramic decor, ambient lighting, kitchenware, and luxury bedding.',
          icon: 'home',
          departmentType: 'department',
          department: 'Home & Living',
        },
      },
      {
        path: 'pets',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Pet Supplies & Care',
          description: 'Nutritious dog & cat food, interactive toys, grooming kits, and comfortable pet bedding.',
          icon: 'dog',
          departmentType: 'department',
          department: 'Pet Supplies',
        },
      },
      {
        path: 'sports',
        loadComponent: () =>
          import(
            './features/storefront/category-landing/category-landing.component'
          ).then((m) => m.CategoryLandingComponent),
        data: {
          title: 'Sports & Fitness',
          description: 'Performance activewear, fitness gear, yoga mats, running shoes, and hydration equipment.',
          icon: 'activity',
          departmentType: 'department',
          department: 'Sports & Fitness',
        },
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/storefront/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/customer/cart/cart.component').then(
            (m) => m.CartComponent
          ),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/customer/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
      },

      // Multi-Step Checkout (Protected)
      {
        path: 'checkout',
        canActivate: [customerGuard],
        loadComponent: () =>
          import('./features/customer/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
        children: [
          { path: '', redirectTo: 'address', pathMatch: 'full' },
          {
            path: 'address',
            loadComponent: () =>
              import(
                './features/customer/checkout/steps/checkout-address.component'
              ).then((m) => m.CheckoutAddressComponent),
          },
          {
            path: 'delivery',
            loadComponent: () =>
              import(
                './features/customer/checkout/steps/checkout-delivery.component'
              ).then((m) => m.CheckoutDeliveryComponent),
          },
          {
            path: 'review',
            loadComponent: () =>
              import(
                './features/customer/checkout/steps/checkout-review.component'
              ).then((m) => m.CheckoutReviewComponent),
          },
          {
            path: 'payment',
            loadComponent: () =>
              import(
                './features/customer/checkout/steps/checkout-payment.component'
              ).then((m) => m.CheckoutPaymentComponent),
          },
        ],
      },

      {
        path: 'order-success/:id',
        canActivate: [customerGuard],
        loadComponent: () =>
          import(
            './features/customer/checkout/order-success.component'
          ).then((m) => m.OrderSuccessComponent),
      },

      // Customer Orders & History (Protected)
      {
        path: 'orders',
        canActivate: [customerGuard],
        loadComponent: () =>
          import('./features/customer/orders/orders-list.component').then(
            (m) => m.OrdersListComponent
          ),
      },
      {
        path: 'orders/:id',
        canActivate: [customerGuard],
        loadComponent: () =>
          import('./features/customer/orders/order-detail.component').then(
            (m) => m.OrderDetailComponent
          ),
      },

      // Customer Account (Protected)
      {
        path: 'account',
        canActivate: [customerGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/customer/account/account.component').then(
                (m) => m.CustomerAccountComponent
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import(
                './features/customer/account/profile/account-profile.component'
              ).then((m) => m.AccountProfileComponent),
          },
          {
            path: 'addresses',
            loadComponent: () =>
              import(
                './features/customer/account/addresses/account-addresses.component'
              ).then((m) => m.AccountAddressesComponent),
          },
          {
            path: 'consultations',
            loadComponent: () =>
              import(
                './features/customer/consultations/customer-consultations.component'
              ).then((m) => m.CustomerConsultationsComponent),
          },
          {
            path: 'appointments',
            redirectTo: 'consultations',
            pathMatch: 'full',
          },
          {
            path: 'prescriptions',
            loadComponent: () =>
              import(
                './features/customer/account/prescriptions/prescriptions-list.component'
              ).then((m) => m.PrescriptionsListComponent),
          },
          {
            path: 'wellness-preferences',
            loadComponent: () =>
              import(
                './features/customer/account/wellness-preferences/wellness-preferences.component'
              ).then((m) => m.WellnessPreferencesComponent),
          },
          {
            path: 'orders',
            redirectTo: '/orders',
            pathMatch: 'full',
          },
          {
            path: 'wishlist',
            redirectTo: '/wishlist',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },

  // Seller Portal Routes (Protected by sellerGuard)
  {
    path: 'seller',
    canActivate: [sellerGuard],
    component: SellerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/seller/dashboard/seller-dashboard.component'
          ).then((m) => m.SellerDashboardComponent),
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import(
            './features/seller/consultations/doctor-consultations.component'
          ).then((m) => m.DoctorConsultationsComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './features/seller/products/seller-products.component'
          ).then((m) => m.SellerProductsComponent),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import(
            './features/seller/products/seller-product-form.component'
          ).then((m) => m.SellerProductFormComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import(
            './features/seller/products/seller-product-form.component'
          ).then((m) => m.SellerProductFormComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import(
            './features/seller/inventory/seller-inventory.component'
          ).then((m) => m.SellerInventoryComponent),
      },
      {
        path: 'inventory/history',
        loadComponent: () =>
          import(
            './features/seller/inventory/seller-inventory-history.component'
          ).then((m) => m.SellerInventoryHistoryComponent),
      },
      {
        path: 'inventory/:id',
        loadComponent: () =>
          import(
            './features/seller/inventory/seller-inventory-detail.component'
          ).then((m) => m.SellerInventoryDetailComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/seller/orders/seller-orders.component').then(
            (m) => m.SellerOrdersComponent
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './features/seller/orders/seller-order-detail.component'
          ).then((m) => m.SellerOrderDetailComponent),
      },
      {
        path: 'fulfillment',
        loadComponent: () =>
          import(
            './features/seller/fulfillment/seller-fulfillment.component'
          ).then((m) => m.SellerFulfillmentComponent),
      },
      {
        path: 'fulfillment/:id',
        loadComponent: () =>
          import(
            './features/seller/orders/seller-order-detail.component'
          ).then((m) => m.SellerOrderDetailComponent),
      },
      {
        path: 'earnings',
        loadComponent: () =>
          import(
            './features/seller/earnings/seller-earnings.component'
          ).then((m) => m.SellerEarningsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/seller/profile/seller-profile.component').then(
            (m) => m.SellerProfileComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/seller/settings/seller-settings.component').then(
            (m) => m.SellerSettingsComponent
          ),
      },
    ],
  },

  // Admin Portal Routes (Protected by adminGuard)
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'sellers',
        loadComponent: () =>
          import('./features/admin/sellers/admin-sellers.component').then(
            (m) => m.AdminSellersComponent
          ),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./features/admin/doctors/admin-doctors.component').then(
            (m) => m.AdminDoctorsComponent
          ),
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import(
            './features/admin/consultations/admin-consultations.component'
          ).then((m) => m.AdminConsultationsComponent),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import(
            './features/admin/prescriptions/admin-prescriptions.component'
          ).then((m) => m.AdminPrescriptionsComponent),
      },
      {
        path: 'sellers/:id',
        loadComponent: () =>
          import(
            './features/admin/sellers/admin-seller-detail.component'
          ).then((m) => m.AdminSellerDetailComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/admin/customers/admin-customers.component').then(
            (m) => m.AdminCustomersComponent
          ),
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import(
            './features/admin/customers/admin-customer-detail.component'
          ).then((m) => m.AdminCustomerDetailComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/admin-products.component').then(
            (m) => m.AdminProductsComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import(
            './features/admin/products/admin-product-detail.component'
          ).then((m) => m.AdminProductDetailComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './features/admin/categories/admin-categories.component'
          ).then((m) => m.AdminCategoriesComponent),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/admin/brands/admin-brands.component').then(
            (m) => m.AdminBrandsComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/admin/inventory/admin-inventory.component').then(
            (m) => m.AdminInventoryComponent
          ),
      },
      {
        path: 'inventory/:id',
        loadComponent: () =>
          import(
            './features/admin/inventory/admin-inventory-detail.component'
          ).then((m) => m.AdminInventoryDetailComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './features/admin/orders/admin-order-detail.component'
          ).then((m) => m.AdminOrderDetailComponent),
      },
      {
        path: 'shipments',
        loadComponent: () =>
          import('./features/admin/shipments/admin-shipments.component').then(
            (m) => m.AdminShipmentsComponent
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/admin/payments/admin-payments.component').then(
            (m) => m.AdminPaymentsComponent
          ),
      },
      {
        path: 'returns',
        loadComponent: () =>
          import('./features/admin/returns/admin-returns.component').then(
            (m) => m.AdminReturnsComponent
          ),
      },
      {
        path: 'returns/:id',
        loadComponent: () =>
          import(
            './features/admin/returns/admin-return-detail.component'
          ).then((m) => m.AdminReturnDetailComponent),
      },
      {
        path: 'coupons',
        loadComponent: () =>
          import('./features/admin/coupons/admin-coupons.component').then(
            (m) => m.AdminCouponsComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/admin/reports/admin-reports.component').then(
            (m) => m.AdminReportsComponent
          ),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./features/admin/activity/admin-activity.component').then(
            (m) => m.AdminActivityComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings/admin-settings.component').then(
            (m) => m.AdminSettingsComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
