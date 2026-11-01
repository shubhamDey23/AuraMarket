# Marketplace

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.27.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Backend API Integration Status

The `feature/phase-1-api-integration` branch now connects the storefront product, category, and brand read services to the backend API Gateway, and connects email/password login, customer registration, and bearer-token forwarding to the identity service.

- Product browsing supports backend search, price/category/brand filters, featured/trending/discount filters, pagination, and product detail by ID or slug.
- Tenant-scoped catalogue reads use the tenant UUID returned by the storefront configuration endpoint; the tenant code is used only to load that configuration.
- Seller and admin product list methods use the corresponding backend catalogue endpoints.
- Production environment configuration uses a same-origin API base URL, so the deployment reverse proxy must forward `/api/**` to the gateway.
- The backend registration endpoint does not issue a token, so the frontend signs in after successful customer registration.
- Google login and seller onboarding are intentionally not simulated by the new HTTP repository: the current backend API does not expose a Google sign-in endpoint, and seller registration needs a separate onboarding flow.
- Cart, order placement/history, payment initiation, inventory, notification, and several admin settings screens still require API integration. The legacy UI contains demo-only calculations and mock-backed services; do not treat those flows as production-ready yet.

Local verification is still required: install dependencies, run `npm ci`, `npm test`, and `npm run build`, then start the backend and exercise the Postman collection. These changes have been committed to the feature branch but have not been validated against a live running backend in this environment.
