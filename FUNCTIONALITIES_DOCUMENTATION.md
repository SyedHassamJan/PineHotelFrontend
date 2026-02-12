# Pine Travel - Tourism Booking Platform
## Frontend & Backend Functionalities Documentation

---

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Authentication](#user-roles--authentication)
3. [Frontend Features by Module](#frontend-features-by-module)
4. [Backend API Integrations](#backend-api-integrations)
5. [Complete Feature List](#complete-feature-list)
6. [Technical Implementation](#technical-implementation)

---

## 🎯 System Overview

**Pine Travel** is a comprehensive tourism booking platform built with **Next.js 14** (App Router) on the frontend and a **Node.js/Express** backend with **Prisma ORM** and **PostgreSQL** database.

### Technology Stack
- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Shadcn/ui
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL (Neon/Supabase)
- **Image Storage:** Cloudinary
- **Authentication:** JWT + localStorage
- **State Management:** React Hooks

---

## 👥 User Roles & Authentication

### 1. **Regular Users (Customers)**
- **Purpose:** Browse and book travel services
- **Access:** Public pages with optional login
- **Features:** Hotel booking, tour booking, car rental, guide booking
- **Layout:** Full website with Navbar and Footer

### 2. **Hotel Owners**
- **Login:** `/admin/login`
- **Auth Storage:** `hotelOwnerAuth` in localStorage
- **Test Credentials:** 
  - Email: `owner@hotels.com`
  - Password: `owner123`
- **Features:** Hotel management, room management, booking management
- **Layout:** Dashboard layout (no Navbar/Footer)

### 3. **Super Admin**
- **Login:** `/superadmin/login`
- **Auth Storage:** `superadminAuth` in localStorage
- **Test Credentials:**
  - Email: `superadmin@travelhub.com`
  - Password: `super123`
- **Features:** Platform-wide management and analytics
- **Layout:** Admin dashboard layout (no Navbar/Footer)

---

## 🏛️ Frontend Features by Module

### A. PUBLIC PAGES (Customer-Facing)

#### 1. **Home Page** (`/`)
**Features:**
- Hero section with video background
- Multi-tab search interface (Hotels, Tours, Cars)
- Dynamic date picker with validation
- Featured hotels carousel
- Featured tours showcase
- Top tour guides display
- Featured cars section
- Popular destinations gallery
- Newsletter subscription
- Responsive design

**Backend Integration:**
```typescript
GET /api/hotels - Fetch all approved hotels
GET /api/tours?limit=4 - Fetch featured tours
GET /api/tour-guides?limit=4 - Fetch top guides
GET /api/cars - Fetch all cars
```

#### 2. **Hotels Listing** (`/hotels`)
**Features:**
- Grid display of approved hotels
- Search and filter functionality
- Price range display (calculated from rooms)
- Image thumbnails
- Rating display
- Location information
- Click to view hotel details

**Backend Integration:**
```typescript
GET /api/hotels - Fetch all hotels
GET /api/rooms/hotels/${hotelId}/rooms - Fetch rooms for pricing
```

#### 3. **Hotel Detail Page** (`/hotels/[id]`)
**Features:**
- Hotel image gallery with carousel
- Comprehensive hotel information
- Amenities list
- Location details
- Available rooms display
- Room type cards with pricing
- Room booking functionality
- Booking modal with form validation
- Guest count selection
- Date range selection
- Real-time price calculation

**Backend Integration:**
```typescript
GET /api/hotels - Fetch hotel details
GET /api/rooms/hotels/${hotelId}/rooms - Fetch available rooms
POST /api/bookings - Create hotel booking
```

**Booking Fields:**
- Guest name, email, phone
- Check-in/check-out dates
- Room selection
- Number of guests
- Special requests

#### 4. **Tours Listing** (`/tours`)
**Features:**
- Card-based tour display
- Search by title/location
- Price per person display
- Location badges
- Image preview
- Tour duration (if available)
- Responsive grid layout

**Backend Integration:**
```typescript
GET /api/tours - Fetch all tours
```

#### 5. **Tour Detail Page** (`/tours/[id]`)
**Features:**
- Tour image gallery
- Detailed tour description
- Price information
- Location information
- Duration details
- Booking modal
- Customer information form
- People count selector
- Notes/special requests field

**Backend Integration:**
```typescript
GET /api/tours/${id} - Fetch tour details
POST /api/tour-bookings - Create tour booking
```

**Booking Fields:**
- People count
- User name, email, phone
- Special notes/requests

#### 6. **Tour Guides Listing** (`/tour-guides`)
**Features:**
- Grid display of active guides
- Search by name/city/language
- Guide image display
- Languages spoken badges
- Experience years
- Price per day
- Rating (if available)
- City/location display
- "Book Now" functionality

**Backend Integration:**
```typescript
GET /api/tour-guides - Fetch active guides
POST /api/tour-guide-bookings - Create guide booking
```

#### 7. **Tour Guide Detail Page** (`/tour-guides/[id]`)
**Features:**
- Guide profile image
- Full biography
- Languages spoken
- Experience details
- Price per day
- Location information
- Booking modal via GuideBookingModal component
- Date range selection
- Customer contact form

**Booking Fields:**
- Start date, end date
- User name, email, phone
- Booking notes

#### 8. **Cars Listing** (`/cars`)
**Features:**
- Car cards with images
- Car name and model display
- City availability
- Driver option indicator
- Daily rate and place-to-place pricing
- Car specifications
- Click to view details

**Backend Integration:**
```typescript
GET /api/cars - Fetch all cars
```

#### 9. **Car Detail Page** (`/cars/[id]`)
**Features:**
- Car image gallery
- Car specifications
- Pricing information (daily & place-to-place)
- Driver availability
- Driver information (if applicable)
- Booking functionality
- Rental type selection (daily/place-to-place)
- Date range picker
- Location selection
- With/without driver option

**Backend Integration:**
```typescript
GET /api/cars/${id} - Fetch car details
POST /api/car-bookings - Create car rental booking
```

**Booking Fields:**
- Pickup/dropoff dates
- Pickup/dropoff cities
- Booking type (DAILY/PLACE_TO_PLACE)
- With driver option
- User name, email, phone

#### 10. **Search Pages**
- `/search/hotels` - Hotel search results
- `/search/cars` - Car search results

#### 11. **Other Public Pages**
- `/about` - About us page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/login` - Customer login
- `/register` - Customer registration

---

### B. HOTEL OWNER DASHBOARD (`/admin/*`)

#### 1. **Hotel Owner Login** (`/admin/login`)
**Features:**
- Email/password authentication
- Session management with localStorage
- Redirect to dashboard on success
- Error handling

**Auth Storage:**
```typescript
localStorage.setItem("hotelOwnerAuth", "true")
localStorage.setItem("user", JSON.stringify(userData))
```

#### 2. **Dashboard** (`/admin/dashboard`)
**Features:**
- Overview statistics
- Quick access to key features
- Recent bookings summary
- Hotel performance metrics

#### 3. **My Hotels** (`/admin/my-hotels`)
**Features:**
- List of owner's hotels
- Hotel status indicators
- Edit hotel details
- Add new hotel
- View hotel bookings
- Manage room inventory

**Backend Integration:**
```typescript
GET /api/hotels - Fetch owner's hotels (filtered by user.id)
POST /api/hotels - Create new hotel
PATCH /api/hotels/${id} - Update hotel
DELETE /api/hotels/${id} - Delete hotel
```

#### 4. **Bookings Management** (`/admin/bookings`)
**Features:**
- View all hotel bookings
- Filter by status (pending, confirmed, cancelled)
- Booking statistics
- Update booking status
- View customer details
- Date range filtering

**Backend Integration:**
```typescript
GET /api/bookings/hotel/${userId} - Fetch hotel owner's bookings
PATCH /api/bookings/${id}/status - Update booking status
```

**Booking Statuses:**
- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

#### 5. **Room Management** (`/admin/rooms`)
**Features:**
- List all rooms for owner's hotels
- Add new room types
- Edit room details
- Delete rooms
- Set pricing
- Manage availability
- Image upload for rooms

**Backend Integration:**
```typescript
GET /api/rooms/hotels/${hotelId}/rooms - Fetch rooms
POST /api/rooms - Create room
PATCH /api/rooms/${id} - Update room
DELETE /api/rooms/${id} - Delete room
```

#### 6. **Settings** (`/admin/settings`)
**Features:**
- Profile management
- Password change
- Notification preferences
- Account settings

---

### C. SUPER ADMIN DASHBOARD (`/superadmin/*`)

#### 1. **Super Admin Login** (`/superadmin/login`)
**Features:**
- Secure admin authentication
- Session management
- Role verification
- Dashboard redirect

**Auth Storage:**
```typescript
localStorage.setItem("superadminAuth", "true")
localStorage.setItem("access_token", token)
```

#### 2. **Dashboard** (`/superadmin/dashboard`)
**Features:**
- Platform-wide statistics
- Total hotels, tours, guides, cars
- Monthly revenue breakdown
- Booking analytics
- Revenue charts
- Recent activity feed
- Quick action buttons

**Backend Integration:**
```typescript
GET /api/summary - Fetch platform statistics
```

**Statistics Displayed:**
- Total hotels, tours, guides, cars
- Monthly bookings (hotel, tour, guide, car)
- Monthly revenue per category
- Total platform revenue

#### 3. **User Management** (`/superadmin/users`)
**Features:**
- View all hotel owners
- User details
- Activate/deactivate accounts
- User status management
- Delete users
- View user's hotels

**Backend Integration:**
```typescript
GET /api/hotels - Fetch all users (hotel owners)
PATCH /api/hotels/${userId}/status - Update user status
DELETE /api/hotels/${userId} - Delete user
```

#### 4. **Hotels Management** (`/superadmin/all-hotels`)
**Features:**
- View all hotels (all statuses)
- Hotel details view
- Approve/reject hotels
- Edit hotel information
- Delete hotels
- View hotel images
- Status management

**Backend Integration:**
```typescript
GET /api/hotels - Fetch all hotels
GET /api/hotels/${id} - Fetch hotel details
PATCH /api/hotels/${id} - Update hotel
DELETE /api/hotels/${id} - Delete hotel
PATCH /api/hotels/${id}/status - Update status
```

#### 5. **Hotel Submissions** (`/superadmin/hotel-submissions`)
**Features:**
- View pending hotel submissions
- Image carousel for review
- Approve hotels
- Reject hotels with reasons
- Create hotel owner accounts
- Email notifications (if configured)

**Backend Integration:**
```typescript
GET /api/hotels - Fetch pending hotels
PATCH /api/hotels/${id}/status - Approve/reject
POST /api/hotels/create-owner - Create hotel owner account
```

#### 6. **Tours Management** (`/superadmin/tours`)
**Features:**
- View all tours
- Pagination support
- Add new tour
- Edit tour details
- Delete tours
- Upload tour images
- Manage locations
- Set pricing

**Backend Integration:**
```typescript
GET /api/tours?page=${page}&limit=10 - Fetch tours (paginated)
POST /api/tours - Create tour
PATCH /api/tours/${id} - Update tour
DELETE /api/tours/${id} - Delete tour
```

**Tour Fields:**
- Title
- Description
- Price per person
- Locations (comma-separated)
- Card images (multiple)

#### 7. **Tour Bookings** (`/superadmin/tour-bookings`)
**Features:**
- View all tour bookings
- Filter by status
- Search bookings
- View customer details
- Update booking status
- Booking details page

**Backend Integration:**
```typescript
GET /api/tour-bookings - Fetch all tour bookings
GET /api/tour-bookings/${id} - Fetch booking details
PATCH /api/tour-bookings/${id}/status - Update status
```

#### 8. **Tour Guides Management** (`/superadmin/tour-guides`)
**Features:**
- View all tour guides
- Add new guide
- Edit guide details
- Delete guides
- Toggle active status
- Upload guide images
- Manage languages
- Set pricing

**Backend Integration:**
```typescript
GET /api/tour-guides - Fetch all guides
POST /api/tour-guides - Create guide
PATCH /api/tour-guides/${id} - Update guide
DELETE /api/tour-guides/${id} - Delete guide
```

**Guide Fields:**
- Name, email, phone
- City
- Languages (multiple)
- Experience years
- Price per day
- Description
- Images (multiple)
- Active status

#### 9. **Guide Bookings** (`/superadmin/guide-bookings`)
**Features:**
- View all guide bookings
- Search and filter
- Update booking status
- View booking details
- Customer information
- Date range display

**Backend Integration:**
```typescript
GET /api/tour-guide-bookings - Fetch all guide bookings
GET /api/tour-guide-bookings/${id} - Fetch booking details
PATCH /api/tour-guide-bookings/${id}/status - Update status
```

#### 10. **Cars Management** (`/superadmin/cars`)
**Features:**
- View all cars
- Add new car
- Edit car details
- Delete cars
- Upload car images
- Driver information management
- Pricing setup (daily & place-to-place)
- View detailed car info

**Backend Integration:**
```typescript
GET /api/cars - Fetch all cars
POST /api/cars - Create car
PATCH /api/cars/${id} - Update car
DELETE /api/cars/${id} - Delete car
```

**Car Fields:**
- Name, model, city
- Has driver (boolean)
- Driver info (name, email, phone, images, price)
- Price per day
- Price place to place
- Description
- Images (multiple)

**Car Creation Features:**
- Multi-image upload
- Driver option toggle
- Conditional driver information fields
- Image preview and removal
- Form validation

#### 11. **Car Bookings** (`/superadmin/car-bookings`)
**Features:**
- View all car rental bookings
- Search by customer/car/location
- Filter by status
- Update booking status
- View booking details
- Customer contact information
- Booking timeline

**Backend Integration:**
```typescript
GET /api/car-bookings - Fetch all car bookings
GET /api/car-bookings/${id} - Fetch booking details
PATCH /api/car-bookings/${id}/status - Update status
```

**Car Booking Details:**
- Booking ID
- Customer info (name, email, phone)
- Car details
- Pickup/dropoff cities
- Pickup/dropoff dates
- Booking type (DAILY/PLACE_TO_PLACE)
- Driver option
- Final price
- Status

#### 12. **Analytics** (`/superadmin/analytics`)
**Features:**
- Revenue charts
- Booking trends
- Performance metrics
- Platform growth analytics

#### 13. **Reports** (`/superadmin/reports`)
**Features:**
- Generate custom reports
- Export data
- Financial reports
- Booking reports

#### 14. **Notifications** (`/superadmin/notifications`)
**Features:**
- System notifications
- Booking alerts
- Platform updates

#### 15. **Settings** (`/superadmin/settings`)
**Features:**
- Platform settings
- Admin profile
- Configuration options

---

## 🔌 Backend API Integrations

### Authentication APIs
```typescript
POST /api/auth/hotel-owner/login - Hotel owner login
POST /api/auth/superadmin/login - Super admin login
POST /api/auth/register - Customer registration
POST /api/auth/login - Customer login
```

### Hotels APIs
```typescript
GET /api/hotels - Get all hotels
GET /api/hotels/${id} - Get hotel by ID
POST /api/hotels - Create hotel
PATCH /api/hotels/${id} - Update hotel
DELETE /api/hotels/${id} - Delete hotel
PATCH /api/hotels/${id}/status - Update hotel status
POST /api/hotels/create-owner - Create hotel owner account
```

### Rooms APIs
```typescript
GET /api/rooms/hotels/${hotelId}/rooms - Get rooms for hotel
POST /api/rooms - Create room
PATCH /api/rooms/${id} - Update room
DELETE /api/rooms/${id} - Delete room
```

### Hotel Bookings APIs
```typescript
GET /api/bookings - Get all bookings
GET /api/bookings/hotel/${userId} - Get bookings for hotel owner
GET /api/bookings/${id} - Get booking details
POST /api/bookings - Create booking
PATCH /api/bookings/${id}/status - Update booking status
DELETE /api/bookings/${id} - Delete booking
```

### Tours APIs
```typescript
GET /api/tours - Get all tours (supports ?page, ?limit, ?search)
GET /api/tours/${id} - Get tour by ID
POST /api/tours - Create tour
PATCH /api/tours/${id} - Update tour
DELETE /api/tours/${id} - Delete tour
```

### Tour Bookings APIs
```typescript
GET /api/tour-bookings - Get all tour bookings
GET /api/tour-bookings/${id} - Get tour booking details
POST /api/tour-bookings - Create tour booking
PATCH /api/tour-bookings/${id}/status - Update tour booking status
```

### Tour Guides APIs
```typescript
GET /api/tour-guides - Get all tour guides (supports ?limit)
GET /api/tour-guides/${id} - Get guide by ID
POST /api/tour-guides - Create tour guide
PATCH /api/tour-guides/${id} - Update tour guide
DELETE /api/tour-guides/${id} - Delete tour guide
```

### Guide Bookings APIs
```typescript
GET /api/tour-guide-bookings - Get all guide bookings
GET /api/tour-guide-bookings/${id} - Get guide booking details
POST /api/tour-guide-bookings - Create guide booking
PATCH /api/tour-guide-bookings/${id}/status - Update guide booking status
```

### Cars APIs
```typescript
GET /api/cars - Get all cars
GET /api/cars/${id} - Get car by ID
POST /api/cars - Create car (with driver info)
PATCH /api/cars/${id} - Update car
DELETE /api/cars/${id} - Delete car
```

### Car Bookings APIs
```typescript
GET /api/car-bookings - Get all car bookings
GET /api/car-bookings/${id} - Get car booking details
POST /api/car-bookings - Create car booking
PATCH /api/car-bookings/${id}/status - Update car booking status
```

### Analytics APIs
```typescript
GET /api/summary - Get platform summary statistics
```

---

## ✨ Complete Feature List

### Customer Features
✅ Browse hotels with search and filters  
✅ View hotel details and available rooms  
✅ Book hotel rooms with date selection  
✅ Browse tours with search  
✅ View tour details and locations  
✅ Book tour packages  
✅ Browse tour guides with filters  
✅ View guide profiles  
✅ Book tour guides for custom dates  
✅ Browse available cars  
✅ View car details and driver options  
✅ Book cars with/without driver  
✅ Select rental type (daily/place-to-place)  
✅ Responsive design across all pages  
✅ Image galleries for all entities  

### Hotel Owner Features
✅ Secure login and authentication  
✅ Dashboard with overview  
✅ Manage hotel listings  
✅ Add/edit/delete hotels  
✅ Upload hotel images  
✅ Manage room types and pricing  
✅ View and manage bookings  
✅ Update booking statuses  
✅ Filter bookings by status  
✅ View customer information  
✅ Profile and settings management  

### Super Admin Features
✅ Secure admin login  
✅ Comprehensive dashboard with analytics  
✅ Platform-wide statistics  
✅ Monthly revenue breakdown  
✅ User management (hotel owners)  
✅ Activate/deactivate user accounts  
✅ Manage all hotels (pending/approved/rejected)  
✅ Hotel submission approval workflow  
✅ Create hotel owner accounts  
✅ Tour management (CRUD operations)  
✅ Tour booking management  
✅ Tour guide management (CRUD operations)  
✅ Guide booking management  
✅ Car fleet management (CRUD operations)  
✅ Driver information management  
✅ Car booking management  
✅ Multi-image upload for all entities  
✅ Image carousel for viewing  
✅ Status management for bookings  
✅ Search and filter functionality  
✅ Pagination support  
✅ Delete operations with confirmations  

### Technical Features
✅ JWT authentication  
✅ Role-based access control  
✅ LocalStorage session management  
✅ Image upload to Cloudinary  
✅ Multi-image support  
✅ Form validation  
✅ Error handling and toast notifications  
✅ Loading states  
✅ Responsive layouts  
✅ Modal dialogs  
✅ Dropdown menus  
✅ Date pickers  
✅ Image carousels  
✅ Search functionality  
✅ Filter and sort  
✅ Pagination  
✅ Conditional rendering  
✅ API integration with error handling  
✅ Environment variable configuration  
✅ TypeScript type safety  
✅ Server-side rendering (Next.js)  
✅ Client-side routing  

---

## 🛠️ Technical Implementation

### Frontend Architecture
```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── hotels/                  # Hotel pages
│   ├── tours/                   # Tour pages
│   ├── tour-guides/             # Guide pages
│   ├── cars/                    # Car pages
│   ├── admin/                   # Hotel owner dashboard
│   └── superadmin/              # Super admin dashboard
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── navbar.tsx               # Navigation
│   ├── footer.tsx               # Footer
│   ├── hotel-card.tsx           # Hotel card
│   ├── tour-card.tsx            # Tour card
│   ├── guide-card.tsx           # Guide card
│   └── guide-booking-modal.tsx  # Booking modal
└── lib/                         # Utilities
    └── utils.ts                 # Helper functions
```

### State Management
- React useState for local state
- useEffect for data fetching
- localStorage for session persistence
- Toast notifications for user feedback

### Form Handling
- Controlled components
- Real-time validation
- Error messages
- Loading states
- FormData for file uploads

### Image Management
- Multiple image upload
- Preview before upload
- Image removal
- Cloudinary integration
- Responsive images

### API Communication
- Fetch API
- Async/await
- Error handling
- Environment variables for base URL
- Token-based authentication

### Routing Strategy
- Next.js App Router (file-based)
- Dynamic routes with [id]
- Programmatic navigation
- Protected routes with auth checks
- Role-based redirection

### UI/UX Features
- Professional design system
- Consistent color scheme (blue, green, orange, cyan, amber)
- Hover effects and transitions
- Loading skeletons
- Empty states
- Confirmation dialogs
- Responsive grid layouts
- Mobile-friendly navigation

---

## 📊 Booking Status Flow

### Hotel Bookings
```
PENDING → CONFIRMED → COMPLETED
        ↓
    CANCELLED
```

### Tour Bookings
```
PENDING → CONFIRMED → COMPLETED
        ↓
    CANCELLED
```

### Guide Bookings
```
PENDING → CONFIRMED → COMPLETED
        ↓
    CANCELLED
```

### Car Bookings
```
PENDING → CONFIRMED → COMPLETED
        ↓
    CANCELLED
```

---

## 🔐 Security Features

✅ Password hashing (backend)  
✅ JWT tokens for authentication  
✅ Protected routes with auth guards  
✅ Role-based access control  
✅ Input validation and sanitization  
✅ XSS protection  
✅ CORS configuration  
✅ Environment variable security  
✅ Secure file uploads  

---

## 📱 Responsive Design

✅ Mobile-first approach  
✅ Breakpoints: sm, md, lg, xl, 2xl  
✅ Touch-friendly interfaces  
✅ Adaptive layouts  
✅ Responsive images  
✅ Mobile navigation menu  
✅ Grid system responsive behavior  

---

## 🎨 Design System

### Color Palette
- **Primary:** Blue (car badges, icons)
- **Success:** Green (confirmations, completed)
- **Warning:** Yellow/Amber (pending, alerts)
- **Danger:** Red (cancellations, delete)
- **Info:** Cyan (information)
- **Neutral:** Slate/Gray (backgrounds, borders)

### Components
- Cards with hover effects
- Badges for statuses
- Buttons with variants (primary, secondary, outline, destructive)
- Input fields with validation
- Modals and dialogs
- Dropdown menus
- Tables with sorting
- Image galleries
- Date pickers
- Loading spinners

---

## 📈 Future Enhancements (Potential)

- Payment gateway integration
- Email notifications
- SMS notifications
- Real-time availability checking
- Advanced search filters
- User reviews and ratings
- Wishlist functionality
- Booking history for customers
- Calendar view for bookings
- Export reports to PDF/Excel
- Multi-language support
- Currency conversion
- Social media integration
- Chat support
- Push notifications
- Mobile app (React Native)

---

## 🏁 Conclusion

Pine Travel is a full-featured tourism booking platform with comprehensive management capabilities for hotels, tours, tour guides, and car rentals. The system supports three distinct user roles with tailored interfaces and functionalities, backed by a robust REST API and modern frontend framework.

**Total Entities Managed:** Hotels, Rooms, Tours, Tour Guides, Cars, and 4 types of bookings  
**Total Pages:** 50+ pages  
**Total API Endpoints:** 40+ endpoints  
**User Roles:** 3 (Customer, Hotel Owner, Super Admin)  

---

*Documentation generated: February 13, 2026*  
*Last updated: February 13, 2026*
