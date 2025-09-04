# v0.dev Component Prompts for Shy Bird Purchasing Calculator

Copy these prompts into [v0.dev](https://v0.dev) to generate beautiful UI components:

## 1. Login Page

```
Create a modern login page component for a restaurant management app called "Shy Bird Purchasing Calculator". 
Requirements:
- Clean, centered card design with subtle shadow
- Logo/brand area at top with text "Shy Bird Purchasing Calculator"
- Username and password input fields with labels
- "Login" button with hover effects
- Error message display area
- Green color scheme using emerald/green-600 as primary
- Responsive design that looks good on mobile and desktop
- Include loading state for the login button
- Professional, clean aesthetic suitable for a business application
```

## 2. Dashboard Layout

```
Design a dashboard layout component for a restaurant purchasing management system.
Requirements:
- Fixed header with:
  - App title "Shy Bird Purchasing Calculator" on left
  - Location selector dropdown in center
  - User info and logout button on right
  - Green background (emerald-600)
- Main content area with proper padding
- Responsive design with mobile menu
- Clean, professional look
- Support for dark mode toggle
```

## 3. Week Navigation Component

```
Create a week navigation component that allows users to browse different weeks.
Requirements:
- Previous and Next week buttons with arrow icons
- Current week display in format "Sep 1, 2025 - Sep 7, 2025"
- Centered layout
- Buttons should be disabled appropriately at boundaries
- Clean design with good spacing
- Mobile-friendly
```

## 4. Summary Cards

```
Design a set of summary cards for displaying key metrics in a restaurant purchasing app.
Create two cards side by side:

Card 1 - "Weekly Forecast":
- Input field for "Total Sales Forecast" with $ prefix
- Display calculated values:
  - Weekly Total Sales
  - Weekly Food Sales (78% of total)
  - Target Food Purchasing
  - Target Food Cost %
- Green accent color for headers

Card 2 - "Current Performance":
- Display current week metrics:
  - Days Complete (e.g., "3 of 7")
  - Total Sales to Date
  - Food Sales to Date
  - Food Purchasing to Date
  - Current Food Cost % (highlight in red if over 29%)
  - Variance from target
- Show placeholder text if no data

Both cards should have subtle shadows and rounded corners
```

## 5. Daily Purchasing Table

```
Create an advanced data table component for daily restaurant purchasing data.
Columns needed:
- Day (Monday-Sunday)
- Date
- Sales % (display only)
- Purch % (display only)
- Forecast Sales (currency)
- Target Purchasing (currency)
- Actual Sales (editable input)
- Actual Purchasing (editable input)
- Food Cost % (calculated, highlight if >29%)
- Status (Pending/Complete/Adjusted)

Features:
- Inline editing for Actual Sales and Purchasing columns
- Row highlighting based on status:
  - Pending: Light yellow background
  - Complete: Light green background
  - Adjusted: Light blue background
- Totals row at bottom with bold text and gray background
- Responsive design with horizontal scroll on mobile
- Clean borders and good spacing
- Input fields should look integrated into the table
```

## 6. Vendor Breakdown Component

```
Create a vendor breakdown display component for restaurant purchasing.
Requirements:
- Day selector dropdown at top
- Display purchasing budget for selected day
- Table showing vendor allocations:
  - Vendor name
  - Dollar amount
  - Percentage of total
- Special messaging for Sunday (no deliveries)
- Include these vendors: US Foods, Katsiroubas, Baldor, D'Artagnan, Other Vendors
- Clean table design with alternating row colors
- Mobile responsive
```

## 7. Action Buttons Section

```
Design an action button group for a dashboard.
Include three buttons:
- "Export to Excel" (with download icon)
- "Location Settings" (with settings icon)
- "View History" (with clock icon)

Style:
- Secondary style buttons (gray background)
- Icons on the left of text
- Proper spacing between buttons
- Hover effects
- Mobile responsive (stack vertically on small screens)
```

## 8. Complete Dashboard Page

```
Create a complete dashboard page for a restaurant purchasing calculator combining these elements:
1. Fixed header with app title, location selector, and user menu
2. Week navigation with prev/next buttons
3. Two summary cards (Weekly Forecast and Current Performance)
4. Large data table for daily purchasing with inline editing
5. Vendor breakdown section with day selector
6. Action buttons for export, settings, and history

Use a green color scheme (emerald shades), clean modern design, proper spacing, and ensure full mobile responsiveness. The layout should be professional and suitable for daily business use.
```

## 9. Settings Modal

```
Create a modal component for location settings in a restaurant app.
Include form fields for:
- Weekly Sales Target (currency input)
- Food Cost Target (percentage input)
- Food Sales Ratio (percentage input)
- Daily sales distribution (7 inputs for Monday-Sunday, must sum to 100%)
- Daily purchasing distribution (7 inputs, must sum to 100%)

Features:
- Modal overlay with semi-transparent background
- Close X button in top right
- Save and Cancel buttons at bottom
- Form validation indicators
- Responsive width
- Smooth open/close animations
```

## 10. Mobile Navigation

```
Design a mobile-friendly navigation menu for the restaurant purchasing app.
Requirements:
- Hamburger menu icon in header
- Slide-out drawer from left
- Menu items: Dashboard, Locations, Settings, History, Logout
- Current location display
- User info section
- Smooth slide animation
- Overlay that closes menu when tapped
- Green accent colors matching the brand
```

## Integration Tips

When you get the components from v0:
1. Save each component in the `components` folder
2. v0 provides React/TypeScript code with Tailwind CSS
3. Components are usually provided with example usage
4. You may need to adjust imports and types
5. Components are designed to work together

## Color Palette to Use

Mention these colors in your prompts for consistency:
- Primary: emerald-600 (#059669)
- Primary Hover: emerald-700 (#047857)
- Success: green-500 (#22c55e)
- Warning: amber-500 (#f59e0b)
- Error: red-500 (#ef4444)
- Background: gray-50 (#f9fafb)
- Card Background: white (#ffffff)
- Text Primary: gray-900 (#111827)
- Text Secondary: gray-600 (#4b5563)