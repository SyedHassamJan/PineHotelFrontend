# Hotel & Room Management Workflow

## 🏨 Hotel Owner Responsibilities

### What Hotel Owners CAN Do:

1. **List Hotels**
   - Add new hotel properties
   - Upload multiple hotel images
   - Provide hotel details:
     - Hotel name
     - Category (1-5 Star)
     - Location & address
     - Full description
     - Total number of rooms
     - Contact phone
   - Submit hotel for SuperAdmin approval

2. **Manage Room Types**
   - Add room types for their hotels
   - Upload multiple room images for each type
   - Provide room details:
     - Room type name (e.g., Deluxe Suite, Ocean View)
     - Room description
     - Guest capacity
     - Bed configuration (e.g., 1 King Bed)
     - Total number of this room type
     - Room size (sqft)
     - Amenities (WiFi, TV, Mini Bar, AC, Safe, Balcony, Kitchen, Private Pool)
   - Submit room types for approval

3. **View Statistics**
   - See total bookings
   - Monitor revenue (prices set by SuperAdmin)
   - Track room availability

### What Hotel Owners CANNOT Do:

❌ **Set Pricing** - All pricing is controlled by SuperAdmin
❌ **Approve their own hotels** - Must wait for SuperAdmin approval
❌ **Change prices** - Pricing is read-only for hotel owners

---

## 👑 SuperAdmin Responsibilities

### Pricing Control:

1. **Hotel Approval**
   - Review hotel submissions
   - Approve or reject hotels
   - **Set base pricing** for hotels after approval

2. **Room Type Approval**
   - Review room type submissions
   - Check room images and details
   - **Set pricing per night** for each room type
   - Approve or reject room types

3. **Pricing Management**
   - Adjust prices based on:
     - Season
     - Demand
     - Market rates
     - Hotel category
   - Monitor and optimize pricing strategy

---

## 🔄 Complete Workflow

```
STEP 1: Hotel Owner Creates Hotel
    ├─ Add hotel details
    ├─ Upload hotel images
    ├─ No pricing input
    └─ Submit for approval
         ↓
STEP 2: SuperAdmin Reviews
    ├─ Check hotel details
    ├─ Verify images
    ├─ SET BASE PRICING ← SuperAdmin Only
    └─ Approve/Reject
         ↓
STEP 3: Hotel Owner Adds Room Types
    ├─ Select approved hotel
    ├─ Add room details & images
    ├─ Set capacity & amenities
    ├─ No pricing input
    └─ Submit for approval
         ↓
STEP 4: SuperAdmin Sets Room Pricing
    ├─ Review room type
    ├─ Check room images
    ├─ SET PRICE PER NIGHT ← SuperAdmin Only
    └─ Approve/Reject
         ↓
STEP 5: Room Goes Live
    ├─ Available for booking
    ├─ Customers can see price
    └─ Hotel owner can track bookings
```

---

## 📋 Hotel Owner Forms

### Add Hotel Form:
- ✅ Hotel Name
- ✅ Hotel Images (multiple upload)
- ✅ Category (1-5 Star)
- ✅ Location
- ✅ Address
- ✅ Description
- ✅ Total Rooms
- ✅ Contact Phone
- ❌ Price (NOT included - set by SuperAdmin)

### Add Room Type Form:
- ✅ Select Hotel
- ✅ Room Type Name
- ✅ Room Images (multiple upload)
- ✅ Room Description
- ✅ Guest Capacity
- ✅ Bed Configuration
- ✅ Total Rooms of This Type
- ✅ Room Size
- ✅ Amenities (checkboxes)
- ❌ Price (NOT included - set by SuperAdmin)

---

## 💡 Key Benefits

### For Hotel Owners:
- Focus on property details and amenities
- Professional image uploads
- Easy room type management
- Revenue tracking

### For SuperAdmin:
- Full pricing control
- Consistent pricing strategy
- Quality control through approval
- Market-based pricing adjustments

### For Customers:
- Consistent pricing
- Professionally managed rates
- Detailed room information
- Quality-assured hotels

---

## 🔐 Security

- Hotel owners can only edit their own hotels
- Pricing fields are completely removed from hotel owner interface
- All price changes must go through SuperAdmin
- Approval workflow prevents unauthorized listings

---

## 📝 Updated Test Credentials

| Role | Email | Password | Can Set Prices? |
|------|-------|----------|-----------------|
| Hotel Owner | owner@hotels.com | owner123 | ❌ No |
| SuperAdmin | superadmin@travelhub.com | super123 | ✅ Yes |

---

## 🎨 UI Changes

### Hotel Owner Pages Updated:
1. ✅ `/admin/my-hotels` - Add Hotel modal (removed price field, added image upload)
2. ✅ `/admin/rooms` - Add Room Type modal (removed price field, added images & detailed amenities)
3. ✅ Both pages show note: "Pricing will be set by SuperAdmin"

### SuperAdmin Pages (To Be Updated):
- `/superadmin/hotel-submissions` - Add pricing form
- `/superadmin/tour-submissions` - Pricing management
- Price adjustment interface for approved listings
