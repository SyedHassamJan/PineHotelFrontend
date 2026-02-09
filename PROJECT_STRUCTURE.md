# Pine Travel - Tourism Booking Platform

## Project Structure Overview

This is a Next.js tourism booking platform with **three separate user roles**:

---

## 👥 User Roles

### 1. 🌐 **Regular User (Customer)**
- **Purpose:** Browse and book hotels, tours, and guides
- **Login:** `/login` page
- **Dashboard:** ❌ No separate dashboard (uses public pages)
- **Features:**
  - Browse hotels (`/hotels`)
  - Browse tours (`/tours`)
  - Browse guides (`/guides`)
  - Make bookings
  - Leave reviews
- **Layout:** ✅ Has Navbar and Footer (public website)

---

### 2. 🏨 **Hotel Owner**
- **Purpose:** Manage their hotel properties and bookings
- **Login:** `/admin/login`
- **Authentication:** Uses `hotelOwnerAuth` in localStorage
- **Test Credentials:**
  - Email: `owner@hotels.com`
  - Password: `owner123`

#### Hotel Owner Pages:
- `/admin/dashboard` - Overview of hotels and bookings
- `/admin/my-hotels` - Manage hotel listings
- `/admin/bookings` - View and manage bookings
- `/admin/rooms` - Manage room types
- `/admin/settings` - Profile and preferences

**Layout:** ❌ NO Navbar/Footer (clean dashboard interface with sidebar only)

---

### 3. 👑 **SuperAdmin (Platform Administrator)**
- **Purpose:** Manage the entire platform
- **Login:** `/superadmin/login`
- **Authentication:** Uses `superadminAuth` in localStorage
- **Test Credentials:**
  - Email: `superadmin@travelhub.com`
  - Password: `super123`

#### SuperAdmin Pages:
- `/superadmin/dashboard` - Platform overview
- `/superadmin/users` - User management
- `/superadmin/hotel-submissions` - Approve hotels & create hotel owners
- `/superadmin/tour-submissions` - Approve tour packages
- `/superadmin/guide-submissions` - Approve tour guides
- `/superadmin/analytics` - Platform analytics
- `/superadmin/reports` - Generate reports
- `/superadmin/notifications` - Notification center
- `/superadmin/settings` - SuperAdmin settings

**Layout:** ❌ NO Navbar/Footer (clean admin interface)

---

## 🔄 Authentication Flow

```
PUBLIC WEBSITE (/)
    │
    ├─→ Regular User → Browse & Book (no separate dashboard)
    │
    ├─→ Hotel Owner → /admin/login → /admin/dashboard
    │                  (hotelOwnerAuth)
    │
    └─→ SuperAdmin → /superadmin/login → /superadmin/dashboard
                     (superadminAuth)
```

---

## 📁 Key Files Changed

### Updated Authentication:
- `app/admin/login/page.tsx` - Changed from `adminAuth` to `hotelOwnerAuth`
- `app/admin/dashboard/page.tsx` - Uses `ownerEmail` instead of `adminEmail`
- `app/admin/my-hotels/page.tsx` - Uses `hotelOwnerAuth`
- `app/admin/bookings/page.tsx` - Uses `hotelOwnerAuth`
- `app/admin/rooms/page.tsx` - Uses `hotelOwnerAuth`
- `app/admin/settings/page.tsx` - Uses `hotelOwnerAuth`

### Layout Configuration:
- `components/conditional-layout.tsx` - Excludes navbar/footer for `/admin` and `/superadmin` routes
- `app/admin/layout.tsx` - Custom layout for hotel owner pages
- `app/superadmin/layout.tsx` - Custom layout for superadmin pages

---

## 🎨 Tech Stack

- **Framework:** Next.js 16.0.10 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.9
- **Icons:** Lucide React
- **UI Components:** Radix UI
- **State:** React Hooks (useState, useEffect)
- **Routing:** Next.js App Router
- **Authentication:** localStorage (client-side)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📝 Test Credentials Summary

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Hotel Owner | owner@hotels.com | owner123 | /admin/dashboard |
| SuperAdmin | superadmin@travelhub.com | super123 | /superadmin/dashboard |
| Regular User | - | - | No dashboard |

---

## ✅ Recent Changes

1. ✅ Removed user (customer) dashboard - users now only have public pages
2. ✅ Changed all "admin" references to "hotel owner" for clarity
3. ✅ Updated authentication from `adminAuth` to `hotelOwnerAuth`
4. ✅ Updated all email variables from `adminEmail` to `ownerEmail`
5. ✅ Maintained separate SuperAdmin system with `superadminAuth`

---

## 🔮 Future Enhancements

- [ ] Connect to real backend API
- [ ] Implement real database (PostgreSQL/MongoDB)
- [ ] Add payment gateway integration
- [ ] Email notifications
- [ ] Multi-login (Google, Facebook)
- [ ] Auto tour design system
- [ ] Tour guides booking system
- [ ] Advanced analytics dashboard
