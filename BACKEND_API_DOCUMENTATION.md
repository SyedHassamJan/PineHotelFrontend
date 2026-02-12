# Pine Travel - Backend API Documentation

---

## 📋 Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Hotels Module](#hotels-module)
4. [Rooms Module](#rooms-module)
5. [Hotel Bookings Module](#hotel-bookings-module)
6. [Tours Module](#tours-module)
7. [Tour Bookings Module](#tour-bookings-module)
8. [Tour Guides Module](#tour-guides-module)
9. [Guide Bookings Module](#guide-bookings-module)
10. [Cars Module](#cars-module)
11. [Car Bookings Module](#car-bookings-module)
12. [Analytics Module](#analytics-module)
13. [Data Models](#data-models)
14. [Error Handling](#error-handling)

---

## 🌐 API Overview

**Base URL:** `http://localhost:3001/api` (Development)  
**Base URL:** `${NEXT_PUBLIC_BASE_URL}/api` (Production)

**Content Type:** `application/json` (except file uploads)  
**Authentication:** JWT Bearer Token (for protected routes)

### Environment Configuration
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3001/
```

---

## 🔐 Authentication

### Hotel Owner Login
```http
POST /api/auth/hotel-owner/login
Content-Type: application/json

Request Body:
{
  "email": "owner@hotels.com",
  "password": "owner123"
}

Response: 200 OK
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "owner@hotels.com",
    "name": "Hotel Owner Name",
    "role": "HOTEL_OWNER"
  }
}
```

### Super Admin Login
```http
POST /api/auth/superadmin/login
Content-Type: application/json

Request Body:
{
  "email": "superadmin@travelhub.com",
  "password": "super123"
}

Response: 200 OK
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "email": "superadmin@travelhub.com",
    "role": "SUPERADMIN"
  }
}
```

### Customer Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

---

## 🏨 Hotels Module

### Get All Hotels
```http
GET /api/hotels
Authorization: Bearer {token} (optional)

Response: 200 OK
[
  {
    "id": "hotel_id",
    "name": "Grand Hotel",
    "email": "info@grandhotel.com",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA",
    "address": "123 Main St",
    "description": "Luxury hotel in downtown",
    "status": "approved", // "pending" | "approved" | "rejected"
    "images": ["url1", "url2"],
    "role": "HOTEL_OWNER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Hotel by ID
```http
GET /api/hotels/:id
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "id": "hotel_id",
  "name": "Grand Hotel",
  // ... hotel details
}
```

### Create Hotel
```http
POST /api/hotels
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- name: string (required)
- email: string (required)
- phone: string (required)
- city: string (required)
- country: string (required)
- address: string (required)
- description: string (required)
- password: string (required)
- images: File[] (multiple files)

Response: 201 Created
{
  "id": "new_hotel_id",
  "name": "New Hotel",
  // ... hotel details
  "status": "pending"
}
```

### Update Hotel
```http
PATCH /api/hotels/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data: (all optional)
- name: string
- email: string
- phone: string
- city: string
- country: string
- address: string
- description: string
- images: File[]

Response: 200 OK
{
  "id": "hotel_id",
  // ... updated hotel details
}
```

### Delete Hotel
```http
DELETE /api/hotels/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Hotel deleted successfully"
}
```

### Update Hotel Status
```http
PATCH /api/hotels/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "approved" // "pending" | "approved" | "rejected"
}

Response: 200 OK
{
  "id": "hotel_id",
  "status": "approved"
}
```

### Create Hotel Owner Account
```http
POST /api/hotels/create-owner
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "email": "newowner@hotel.com",
  "password": "password123",
  "name": "Hotel Name"
}

Response: 201 Created
{
  "id": "owner_id",
  "email": "newowner@hotel.com"
}
```

---

## 🛏️ Rooms Module

### Get Rooms for Hotel
```http
GET /api/rooms/hotels/:hotelId/rooms

Response: 200 OK
[
  {
    "id": "room_id",
    "hotelId": "hotel_id",
    "name": "Deluxe Suite",
    "type": "SUITE",
    "price": 299.99,
    "description": "Spacious suite with ocean view",
    "amenities": ["WiFi", "TV", "Mini Bar"],
    "maxGuests": 4,
    "images": ["url1", "url2"],
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Room
```http
POST /api/rooms
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- hotelId: string (required)
- name: string (required)
- type: string (required)
- price: number (required)
- description: string (required)
- amenities: string[] (comma-separated)
- maxGuests: number (required)
- images: File[]

Response: 201 Created
{
  "id": "new_room_id",
  // ... room details
}
```

### Update Room
```http
PATCH /api/rooms/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Response: 200 OK
```

### Delete Room
```http
DELETE /api/rooms/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Room deleted successfully"
}
```

---

## 📅 Hotel Bookings Module

### Get All Bookings
```http
GET /api/bookings
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "booking_id",
    "hotelId": "hotel_id",
    "roomId": "room_id",
    "checkIn": "2024-06-01",
    "checkOut": "2024-06-05",
    "guests": 2,
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "specialRequests": "Late check-in",
    "totalPrice": 1199.96,
    "status": "PENDING", // "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
    "createdAt": "2024-05-01T00:00:00.000Z",
    "hotel": { /* hotel object */ },
    "room": { /* room object */ }
  }
]
```

### Get Bookings for Hotel Owner
```http
GET /api/bookings/hotel/:userId
Authorization: Bearer {token}

Response: 200 OK
[/* array of bookings for this hotel owner */]
```

### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "booking_id",
  // ... booking details with hotel and room populated
}
```

### Create Booking
```http
POST /api/bookings
Content-Type: application/json

Request Body:
{
  "hotelId": "hotel_id",
  "roomId": "room_id",
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-05",
  "guests": 2,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "specialRequests": "Late check-in"
}

Response: 201 Created
{
  "id": "new_booking_id",
  // ... booking details
  "status": "PENDING"
}
```

### Update Booking Status
```http
PATCH /api/bookings/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "CONFIRMED" // "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
}

Response: 200 OK
{
  "id": "booking_id",
  "status": "CONFIRMED"
}
```

### Delete Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer {token}

Response: 200 OK
```

---

## 🗺️ Tours Module

### Get All Tours
```http
GET /api/tours?page=1&limit=10&search=paris

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- search: string (optional, searches in title and locations)

Response: 200 OK
[
  {
    "id": "tour_id",
    "title": "Paris City Tour",
    "pricePerPerson": 199.99,
    "description": "Explore the beauty of Paris",
    "locations": "Paris, Eiffel Tower, Louvre",
    "cardImages": ["url1", "url2"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Tour by ID
```http
GET /api/tours/:id

Response: 200 OK
{
  "id": "tour_id",
  "title": "Paris City Tour",
  "pricePerPerson": 199.99,
  "description": "Explore the beauty of Paris",
  "locations": "Paris, Eiffel Tower, Louvre",
  "cardImages": ["url1", "url2"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Tour
```http
POST /api/tours
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- title: string (required)
- pricePerPerson: number (required)
- description: string (required)
- locations: string (comma-separated, required)
- cardImages: File[] (multiple files)

Response: 201 Created
{
  "id": "new_tour_id",
  // ... tour details
}
```

### Update Tour
```http
PATCH /api/tours/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Response: 200 OK
```

### Delete Tour
```http
DELETE /api/tours/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Tour deleted successfully"
}
```

---

## 📝 Tour Bookings Module

### Get All Tour Bookings
```http
GET /api/tour-bookings
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "booking_id",
    "tourId": "tour_id",
    "peopleCount": 3,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "+1234567890",
    "notes": "Vegetarian meals please",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "tour": { /* tour object */ }
  }
]
```

### Get Tour Booking by ID
```http
GET /api/tour-bookings/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "booking_id",
  // ... booking details with tour populated
}
```

### Create Tour Booking
```http
POST /api/tour-bookings
Content-Type: application/json

Request Body:
{
  "tourId": "tour_id",
  "peopleCount": 3,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+1234567890",
  "notes": "Vegetarian meals please"
}

Response: 201 Created
{
  "id": "new_booking_id",
  // ... booking details
  "status": "PENDING"
}
```

### Update Tour Booking Status
```http
PATCH /api/tour-bookings/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "CONFIRMED"
}

Response: 200 OK
```

---

## 👨‍🏫 Tour Guides Module

### Get All Tour Guides
```http
GET /api/tour-guides?limit=4

Query Parameters:
- limit: number (optional)

Response: 200 OK
[
  {
    "id": "guide_id",
    "name": "Maria Garcia",
    "email": "maria@guides.com",
    "phone": "+1234567890",
    "city": "Barcelona",
    "languages": ["English", "Spanish", "French"],
    "experienceYears": 10,
    "pricePerDay": 150,
    "description": "Professional tour guide",
    "images": ["url1", "url2"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Tour Guide by ID
```http
GET /api/tour-guides/:id

Response: 200 OK
{
  "id": "guide_id",
  // ... guide details
}
```

### Create Tour Guide
```http
POST /api/tour-guides
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- name: string (required)
- email: string (required)
- phone: string (required)
- city: string (required)
- languages: string[] (multiple)
- experienceYears: number (required)
- pricePerDay: number (required)
- description: string (required)
- isActive: boolean (default: true)
- images: File[] (multiple files)

Response: 201 Created
{
  "id": "new_guide_id",
  // ... guide details
}
```

### Update Tour Guide
```http
PATCH /api/tour-guides/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- existingImages: string[] (URLs to keep)
- images: File[] (new files to add)
- Other fields as in Create

Response: 200 OK
```

### Delete Tour Guide
```http
DELETE /api/tour-guides/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Tour guide deleted successfully"
}
```

---

## 🗓️ Guide Bookings Module

### Get All Guide Bookings
```http
GET /api/tour-guide-bookings
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "booking_id",
    "tourGuideId": "guide_id",
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "+1234567890",
    "notes": "Need English speaking guide",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "tourGuide": { /* guide object */ }
  }
]
```

### Get Guide Booking by ID
```http
GET /api/tour-guide-bookings/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "booking_id",
  // ... booking details with guide populated
}
```

### Create Guide Booking
```http
POST /api/tour-guide-bookings
Content-Type: application/json

Request Body:
{
  "tourGuideId": "guide_id",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+1234567890",
  "notes": "Need English speaking guide"
}

Response: 201 Created
{
  "id": "new_booking_id",
  // ... booking details
  "status": "PENDING"
}
```

### Update Guide Booking Status
```http
PATCH /api/tour-guide-bookings/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "CONFIRMED"
}

Response: 200 OK
```

---

## 🚗 Cars Module

### Get All Cars
```http
GET /api/cars

Response: 200 OK
[
  {
    "id": "car_id",
    "name": "Toyota Camry",
    "model": "2023",
    "city": "Los Angeles",
    "images": ["url1", "url2"],
    "hasDriver": true,
    "driverInfo": {
      "name": "Mike Driver",
      "email": "mike@driver.com",
      "phone": "+1234567890",
      "images": ["driver_url1"],
      "pricePerDay": 50
    },
    "pricePerDay": 80,
    "pricePlaceToPlace": 150,
    "description": "Comfortable sedan",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Car by ID
```http
GET /api/cars/:id

Response: 200 OK
{
  "id": "car_id",
  // ... car details with driver info
}
```

### Create Car
```http
POST /api/cars
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- name: string (required)
- model: string (required)
- city: string (required)
- hasDriver: boolean (required)
- pricePerDay: number (required)
- pricePlaceToPlace: number (required)
- description: string (required)
- images: File[] (car images)

If hasDriver = true:
- driverName: string (required)
- driverEmail: string (required)
- driverPhone: string (required)
- driverPricePerDay: number (required)
- driverImages: File[] (driver images)

Response: 201 Created
{
  "id": "new_car_id",
  // ... car details
}
```

### Update Car
```http
PATCH /api/cars/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}

Response: 200 OK
```

### Delete Car
```http
DELETE /api/cars/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Car deleted successfully"
}
```

---

## 🚙 Car Bookings Module

### Get All Car Bookings
```http
GET /api/car-bookings
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "booking_id",
    "carId": "car_id",
    "pickupDate": "2024-06-01",
    "dropoffDate": "2024-06-05",
    "bookingType": "DAILY", // "DAILY" | "PLACE_TO_PLACE"
    "withDriver": true,
    "pickupCity": "Los Angeles",
    "dropoffCity": "San Francisco",
    "priceFinal": 500,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "+1234567890",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "car": { /* car object with driver info */ }
  }
]
```

### Get Car Booking by ID
```http
GET /api/car-bookings/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "booking_id",
  // ... booking details with car and driver info populated
}
```

### Create Car Booking
```http
POST /api/car-bookings
Content-Type: application/json

Request Body:
{
  "carId": "car_id",
  "pickupDate": "2024-06-01",
  "dropoffDate": "2024-06-05",
  "bookingType": "DAILY",
  "withDriver": true,
  "pickupCity": "Los Angeles",
  "dropoffCity": "San Francisco",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+1234567890"
}

Response: 201 Created
{
  "id": "new_booking_id",
  // ... booking details
  "status": "PENDING"
}
```

### Update Car Booking Status
```http
PATCH /api/car-bookings/:id/status
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "status": "CONFIRMED"
}

Response: 200 OK
```

---

## 📊 Analytics Module

### Get Platform Summary
```http
GET /api/summary
Authorization: Bearer {token}

Response: 200 OK
{
  "stats": {
    "totalHotels": 45,
    "totalTours": 30,
    "totalGuides": 25,
    "totalCars": 40
  },
  "monthlyBreakdown": [
    {
      "month": "2024-01",
      "hotelRevenue": 15000,
      "hotelBookings": 50,
      "tourRevenue": 8000,
      "tourBookings": 30,
      "guideRevenue": 5000,
      "guideBookings": 20,
      "carRevenue": 6000,
      "carBookings": 25,
      "totalRevenue": 34000
    }
  ]
}
```

---

## 📐 Data Models

### Hotel Model
```typescript
interface Hotel {
  id: string
  name: string
  email: string
  phone: string
  city: string
  country: string
  address: string
  description: string
  status: "pending" | "approved" | "rejected"
  images: string[]
  role: "HOTEL_OWNER"
  createdAt: Date
  updatedAt: Date
}
```

### Room Model
```typescript
interface Room {
  id: string
  hotelId: string
  name: string
  type: string
  price: number
  description: string
  amenities: string[]
  maxGuests: number
  images: string[]
  isAvailable: boolean
  createdAt: Date
}
```

### Hotel Booking Model
```typescript
interface HotelBooking {
  id: string
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests?: string
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: Date
  updatedAt: Date
}
```

### Tour Model
```typescript
interface Tour {
  id: string
  title: string
  pricePerPerson: number
  description: string
  locations: string
  cardImages: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Tour Booking Model
```typescript
interface TourBooking {
  id: string
  tourId: string
  peopleCount: number
  userName: string
  userEmail: string
  userPhone: string
  notes?: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: Date
  updatedAt: Date
}
```

### Tour Guide Model
```typescript
interface TourGuide {
  id: string
  name: string
  email: string
  phone: string
  city: string
  languages: string[]
  experienceYears: number
  pricePerDay: number
  description: string
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Guide Booking Model
```typescript
interface GuideBooking {
  id: string
  tourGuideId: string
  startDate: string
  endDate: string
  userName: string
  userEmail: string
  userPhone: string
  notes?: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: Date
  updatedAt: Date
}
```

### Car Model
```typescript
interface Car {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  driverInfo?: {
    name: string
    email: string
    phone: string
    images: string[]
    pricePerDay: number
  }
  pricePerDay: number
  pricePlaceToPlace: number
  description: string
  createdAt: Date
  updatedAt: Date
}
```

### Car Booking Model
```typescript
interface CarBooking {
  id: string
  carId: string
  pickupDate: string
  dropoffDate: string
  bookingType: "DAILY" | "PLACE_TO_PLACE"
  withDriver: boolean
  pickupCity: string
  dropoffCity: string
  priceFinal: number
  userName: string
  userEmail: string
  userPhone: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: Date
  updatedAt: Date
}
```

---

## ⚠️ Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error",
  "message": "Invalid email format"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

---

## 🔒 Security Notes

1. **Authentication:** JWT tokens must be included in the `Authorization` header for protected routes
2. **File Uploads:** Only authenticated users can upload files
3. **Image URLs:** Images are stored on Cloudinary and URLs are returned
4. **Password Security:** Passwords are hashed before storage (bcrypt)
5. **Input Validation:** All inputs are validated and sanitized
6. **Rate Limiting:** API requests may be rate-limited (if configured)
7. **CORS:** CORS is configured to allow frontend origin

---

## 📝 Notes

- All dates are in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`
- IDs are UUIDs (strings)
- File uploads use `multipart/form-data`
- Query parameters are case-sensitive
- All prices are in USD (or configured currency)
- Boolean values in form data should be strings: `"true"` or `"false"`
- Array values in form data: append multiple times with same key or comma-separated

---

*API Documentation Version: 1.0*  
*Last Updated: February 13, 2026*
