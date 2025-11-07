# Invoify

![Invoify Logo](./public/screenshots/home.png)

> Professional invoicing platform for modern businesses

Invoify is a comprehensive invoicing and business management platform built with Next.js, designed to help businesses create professional invoices, manage clients, and track financial performance with ease.

## ✨ Features

- **📄 Professional Invoices** - Create stunning invoices with customizable templates
- **👥 Client Management** - Organize and manage client relationships
- **📊 Analytics Dashboard** - Track business performance and revenue insights
- **🏢 Company Profiles** - Add company branding to invoices
- **🔒 Secure & Private** - Your invoices data are secured and private
- **📱 PDF Generation** - Instant PDF downloads with professional layouts
- **🎨 Modern UI** - Beautiful, responsive interface with premium design

## 🚀 Screenshots

### Dashboard Overview

![Dashboard](./public/screenshots/dashboard.png)

### Invoice Creation

![Create Invoice](./public/screenshots/create-invoice.png)

### Client Management

![Clients](./public/screenshots/clients.png)

### Analytics Dashboard

![Analytics](./public/screenshots/analytics.png)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- PostgreSQL database (local or cloud)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/iamajraj/invoify.git
   cd invoify
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up PostgreSQL database**

   **Option A: Local PostgreSQL**
   ```bash
   # Install PostgreSQL locally (macOS with Homebrew)
   brew install postgresql
   brew services start postgresql

   # Create database
   createdb invoify_dev
   ```

   **Option B: Cloud PostgreSQL (Recommended for production)**
   - Use services like: Neon, Supabase, PlanetScale
   - Get your connection URL

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   # For local PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/invoify_dev"

   # For cloud PostgreSQL (use the connection string provided by your service)
   # DATABASE_URL="postgresql://username:password@host:port/database"

   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   ```

5. **Set up the database schema**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

7. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

8. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Getting Started

1. **Sign up** for a new account or **sign in** if you already have one
2. **Create your company profile** in the Companies section
3. **Add clients** to manage your customer relationships
4. **Create invoices** using the intuitive form builder
5. **Download PDFs** or track payment status in the dashboard

### Key Workflows

#### Creating Your First Invoice

1. Navigate to **Dashboard → Invoices → New Invoice**
2. Select your **company profile** as the sender
3. Choose or **add a client**
4. **Add line items** with descriptions, quantities, and prices
5. Set **tax rates** and **payment terms**
6. **Preview and download** the PDF

#### Managing Clients

1. Go to **Dashboard → Clients**
2. Click **"Add Client"** to create new client profiles
3. Include contact information, addresses, and notes
4. View **invoice history** for each client

#### Company Branding

1. Visit **Dashboard → Companies**
2. Add your **company name**, contact details, and branding
3. Your information will **automatically appear** on all invoices

## 📁 Project Structure

```
invoify/
├── app/
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard pages
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   └── dashboard-layout.tsx      # Dashboard layout
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Database client
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema
│   └── schema.prisma
├── public/
│   └── screenshots/              # Application screenshots
└── types/                        # TypeScript type definitions
```

## 📄 License

All rights reserved. This project is proprietary software.

## 🙋 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/iamajraj/invoify/issues)
- **Discussions**: Join the conversation on [GitHub Discussions](https://github.com/iamajraj/invoify/discussions)

---

Built with ❤️ by [Muhammad Raj](https://www.github.com/iamajraj)
