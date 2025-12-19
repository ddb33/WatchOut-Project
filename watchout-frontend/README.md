# WatchoutFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

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

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

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

## Finalized AI Usage
# WatchOut: A Multi-Tier Movie Tracking Application

## System Architecture
The project is deployed across three Ubuntu Virtual Machines (VMs) connected via a Host-Only network (192.168.50.x) to simulate a real-world enterprise environment:

* **Frontend VM**: Angular application served on Port 4200.
* **Backend VM**: Node.js/Express API served on Port 5000.
* **Database VM**: MongoDB instance storing user credentials and watchlists.

---

## Key Features & Deliverables
* **Personalized Release Calendar**: An "Upcoming Movies" section on the watchlist that automatically filters saved movies by release date, featuring a visual date-badge system.
* **Streaming Service Integration**: Real-time streaming availability icons (Netflix, Max, Disney+, etc.) powered by the TMDB Watch Provider API, with direct redirects to provider information.
* **Secure Authentication**: A robust login and registration system protected by an **Angular AuthGuard**, ensuring the dashboard and watchlist are inaccessible to unauthorized users.
* **Watchlist Management**: Full CRUD functionality allowing users to add movies from the dashboard and remove them via a unified UI overlay.

---

## 🤖 AI Usage & Assistance
Artificial Intelligence (Gemini) acted as a primary thought partner throughout the development of this project. AI was utilized in the following capacities:

### 1. UI/UX Design & Consistency
* **Theming**: Assisted in crafting a cohesive "Deep Space" dark theme with consistent purple accents (`#6a1b9a`).
* **Layout Syncing**: Unified the design of the "Upcoming" and "Available" movie sections to ensure identical card sizes, typography, and button behaviors.

### 2. Logic & Security
* **AuthGuard Implementation**: Provided the structural logic for route protection and session validation using `localStorage`.
* **Dynamic Data Handling**: Helped develop the TypeScript logic for filtering movies into release categories and managing smart "Back to Dashboard/Watchlist" navigation.

### 3. Architecture & Troubleshooting
* **Networking Strategy**: Guided the transition between NAT (for GitHub pushes) and Host-Only (for VM-to-VM communication).
* **Debugging**: Resolved critical TypeScript compilation errors (e.g., TS2339) by identifying missing property initializations in component classes.

---

## 🛠️ Installation & Setup
1.  **Network**: Configure all 3 VMs to a Host-Only adapter with static IPs in the `192.168.50.0/24` range.
2.  **Database**: Ensure MongoDB is running on the .30 VM and listening on all interfaces.
3.  **Backend**: Run `node server.js` on the .20 VM.
4.  **Frontend**: Run `ng serve --host 0.0.0.0` on the .10 VM and access via browser.
