# Subcold Helpdesk

A modern, full-featured help desk support website built with Next.js, similar to Gymshark's support center.

![Subcold Support](https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156)

## Features

### Public Frontend
- 🏠 **Homepage** with hero section and search
- 📁 **Category Grid** with 6 customizable help categories
- ⭐ **Popular Questions** section
- 📄 **Article Pages** with rich content and related articles
- 🔍 **Search Functionality** across all articles
- 📱 **Fully Responsive** design
- 📊 **View Analytics** on each article

### Admin Panel
- 🔐 **Secure Authentication** with NextAuth.js
- 👥 **Multi-User Support** - Add unlimited admin users
- 📂 **Category Management** - Add, edit, delete categories with custom icons
- 📝 **Article Editor** - Rich text editor (TipTap) for creating articles
- ⭐ **Popular Articles** - Mark articles as popular for homepage display
- 🌍 **Multi-Language Ready** - Built-in locale support
- ⚙️ **Site Settings** - Customize hero text, colors, embed contact forms
- 📈 **Dashboard** - View stats and popular articles

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Rich Text Editor:** TipTap
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your settings:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"
   ```

3. **Initialize the database:**
   ```bash
   npm run db:push
   ```

4. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

### Default Admin Login

After seeding, use these credentials:
- **Email:** admin@subcold.com
- **Password:** admin123

⚠️ **Important:** Change this password immediately in production!

## Deployment to Vercel

1. **Push to GitHub**

2. **Connect to Vercel:**
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   In Vercel dashboard, add:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://support.subcold.com
   NEXTAUTH_SECRET=<generate-a-secure-secret>
   ```
   
   Generate a secret with:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy!**

### For Production Database

For production, consider migrating to a hosted database:
- **Turso** (SQLite edge database)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)

Update the Prisma schema provider and DATABASE_URL accordingly.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/           # Admin API routes
│   │   └── auth/            # NextAuth routes
│   ├── admin/
│   │   ├── login/           # Login page
│   │   └── (protected)/     # Protected admin pages
│   │       ├── dashboard/
│   │       ├── categories/
│   │       ├── articles/
│   │       ├── users/
│   │       └── settings/
│   ├── article/[slug]/      # Article pages
│   ├── category/[slug]/     # Category pages
│   ├── search/              # Search results
│   └── page.tsx             # Homepage
├── components/
│   ├── admin/               # Admin components
│   ├── layout/              # Header, Footer
│   ├── providers/           # Context providers
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts              # NextAuth config
│   └── prisma.ts            # Prisma client
└── prisma/
    ├── schema.prisma        # Database schema
    └── seed.ts              # Sample data
```

## Customization

### Adding New Category Icons

Edit `src/app/admin/(protected)/categories/CategoryForm.tsx` to add more icon options:

```typescript
const iconOptions = [
  { value: 'Package', label: 'Package' },
  { value: 'YourIcon', label: 'Your Label' },
  // Add more Lucide icons
]
```

Then update `src/components/ui/CategoryCard.tsx` to import the new icon.

### Embedding Your Contact Form

1. Go to Admin → Settings
2. Paste your Shopify/Zendesk/etc. form embed code in the "Contact Form Embed" field
3. Save settings

### Changing Colors

1. Edit `tailwind.config.js` to update the Subcold color palette
2. Or use Admin → Settings to change the primary color

## Support

For issues or questions, please open a GitHub issue.

## License

MIT License - feel free to use for your own help desk!
