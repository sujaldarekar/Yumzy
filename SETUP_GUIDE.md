# Food Ordering System - Setup Guide

This guide will help you set up and test the food ordering feature that was just added to your Yumzy application.

## What Was Added

✅ **Order Food Button** on reel feed  
✅ **Order Page** with quantity selection, address, payment options, coupon codes, and loyalty points  
✅ **Order Tracking Page** with satellite map view showing food partner location  
✅ **Loyalty Points System** where users earn and redeem points  
✅ **Coupon Code System** with pre-configured coupons

## Prerequisites

- MongoDB running locally
- Backend already running on `http://localhost:3000`
- Frontend already running on `http://localhost:5173`

## Manual Steps Required

### Step 1: Update Existing Food Items with Prices

Since we added a `price` field to food items, you need to add prices to your existing food items in the database.

**Option A: Using MongoDB Compass or Shell**

```javascript
// Open MongoDB Compass and connect to your database: mongodb://localhost:27017/food-view
// Go to the 'foods' collection
// For each food item, click 'Edit' and add a 'price' field, e.g., price: 299
```

**Option B: Using MongoDB Shell**

```bash
# Open MongoDB shell
mongosh

# Use your database
use food-view

# Update all food items with a default price
db.foods.updateMany({}, { $set: { price: 299 } })
```

### Step 2: Add Location Data to Food Partners (Optional)

To show food partner locations on the map, add location data to food partners.

```bash
# In MongoDB shell
db.foodpartners.updateMany(
  {},
  { $set: {
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: "Mumbai, Maharashtra"
      },
      logo: "https://via.placeholder.com/50"
    }
  }
)
```

> **Note:** Replace the lat/lng values with the actual coordinates of your food partners. You can use [LatLong.net](https://www.latlong.net/) to find coordinates by address.

### Step 3: Test the Order Flow

1. **Login as a User**

   - Navigate to `http://localhost:5173/user/login`
   - Login with your user credentials

2. **Place an Order**

   - Go to the home page
   - View a reel (food video)
   - Click the **"Order Food"** button
   - Fill in the order form:
     - Select quantity (1-10)
     - Enter delivery address
     - Choose payment option (COD, Card, UPI, or Wallet)
     - (Optional) Enter a coupon code:
       - `FIRST10` - 10% discount
       - `SAVE50` - ₹50 flat discount
       - `WELCOME20` - 20% discount
     - (Optional) Check "Use Loyalty Points" if you have points
   - Click **"Place Order"**

3. **Track Your Order**
   - After placing the order, you'll be redirected to the tracking page
   - You should see:
     - Order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
     - Satellite map with food partner location marker
     - Delivery address marker
     - Estimated delivery time
     - Order details summary

## Available Coupon Codes

- **FIRST10** - 10% discount on total amount
- **SAVE50** - ₹50 flat discount
- **WELCOME20** - 20% discount on total amount

## Loyalty Points System

- **Earn Points:** Get 10 points for every ₹100 you spend
- **Redeem Points:** 1 point = ₹0.10 discount
- **View Balance:** Check your loyalty points on the order page

## Testing Checklist

- [ ] Order Food button appears on reel feed
- [ ] Clicking Order Food navigates to order page
- [ ] Food item details display correctly
- [ ] Quantity selector works (min: 1, max: 10)
- [ ] Address form validation works
- [ ] Payment options are selectable
- [ ] Coupon codes can be applied and validated
- [ ] Loyalty points checkbox works (if user has points)
- [ ] Order summary shows correct totals
- [ ] Place Order button submits successfully
- [ ] Navigation to tracking page works
- [ ] Satellite map displays on tracking page
- [ ] Food partner location marker shows on map
- [ ] Order status is displayed
- [ ] Estimated delivery time is shown
- [ ] Order details are correct

## Troubleshooting

### Issue: "Failed to load food item"

**Solution:** Make sure the food item has a `price` field in the database (see Step 1).

### Issue: Map not displaying

**Solution:** Check browser console for errors. Ensure react-leaflet and leaflet are installed:

```bash
cd frontend
npm install react-leaflet leaflet
```

### Issue: "Unauthorized access" when placing order

**Solution:** Make sure you're logged in as a user. Go to `/user/login` first.

### Issue: Coupon code not working

**Solution:** Ensure you're typing the exact coupon code (case-insensitive). Available codes: FIRST10, SAVE50, WELCOME20.

## API Endpoints

The following endpoints were added to your backend:

- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/user/all` - Get all user orders
- `PATCH /api/orders/:orderId/status` - Update order status
- `POST /api/orders/validate-coupon` - Validate coupon code

## Database Collections

New collections created:

- `orders` - Stores all orders
- `loyaltypoints` - Tracks user loyalty points

Updated collections:

- `users` - Added `loyaltyPoints` field
- `foods` - Added `price` field
- `foodpartners` - Added `location` and `logo` fields

## Need to Remove This Feature? ("remove sushi")

If you want to remove the food ordering feature in the future, just say **"remove sushi"** and I'll revert all changes back to the original state before this update.

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Check the backend terminal for server errors
3. Verify MongoDB is running
4. Ensure all required fields are filled in the database
