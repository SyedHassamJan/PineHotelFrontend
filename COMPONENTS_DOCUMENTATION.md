# Pine Travel - Frontend Components Documentation

---

## 📋 Table of Contents
1. [Component Overview](#component-overview)
2. [Custom Components](#custom-components)
3. [UI Components (Shadcn)](#ui-components-shadcn)
4. [Layout Components](#layout-components)
5. [Page Components](#page-components)
6. [Component Usage Examples](#component-usage-examples)
7. [State Management Patterns](#state-management-patterns)
8. [Design System](#design-system)

---

## 🎨 Component Overview

### Technology Stack
- **Framework:** React 18 with Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** Shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner (toast)
- **Date Handling:** date-fns

---

## 🧩 Custom Components

### 1. Navbar Component
**Location:** [components/navbar.tsx](components/navbar.tsx)

**Description:** Main navigation bar with responsive design, role-based links

**Props:** None (uses client-side state and router)

**Features:**
- Responsive mobile menu (hamburger)
- Role-based navigation items (Customer, Hotel Owner, Super Admin)
- Authentication state handling
- Logo and branding
- Dropdown menus for user account
- Logout functionality

**Usage:**
```tsx
import Navbar from '@/components/navbar'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
```

**Key States:**
- `isOpen`: Mobile menu toggle
- `userRole`: Current user role from localStorage
- `isLoggedIn`: Authentication status

---

### 2. Footer Component
**Location:** [components/footer.tsx](components/footer.tsx)

**Description:** Site-wide footer with links, social media, newsletter

**Props:** None

**Features:**
- Company information and branding
- Quick links to pages
- Social media links
- Newsletter subscription form
- Copyright notice
- Responsive grid layout

**Usage:**
```tsx
import Footer from '@/components/footer'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
```

---

### 3. Conditional Layout
**Location:** [components/conditional-layout.tsx](components/conditional-layout.tsx)

**Description:** Wrapper component that conditionally renders Navbar and Footer based on route

**Props:**
```typescript
interface Props {
  children: React.ReactNode
}
```

**Features:**
- Hides Navbar/Footer on admin routes
- Responsive to pathname changes
- SSR compatible

**Usage:**
```tsx
import ConditionalLayout from '@/components/conditional-layout'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
```

**Excluded Routes:**
- `/admin/*`
- `/superadmin/*`
- `/login`
- `/register`

---

### 4. Hotel Card Component
**Location:** [components/hotel-card.tsx](components/hotel-card.tsx)

**Description:** Display card for hotel listings with image gallery, details, and actions

**Props:**
```typescript
interface HotelCardProps {
  hotel: {
    id: string
    name: string
    city: string
    country: string
    images: string[]
    description?: string
  }
  showActions?: boolean
  onBook?: () => void
}
```

**Features:**
- Image carousel with navigation
- Hotel name, location display
- Hover effects and animations
- Optional action buttons
- Responsive design
- Truncated descriptions

**Usage:**
```tsx
<HotelCard
  hotel={{
    id: "123",
    name: "Grand Hotel",
    city: "Paris",
    country: "France",
    images: ["url1", "url2"]
  }}
  showActions={true}
  onBook={() => router.push('/hotels/123')}
/>
```

---

### 5. Tour Card Component
**Location:** [components/tour-card.tsx](components/tour-card.tsx)

**Description:** Display card for tour packages with images and pricing

**Props:**
```typescript
interface TourCardProps {
  tour: {
    id: string
    title: string
    pricePerPerson: number
    locations: string
    cardImages: string[]
    description?: string
  }
  onBook?: () => void
}
```

**Features:**
- Image carousel
- Price per person display
- Location tags
- Smooth transitions
- Responsive grid layout

**Usage:**
```tsx
<TourCard
  tour={{
    id: "456",
    title: "Paris City Tour",
    pricePerPerson: 199.99,
    locations: "Paris, Eiffel Tower",
    cardImages: ["url1"]
  }}
  onBook={() => handleBooking()}
/>
```

---

### 6. Guide Card Component
**Location:** [components/guide-card.tsx](components/guide-card.tsx)

**Description:** Display card for tour guides with details and booking

**Props:**
```typescript
interface GuideCardProps {
  guide: {
    id: string
    name: string
    city: string
    languages: string[]
    experienceYears: number
    pricePerDay: number
    images: string[]
    description: string
  }
  onBook?: () => void
}
```

**Features:**
- Professional photo display
- Language tags
- Experience badge
- Price per day
- Rating display (if applicable)
- Booking button

**Usage:**
```tsx
<GuideCard
  guide={{
    id: "789",
    name: "Maria Garcia",
    city: "Barcelona",
    languages: ["English", "Spanish"],
    experienceYears: 10,
    pricePerDay: 150,
    images: ["url1"],
    description: "Expert guide..."
  }}
  onBook={() => openBookingModal()}
/>
```

---

### 7. Room Type Card Component
**Location:** [components/room-type-card.tsx](components/room-type-card.tsx)

**Description:** Display card for hotel room types with amenities and booking

**Props:**
```typescript
interface RoomTypeCardProps {
  room: {
    id: string
    name: string
    type: string
    price: number
    maxGuests: number
    amenities: string[]
    images: string[]
    description: string
  }
  onBook?: () => void
}
```

**Features:**
- Room image gallery
- Price per night display
- Amenity icons/list
- Max guests capacity
- Room type badge
- Book now button

**Usage:**
```tsx
<RoomTypeCard
  room={{
    id: "101",
    name: "Deluxe Suite",
    type: "SUITE",
    price: 299.99,
    maxGuests: 4,
    amenities: ["WiFi", "TV"],
    images: ["url1"],
    description: "Spacious suite..."
  }}
  onBook={() => bookRoom()}
/>
```

---

### 8. Filter Sidebar Component
**Location:** [components/filter-sidebar.tsx](components/filter-sidebar.tsx)

**Description:** Filter panel for search results (hotels, tours, cars)

**Props:**
```typescript
interface FilterSidebarProps {
  type: 'hotel' | 'tour' | 'car'
  onFilterChange: (filters: FilterOptions) => void
}
```

**Features:**
- Price range slider
- Category checkboxes
- Location filters
- Rating filters
- Clear all filters button
- Mobile responsive (drawer)

**Usage:**
```tsx
<FilterSidebar
  type="hotel"
  onFilterChange={(filters) => {
    setAppliedFilters(filters)
  }}
/>
```

---

### 9. Guide Booking Modal Component
**Location:** [components/guide-booking-modal.tsx](components/guide-booking-modal.tsx)

**Description:** Modal dialog for booking tour guides with date selection

**Props:**
```typescript
interface GuideBookingModalProps {
  guide: TourGuide
  isOpen: boolean
  onClose: () => void
  onSubmit: (bookingData: GuideBookingData) => void
}
```

**Features:**
- Date range picker
- Contact information form
- Price calculation
- Special requests textarea
- Validation
- Confirmation dialog

**Usage:**
```tsx
<GuideBookingModal
  guide={selectedGuide}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={async (data) => {
    await createBooking(data)
  }}
/>
```

---

### 10. Section Header Component
**Location:** [components/section-header.tsx](components/section-header.tsx)

**Description:** Reusable header for page sections with title and description

**Props:**
```typescript
interface SectionHeaderProps {
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}
```

**Features:**
- Customizable alignment
- Optional description
- Consistent styling
- Responsive typography

**Usage:**
```tsx
<SectionHeader
  title="Popular Hotels"
  description="Discover the best places to stay"
  align="center"
/>
```

---

### 11. Super Admin Sidebar
**Location:** [components/superadmin-sidebar.tsx](components/superadmin-sidebar.tsx)

**Description:** Navigation sidebar for Super Admin dashboard

**Props:** None (uses router context)

**Features:**
- Collapsible menu
- Active route highlighting
- Icon navigation items
- Role-based menu items
- Responsive (drawer on mobile)

**Menu Items:**
- Dashboard
- Hotels Management
- Tours Management
- Guides Management
- Cars Management
- All Bookings (4 types)
- Analytics & Reports
- User Management
- Settings

**Usage:**
```tsx
export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex">
      <SuperAdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

---

### 12. Super Admin Header
**Location:** [components/superadmin-header.tsx](components/superadmin-header.tsx)

**Description:** Top header bar for Super Admin with notifications and profile

**Props:**
```typescript
interface SuperAdminHeaderProps {
  title: string
}
```

**Features:**
- Page title display
- Notifications dropdown
- User profile menu
- Search bar (optional)
- Breadcrumb navigation

**Usage:**
```tsx
<SuperAdminHeader title="Dashboard" />
```

---

### 13. Stats Card Component
**Location:** [components/superadmin/stats-card.tsx](components/superadmin/stats-card.tsx)

**Description:** Dashboard statistics card with icon and metrics

**Props:**
```typescript
interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}
```

**Features:**
- Large value display
- Icon with colored background
- Trend indicator (up/down arrow)
- Percentage change
- Responsive sizing

**Usage:**
```tsx
<StatsCard
  title="Total Hotels"
  value={245}
  icon={<Hotel className="h-6 w-6" />}
  trend={{ value: 12, isPositive: true }}
  color="blue"
/>
```

---

### 14. Recent Activity Component
**Location:** [components/superadmin/recent-activity.tsx](components/superadmin/recent-activity.tsx)

**Description:** Timeline list of recent platform activities

**Props:**
```typescript
interface RecentActivityProps {
  activities: Activity[]
}
```

**Features:**
- Timeline design
- Activity icons
- Timestamp display
- Activity type badges
- Scrollable list

**Usage:**
```tsx
<RecentActivity
  activities={[
    {
      type: 'booking',
      message: 'New hotel booking by John Doe',
      timestamp: '2 hours ago'
    }
  ]}
/>
```

---

### 15. Quick Actions Component
**Location:** [components/superadmin/quick-actions.tsx](components/superadmin/quick-actions.tsx)

**Description:** Quick action buttons grid for common admin tasks

**Props:** None (uses router for navigation)

**Features:**
- Grid layout of action cards
- Icon buttons
- Hover effects
- Responsive grid

**Actions:**
- Add New Hotel
- Create Tour
- Add Tour Guide
- Add Car
- View Bookings
- Generate Report

**Usage:**
```tsx
<QuickActions />
```

---

### 16. Pending Approvals Component
**Location:** [components/superadmin/pending-approvals.tsx](components/superadmin/pending-approvals.tsx)

**Description:** List of pending hotel/guide submissions requiring approval

**Props:**
```typescript
interface PendingApprovalsProps {
  approvals: PendingApproval[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}
```

**Features:**
- Submission details
- Approve/Reject buttons
- Submission type badges
- Date submitted
- Quick preview

**Usage:**
```tsx
<PendingApprovals
  approvals={pendingList}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

---

### 17. Admin Users Component
**Location:** [components/superadmin/admin-users.tsx](components/superadmin/admin-users.tsx)

**Description:** User management table with roles and actions

**Props:**
```typescript
interface AdminUsersProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}
```

**Features:**
- User table with sorting
- Role badges
- Status indicators
- Edit/Delete actions
- Search and filter

**Usage:**
```tsx
<AdminUsers
  users={userList}
  onEdit={openEditDialog}
  onDelete={confirmDelete}
/>
```

---

## 🎨 UI Components (Shadcn)

### Core UI Components

All UI components are from Shadcn/ui library located in `components/ui/`

#### Button
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

#### Dialog (Modal)
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button onClick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Input
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

#### Table
```tsx
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table'

<Table>
  <TableCaption>List of items</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Dropdown Menu
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete}>
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Badge
```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Cancelled</Badge>
<Badge variant="outline">Draft</Badge>

// Custom colors
<Badge className="bg-green-500 text-white">Confirmed</Badge>
```

#### Alert Dialog
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Calendar
```tsx
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

#### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content 1
  </TabsContent>
  <TabsContent value="tab2">
    Content 2
  </TabsContent>
</Tabs>
```

#### Accordion
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1</AccordionTrigger>
    <AccordionContent>
      Answer 1
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Toast Notifications
```tsx
import { toast } from 'sonner'

// Success
toast.success('Operation successful!')

// Error
toast.error('Something went wrong!')

// Info
toast.info('Information message')

// Warning
toast.warning('Warning message')

// Custom
toast('Custom message', {
  description: 'Description text',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo')
  }
})
```

---

## 📄 Page Components

### Public Pages

#### 1. Home Page
**Location:** [app/page.tsx](app/page.tsx)

**Features:**
- Hero section with search
- Featured hotels carousel
- Popular tours grid
- Available tour guides
- Testimonials
- Newsletter signup

#### 2. Hotels Listing
**Location:** [app/hotels/page.tsx](app/hotels/page.tsx)

**Features:**
- Grid of hotel cards
- Filter sidebar
- Search functionality
- Pagination
- Sort options

#### 3. Hotel Details
**Location:** [app/hotels/[id]/page.tsx](app/hotels/[id]/page.tsx)

**Features:**
- Hotel image gallery
- Room types list
- Amenities display
- Location map
- Reviews section
- Booking form

#### 4. Tours Listing
**Location:** [app/tours/page.tsx](app/tours/page.tsx)

**Features:**
- Grid of tour cards
- Search and filters
- Price sorting
- Location filters

#### 5. Tour Details
**Location:** [app/tours/[id]/page.tsx](app/tours/[id]/page.tsx)

**Features:**
- Tour image carousel
- Itinerary timeline
- Pricing calculator
- Booking modal
- Reviews

### Admin Pages (Hotel Owner)

#### 6. Admin Dashboard
**Location:** [app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx)

**Features:**
- Revenue statistics
- Booking overview
- Room occupancy chart
- Recent bookings table

#### 7. My Hotels
**Location:** [app/admin/my-hotels/page.tsx](app/admin/my-hotels/page.tsx)

**Features:**
- Hotel list for owner
- Edit hotel details
- Manage rooms
- View analytics

#### 8. Manage Rooms
**Location:** [app/admin/rooms/page.tsx](app/admin/rooms/page.tsx)

**Features:**
- Create/edit rooms
- Room availability toggle
- Pricing management
- Image upload

#### 9. Hotel Bookings
**Location:** [app/admin/bookings/page.tsx](app/admin/bookings/page.tsx)

**Features:**
- Bookings table
- Status updates
- Customer details
- Export functionality

### Super Admin Pages

#### 10. Super Admin Dashboard
**Location:** [app/superadmin/dashboard/page.tsx](app/superadmin/dashboard/page.tsx)

**Features:**
- Platform-wide statistics
- Revenue charts
- Recent activities
- Quick actions
- Pending approvals

#### 11. All Hotels Management
**Location:** [app/superadmin/all-hotels/page.tsx](app/superadmin/all-hotels/page.tsx)

**Features:**
- Complete hotels list
- Approval system
- Edit/delete hotels
- Search and filters

#### 12. Tours Management
**Location:** [app/superadmin/tours/page.tsx](app/superadmin/tours/page.tsx)

**Features:**
- CRUD operations
- Image management
- Pricing controls
- Status toggle

#### 13. Guides Management
**Location:** [app/superadmin/tour-guides/page.tsx](app/superadmin/tour-guides/page.tsx)

**Features:**
- Guide profiles
- Verification status
- Performance metrics
- Availability management

#### 14. Cars Management
**Location:** [app/superadmin/cars/page.tsx](app/superadmin/cars/page.tsx)

**Features:**
- Car listings table
- Add/edit cars
- Driver information
- Pricing management
- Image gallery
- Professional detail modal with colored rows

#### 15. All Bookings Views
**Locations:**
- [app/superadmin/bookings/page.tsx](app/superadmin/bookings/page.tsx) (Hotel Bookings)
- [app/superadmin/tour-bookings/page.tsx](app/superadmin/tour-bookings/page.tsx)
- [app/superadmin/guide-bookings/page.tsx](app/superadmin/guide-bookings/page.tsx)
- [app/superadmin/car-bookings/page.tsx](app/superadmin/car-bookings/page.tsx)

**Features:**
- Unified booking tables
- Status management
- Customer information
- Revenue tracking
- Export reports

---

## 🔧 State Management Patterns

### 1. Authentication State
```typescript
// Stored in localStorage
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [userRole, setUserRole] = useState<string | null>(null)

useEffect(() => {
  const token = localStorage.getItem('hotelOwnerAuth') || 
                localStorage.getItem('superadminAuth')
  const role = localStorage.getItem('userRole')
  
  setIsLoggedIn(!!token)
  setUserRole(role)
}, [])
```

### 2. Data Fetching Pattern
```typescript
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/endpoint`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])
```

### 3. Form State Pattern
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }))
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Submit logic
}
```

### 4. Modal/Dialog State
```typescript
const [isOpen, setIsOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState(null)

const openModal = (item) => {
  setSelectedItem(item)
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
  setSelectedItem(null)
}
```

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
/* Blue - Primary accent */
--blue-500: #3B82F6
--blue-600: #2563EB

/* Green - Success states */
--green-500: #10B981
--green-600: #059669

/* Orange - Warnings */
--orange-500: #F97316
--orange-600: #EA580C

/* Cyan - Info */
--cyan-500: #06B6D4
--cyan-600: #0891B2

/* Amber - Highlights */
--amber-500: #F59E0B
--amber-600: #D97706
```

#### Neutral Colors
```css
--slate-50: #F8FAFC
--slate-100: #F1F5F9
--slate-200: #E2E8F0
--slate-500: #64748B
--slate-800: #1E293B
--slate-900: #0F172A
```

### Typography

```css
/* Headings */
h1: text-4xl font-bold (36px)
h2: text-3xl font-semibold (30px)
h3: text-2xl font-semibold (24px)
h4: text-xl font-medium (20px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)

/* Font Families */
font-sans: System UI, Helvetica
font-mono: monospace
```

### Spacing Scale

```css
/* Tailwind spacing */
space-1: 0.25rem (4px)
space-2: 0.5rem (8px)
space-3: 0.75rem (12px)
space-4: 1rem (16px)
space-5: 1.25rem (20px)
space-6: 1.5rem (24px)
space-8: 2rem (32px)
space-10: 2.5rem (40px)
```

### Border Radius

```css
rounded-sm: 0.125rem (2px)
rounded: 0.25rem (4px)
rounded-md: 0.375rem (6px)
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-full: 9999px
```

### Shadows

```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow: 0 1px 3px rgba(0,0,0,0.1)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Button Styles

```tsx
// Primary Button
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline" className="border-slate-300 hover:bg-slate-50">
  Secondary Action
</Button>

// Destructive Button
<Button variant="destructive" className="bg-red-600 hover:bg-red-700">
  Delete
</Button>

// Ghost Button
<Button variant="ghost" className="hover:bg-slate-100">
  Cancel
</Button>
```

### Card Styles

```tsx
// Standard Card
<Card className="border border-slate-200 shadow-sm">
  {/* Content */}
</Card>

// Colored Border Card
<Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
  {/* Content */}
</Card>

// Elevated Card
<Card className="shadow-lg hover:shadow-xl transition-shadow">
  {/* Content */}
</Card>
```

### Status Badges

```tsx
// Pending
<Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>

// Confirmed
<Badge className="bg-green-100 text-green-800">Confirmed</Badge>

// Cancelled
<Badge className="bg-red-100 text-red-800">Cancelled</Badge>

// Completed
<Badge className="bg-blue-100 text-blue-800">Completed</Badge>
```

---

## 📝 Component Best Practices

### 1. Server vs Client Components
```tsx
// Server Component (default)
export default async function ServerPage() {
  const data = await fetchData()
  return <div>{/* render */}</div>
}

// Client Component (with 'use client')
'use client'
export default function ClientComponent() {
  const [state, setState] = useState()
  return <div>{/* render */}</div>
}
```

### 2. Error Boundaries
```tsx
'use client'
export default function ErrorBoundary({ error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-red-600">
        Something went wrong!
      </h2>
      <p className="text-slate-600 mt-2">{error.message}</p>
    </div>
  )
}
```

### 3. Loading States
```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
    </div>
  )
}
```

### 4. Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>

<div className="hidden md:flex">
  {/* Hidden on mobile, visible on tablet+ */}
</div>

<div className="md:hidden">
  {/* Visible on mobile only */}
</div>
```

---

*Components Documentation Version: 1.0*  
*Last Updated: February 13, 2026*
