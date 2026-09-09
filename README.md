# Invoice Manager - Client Web App (React & Vite)

A premium, state-of-the-art Single-Page Application (SPA) dashboard for invoice registry and quotation bookkeeping, designed with modern aesthetics and fully responsive grid-card views.

---

## 🎨 Key Features & Aesthetics

- **Premium Responsive Design**: Supports dynamic rendering of wide tabular data:
  - **Desktop View**: Dense, readable tables.
  - **Mobile & Tablet Views**: Automatically reflows complex tables into beautifully structured card grids optimized for touch and narrow viewports.
- **Responsive Sidebar Drawer**: Floating side menu drawer on mobile which slides out from the left via hamburger menu and auto-collapses on navigation.
- **Failsafe Route Refreshing**: Built using React Router `HashRouter` to prevent typical 404 errors when reloading sub-pages on static hosting services (like Render, GitHub Pages, or Netlify).
- **Line Items Editor**: Custom grid input fields with HSN Codes, automatic GST calculation, discount triggers, and real-time total due math.
- **Bookkeeping Tools**: Client profiles registry, payment ledgers (UPI, current accounts, Razorpay), SMTP email outbox simulator drawer, and audit logging feeds.
- **Aesthetic Visuals**: Curated tailwind palettes, dark mode sync support, and smooth micro-animations.

---

## 🛠️ Technology Stack

- **Core**: React 18, Vite (Fast build compiler)
- **Styling**: Vanilla TailwindCSS
- **Icons**: Lucide React
- **Router**: React Router DOM (HashRouter)

---

## 💻 Local Setup & Development

### 1. Install Dependencies
Ensure you have Node.js installed. Navigate to the Frontend directory and run:
```bash
npm install
```

### 2. Configure API Endpoint
The dev server is configured inside `vite.config.js` to automatically proxy all `/api` calls to `http://localhost:5000`. You can change the base API URL for production in `.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

### 3. Run Development Server
Start the Vite development hot-reloading server:
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 4. Build for Production
To compile and minify static production files:
```bash
npm run build
```
This output is saved to the `/dist` directory.

---

## 🌐 Production Deployment (e.g., on Render)

Deploy this project as a **Static Site** on Render:

1. **Build Command**:
   ```bash
   npm run build
   ```
2. **Publish Directory**:
   ```text
   dist
   ```
3. **Routing**:
   Because `HashRouter` is implemented, sub-route refreshes (`/invoices/create`, etc.) are handled entirely client-side, requiring zero rewrite configurations on Render dashboard!
