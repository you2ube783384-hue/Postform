# POSTFORM — Mobile App-Like E-Commerce Experience
## Master Prompt for AI Web Development Agents

> **Goal:** Build POSTFORM so the desktop experience remains a premium, conventional fashion e-commerce website, while mobile and tablet deliberately feel like a polished native shopping app.
>
> **Non-negotiable principle:** Do not simply shrink the desktop UI. Share the same data, business logic, and design system, but create a dedicated mobile/tablet interaction model.

---

## 1. Project Context

POSTFORM is a streetwear-focused resale business selling whatever verified fashion inventory is acquired, including:

- T-shirts
- Oversized T-shirts
- Shirts
- Hoodies
- Pants
- Jeans
- Sneakers
- Accessories
- Other fashion products

The visual direction is:

**Streetwear + Editorial Fashion + Neo-Brutalism + Premium Minimalism**

The result must feel distinctive and brand-led, not like a generic marketplace.

---

## 2. Responsive Experience

### Desktop / PC

Use a conventional premium fashion e-commerce layout:

- Full desktop header/navigation
- Product grids
- Editorial sections
- Desktop search
- Sidebar filters where useful
- Normal scrolling
- Spacious compositions
- Product imagery as the main visual focus
- No persistent mobile-style bottom navigation

### Mobile / Tablet

Create a deliberately app-like shopping experience:

- Sticky top navigation
- Sticky bottom navigation
- Thumb-friendly controls
- Horizontal category navigation
- Bottom-sheet filters
- Swipeable product galleries
- Sticky purchase controls
- Compact checkout
- Touch-first interactions
- Safe-area support

The mobile version must feel intentionally designed for touch.

---

## 3. Core Mobile UX Goal

The target feeling is:

> **“A premium streetwear website that behaves like a really good mobile shopping app.”**

It must NOT feel like:

> “A generic shopping app with POSTFORM branding.”

Prioritize:

- Speed
- Clarity
- Tactile interaction
- One-hand usability
- Fashion-focused presentation
- Low-friction shopping
- Strong visual hierarchy

Avoid unnecessary animation.

---

## 4. Sticky Mobile Header

Implement a persistent mobile header.

Concept:

```text
┌─────────────────────────────────┐
│ ☰    POSTFORM       ♡    🛒     │
│                                 │
│ 🔍  Search products...          │
└─────────────────────────────────┘
```

Treat this as a structural reference, not a literal design.

Requirements:

- Remain accessible while scrolling
- Use sticky/fixed positioning appropriately
- Do not consume excessive vertical space
- Make search immediately accessible
- Provide wishlist access
- Provide cart access
- Show a cart item-count badge
- Provide mobile menu access
- Support safe-area insets
- Maintain strong contrast

A subtle compact-on-scroll behavior is acceptable, but avoid dramatic animation.

---

## 5. Mobile Search

Search should be prominent and easy to reach.

Example:

```text
┌─────────────────────────────────┐
│ 🔍 Search products...            │
└─────────────────────────────────┘
```

Support:

- Product names
- Categories
- Relevant attributes
- Fast filtering
- Empty states
- Clear search action
- Mobile keyboard behavior

Keep search lightweight and immediate.

---

## 6. Horizontal Category Navigation

Below the header/search area, add horizontally scrollable categories.

Example:

```text
MEN   WOMEN   T-SHIRTS   HOODIES   JEANS   SNEAKERS →
```

Requirements:

- Swipe horizontally
- Hide the scrollbar visually
- Use comfortable touch targets
- Show an obvious active state
- Never force categories to wrap
- Keep labels readable
- Preserve POSTFORM typography

Possible categories:

- Men
- Women
- T-Shirts
- Oversized
- Shirts
- Hoodies
- Pants
- Jeans
- Sneakers
- Accessories

Generate categories dynamically where practical.

---

## 7. Sticky Mobile Bottom Navigation

This is a core requirement.

On mobile and appropriate tablet layouts, create persistent bottom navigation.

Concept:

```text
┌──────────────────────────────────────┐
│                                      │
│             PAGE CONTENT             │
│                                      │
├──────────────────────────────────────┤
│ Home  Explore  Categories  Account  Cart │
└──────────────────────────────────────┘
```

Recommended destinations:

1. Home
2. Explore / Shop
3. Categories
4. Account
5. Cart

If Wishlist is more useful than Account in the final information architecture, make that decision intelligently without overcrowding the navigation.

Requirements:

- Fixed/sticky to bottom
- Remains visible while scrolling
- Clear active state
- Large touch targets
- Cart quantity badge
- Safe-area support
- Must not cover content

Use safe-area handling where appropriate:

```css
padding-bottom: env(safe-area-inset-bottom);
```

---

## 8. Content Safe Area

Because bottom navigation persists, all relevant pages must include enough bottom spacing for content to scroll completely above it.

Account for:

- Bottom navigation height
- Device safe-area inset
- Sticky purchase controls
- Mobile browser behavior

Never hide important content underneath fixed navigation.

---

## 9. Mobile Product Grid

Do not simply shrink the desktop grid.

Use a deliberate mobile product grid, normally a two-column layout where appropriate:

```text
┌──────────────┬──────────────┐
│   PRODUCT    │   PRODUCT    │
├──────────────┼──────────────┤
│ Product Name │ Product Name │
│ ₹1,599       │ ₹1,899       │
├──────────────┼──────────────┤
│   PRODUCT    │   PRODUCT    │
└──────────────┴──────────────┘
```

Product cards should prioritize:

- Product image
- Product name
- Price
- Availability
- Important variant information
- Wishlist control

Keep product imagery visually dominant.

---

## 10. Product Card Interaction

Product cards must be easy to tap.

- Tapping the card opens the product.
- Wishlist has its own clear touch target.
- Do not rely on hover.
- Avoid tiny controls.
- Avoid unnecessary quick-action clutter.

---

## 11. Mobile Filter and Sort

Do not use a permanent desktop sidebar on mobile.

Use a compact control:

```text
┌───────────────────────────────┐
│ FILTER                 SORT ↕ │
└───────────────────────────────┘
```

Filter should open a bottom sheet or full-screen mobile panel:

```text
┌─────────────────────────────────┐
│ Filters                     ✕   │
├─────────────────────────────────┤
│ Category                    ›   │
│ Size                        ›   │
│ Color                       ›   │
│ Price                       ›   │
│ Condition                   ›   │
├─────────────────────────────────┤
│          APPLY FILTERS          │
└─────────────────────────────────┘
```

Requirements:

- Touch-first controls
- Clear selected states
- Clear-all capability
- Prominent Apply button
- No tiny controls
- Preserve state correctly
- Prevent accidental dismissal

---

## 12. Mobile Product Page

Do not simply stack the desktop product columns.

Use a dedicated mobile composition:

```text
←                         ♡

┌─────────────────────────────┐
│       PRODUCT IMAGE         │
└─────────────────────────────┘

● ○ ○ ○

PRODUCT NAME

₹1,599

Condition / availability

Select Size
[ S ] [ M ] [ L ] [ XL ]

Select Color
[ ● ] [ ● ]

Quantity
[ − ] 1 [ + ]
```

Prioritize:

1. Product imagery
2. Product name
3. Price
4. Availability/condition
5. Variants
6. Quantity
7. Purchase actions
8. Description
9. Size chart
10. Delivery information
11. Additional details

---

## 13. Swipeable Product Gallery

Fashion product photography is critical.

Implement:

- Swipeable gallery
- Touch gestures
- Image indicators
- Full-screen viewer
- High-quality images
- Correct aspect ratios
- Lazy loading where appropriate
- Accessible alt text

Do not unnecessarily crop product photography.

---

## 14. Variant Selection

Only display/select variants that are actually available.

Support:

- Size
- Color
- Stock status
- Selected state
- Unavailable state

Unavailable combinations must never be purchasable.

Provide an easily accessible Size Chart.

---

## 15. Quantity

Use:

```text
−    1    +
```

Rules:

- Minimum = 1
- Maximum respects available stock
- No invalid quantities
- Price updates immediately
- Works consistently in product page and cart

---

## 16. Sticky Mobile Purchase Bar

On product pages, provide a sticky purchase area:

```text
┌────────────────────────────────────┐
│ ₹1,599    ADD TO CART    BUY NOW  │
└────────────────────────────────────┘
```

The customer should not need to scroll back to purchase.

### Important

Do not simply stack a large purchase bar above a large global bottom navigation.

Avoid consuming too much screen height.

Choose an intelligent solution, such as:

- Compact purchase bar
- Purchase bar integrated with navigation
- Temporarily adapting navigation
- Positioning purchase controls directly above navigation

The final implementation must remain comfortable on small screens.

---

## 17. Mobile Cart

The cart should feel like a dedicated shopping-app screen.

Example:

```text
MY CART

┌──────────────────────────────┐
│ [IMAGE] Oversized T-Shirt    │
│         Black / M            │
│         ₹1,599               │
│         − 1 +          🗑    │
└──────────────────────────────┘

Subtotal              ₹1,599
Shipping              FREE
───────────────────────────────
Total                 ₹1,599

[        CHECKOUT        ]
```

Support:

- Product image
- Product name
- Variant
- Size
- Color
- Quantity
- Remove
- Price
- Subtotal
- Shipping
- Total
- Empty-cart state

---

## 18. Mobile Checkout

Make checkout extremely simple.

Structure:

```text
CONTACT
Name
Email
Phone

DELIVERY ADDRESS
Country
Address
City
State
Postal Code

ORDER SUMMARY
...

PAYMENT
PayPal
Visa / Card

CUSTOMER NOTE
...

[ PLACE ORDER ]
```

Inputs must be:

- Large
- Clearly labelled
- Keyboard-friendly
- Validated
- Accessible

Customers should be able to complete checkout comfortably on a phone.

---

## 19. Customer Profile

A complex customer-account system is not required initially.

If profile functionality is included, use a lightweight approach such as local browser storage where appropriate, while keeping the architecture extensible.

Potential structure:

```text
PROFILE
├── Personal Information
│   ├── Name
│   ├── Email
│   └── Phone
│
└── Saved Addresses
    ├── Home
    ├── Work
    └── Add Address
```

Do not introduce unnecessary authentication complexity.

---

## 20. Touch Targets

Aim for approximately:

**44 × 44 px or larger**

for interactive controls wherever practical.

Avoid:

- Tiny icons
- Tiny links
- Closely packed controls
- Hover-only functionality
- Small form controls

The experience should be comfortable with a thumb.

---

## 21. App-Like Interaction Patterns

Use proven mobile commerce patterns:

- Sticky header
- Sticky bottom navigation
- Horizontal category scrolling
- Bottom-sheet filters
- Swipeable galleries
- Full-screen product image viewer
- Sticky purchase controls
- Touch-friendly selectors
- Compact checkout
- Clear loading states
- Clear empty states
- Clear error states

Use these as interaction patterns, not as a reason to clone another company's visual design.

---

## 22. POSTFORM Visual Identity

The mobile app-like behavior must remain unmistakably POSTFORM.

### Background

Warm milky-white / soft off-white.

### Borders

Strong black structural borders.

### Typography

Bold, editorial, highly legible typography.

Use a technical/monospace influence selectively for labels, metadata, navigation, prices, or UI elements without harming readability.

### Accent colors

Controlled:

- Yellow
- Purple

Yellow can be used for strong CTAs.

Purple should be a supporting accent.

Do not flood the interface with color.

### Geometry

Use:

- Strong rectangular structures
- Controlled rounding
- Bold borders
- Confident spacing
- Editorial composition

Brutalist intensity should remain around **4–5/10**.

It should feel refined, not intentionally ugly.

---

## 23. Strictly Avoid

Do NOT use:

- Gradients
- Glassmorphism
- Excessive blur
- Excessive shadows
- Excessive rounded cards
- Excessive animation
- Unnecessary 3D effects
- Heavy parallax
- Generic SaaS styling
- Generic marketplace aesthetics
- Overly soft pastel UI
- Neumorphism
- Tiny mobile controls

POSTFORM should feel confident, editorial, structured and premium.

---

## 24. Animation Rules

Motion must be restrained.

Good uses:

- Navigation transitions
- Sheet opening/closing
- Image transitions
- Button feedback
- Cart quantity feedback
- Small state changes

Avoid:

- Bouncing everything
- Constant floating animations
- Long transitions
- Heavy parallax
- Excessive scroll-triggered animation
- Decorative motion that slows shopping

Speed and usability come first.

---

## 25. Responsive Breakpoint Strategy

Do not simply use:

```css
@media (max-width: 768px)
```

to shrink desktop components.

Create deliberate experiences for:

### Large Desktop
Full editorial experience.

### Desktop
Normal website navigation and product browsing.

### Tablet
Touch-friendly hybrid.

### Mobile
Dedicated app-like experience.

Portrait tablets may use the mobile navigation system.

Large landscape tablets can transition toward desktop behavior.

Choose breakpoints based on usable layout width and interaction requirements, not only device names.

---

## 26. Component Architecture

Do not force radically different experiences into one component using hundreds of conditional CSS rules.

Share:

- Product data
- Cart logic
- Wishlist logic
- Search logic
- Filter logic
- Checkout logic
- Validation
- API/data access
- State management

But allow presentation to differ.

Conceptual components:

```text
DesktopHeader
MobileHeader

DesktopNavigation
MobileBottomNavigation

DesktopFilterSidebar
MobileFilterSheet

DesktopProductLayout
MobileProductLayout

DesktopCartLayout
MobileCartLayout

DesktopCheckoutLayout
MobileCheckoutLayout
```

These are conceptual names only. Use the cleanest architecture for the actual project.

---

## 27. Performance

Mobile speed is critical.

Use:

- Responsive images
- Modern image formats
- Lazy loading where appropriate
- Explicit image dimensions
- Code splitting
- Efficient rendering
- Minimal unnecessary JavaScript
- Optimized fonts
- Minimal dependencies
- Optimized assets

Avoid unnecessarily large client-side bundles.

---

## 28. Accessibility

The mobile experience must remain a proper accessible website.

Implement:

- Semantic HTML
- Keyboard navigation on desktop
- Visible focus states
- Accessible labels
- ARIA only where appropriate
- Good contrast
- Screen-reader-friendly navigation
- Accessible form errors
- Accessible dialogs/sheets
- Focus management
- Reduced-motion support

Do not sacrifice accessibility for visual minimalism.

---

## 29. Mobile Menu

The hamburger button should open a dedicated mobile navigation interface.

Possible structure:

```text
POSTFORM

SHOP
Men
Women
T-Shirts
Oversized
Shirts
Hoodies
Pants
Jeans
Sneakers
Accessories

HELP
Shipping
Returns & Refund
Contact
```

The final structure should reflect the actual site architecture.

The menu must be fast to open and easy to close.

---

## 30. Loading States

Do not show blank screens while data loads.

Use lightweight POSTFORM-style states:

- Skeleton product cards
- Minimal loading indicators
- Image placeholders

Do not use flashy loaders.

---

## 31. Empty States

Create intentional empty states.

### Empty cart

```text
YOUR CART IS EMPTY

Find something worth wearing.

[ SHOP PRODUCTS ]
```

### Empty wishlist

```text
NOTHING SAVED YET

Save products you want to come back to.

[ EXPLORE PRODUCTS ]
```

### No search results

```text
NO MATCHES

Try another search or browse categories.
```

Keep copy concise and brand-appropriate.

---

## 32. Error States

Customer-facing errors must be understandable.

Avoid exposing technical messages as the primary UX.

Prefer:

```text
Something went wrong.

Please try again.

[ RETRY ]
```

---

## 33. Shopping Flow

Keep the main flow extremely short:

```text
HOME
  ↓
SEARCH / CATEGORY
  ↓
PRODUCT
  ↓
ADD TO CART / BUY NOW
  ↓
CART
  ↓
CHECKOUT
  ↓
PAYMENT
  ↓
ORDER CONFIRMATION
```

Do not force account creation.

Guest shopping should remain possible.

---

## 34. Order Email Workflow

POSTFORM uses an email-based order workflow rather than requiring a complex customer-facing order-management system.

Orders should contain:

```text
ORDER #TEMP-ID

CUSTOMER
Name
Phone
Email

DELIVERY ADDRESS
International address

PRODUCTS
Product name
Variant
Size
Color
Quantity
Price

ORDER TOTAL
₹XXXX

CUSTOMER NOTE
...
```

Destination:

**postformproducts@haren.uk**

Generate a human-readable unique temporary order identifier where practical.

Do not expose unnecessary personal information in URLs or client-side logs.

---

## 35. Payment

Initial payment methods:

- PayPal
- Visa / prepaid card

Use secure, supported payment-provider flows.

Never store raw card details in the application.

The mobile checkout should make payment selection clear and trustworthy.

---

## 36. Shipping

Shipping rules are not finalized.

Therefore:

- Do not hard-code complex shipping calculations.
- Keep shipping logic configurable.
- Clearly display shipping information once final rules are known.

The current business policy indicates free initial shipping, but this should remain configurable.

---

## 37. Returns and Refunds

Current policy:

### Return Policy

Returns are accepted only if the received product is defective or significantly different from the description.

The customer must provide a clear, unedited unboxing video showing the defect.

Returns without video proof may be rejected according to the stated policy.

### Shipping Charges

Initial orders have free shipping.

If an approved return is due to a defect, POSTFORM covers return shipping.

### Refund Process

After the approved return is received and inspected, POSTFORM initiates a refund to the original payment method.

Expected processing time:

**5–7 business days**

### How to Initiate

Customers should email:

**postformproducts@haren.uk**

with:

- Order details
- Unboxing video

Present this policy clearly without making the page visually heavy.

---

## 38. Mobile Navigation Final Rule

The bottom navigation should always answer:

> **“Where can I go next?”**

without forcing the customer to scroll to the top.

It must not dominate the screen.

Use:

- Clear icons
- Short labels
- Active state
- Cart badge
- Consistent spacing

Avoid excessive icon decoration.

---

## 39. Testing Requirements

Test on:

- Small mobile phones
- Standard smartphones
- Large smartphones
- Portrait tablets
- Landscape tablets
- Desktop monitors
- Large desktop screens

Pay special attention to:

- Sticky header overlap
- Bottom navigation overlap
- Sticky purchase bar overlap
- Keyboard behavior
- Safe-area behavior
- Horizontal scrolling
- Product image sizing
- Checkout usability
- Cart badge
- Long product names
- Long international addresses
- Large quantities
- Out-of-stock states

---

## 40. One-Thumb Test

Before considering the mobile experience complete, verify that a user can comfortably:

- Open navigation
- Search
- Browse categories
- Filter
- Open a product
- Swipe images
- Select size
- Select color
- Change quantity
- Add to cart
- Open cart
- Checkout
- Enter an international address
- Add a note
- Pay

If any action feels difficult, redesign the interaction rather than merely shrinking controls.

---

## 41. Desktop vs Mobile Final Feeling

### Desktop

> **“I am browsing a premium independent streetwear store.”**

Characteristics:

- Editorial
- Spacious
- Bold
- Structured
- Fashion-focused
- Conventional website navigation

### Mobile

> **“I am using a beautifully designed shopping app.”**

Characteristics:

- Persistent navigation
- Touch-first interaction
- Sticky controls
- Swipeable content
- Bottom sheets
- Fast product discovery
- Compact checkout
- One-hand usability

---

## 42. Non-Negotiable Principle

Do not clone another e-commerce app.

Borrow successful **interaction patterns**, not another brand's identity.

POSTFORM must remain visually original.

The final result should combine:

> **POSTFORM's Neo-Brutalist streetwear identity**
>
> with
>
> **the convenience and usability of a modern mobile commerce application.**

---

## 43. Implementation Instructions for the AI Coding Agent

Before coding:

1. Inspect the existing project architecture.
2. Inspect the existing design system.
3. Identify reusable product/cart/checkout logic.
4. Identify components that need separate mobile presentation.
5. Establish responsive breakpoints based on usability.
6. Plan sticky header behavior.
7. Plan sticky bottom navigation.
8. Plan safe-area handling.
9. Plan the relationship between bottom navigation and sticky purchase controls.
10. Plan mobile filter behavior.
11. Plan swipeable product gallery behavior.
12. Plan mobile checkout flow.

Then implement the system cleanly.

Do not introduce unnecessary dependencies.

Do not rewrite working business logic just to change the UI.

Do not break desktop behavior while implementing mobile UX.

---

# 44. Final Acceptance Criteria

The implementation is complete only when:

- Desktop remains a polished conventional e-commerce website.
- Mobile feels intentionally designed as a shopping application.
- Tablet receives an appropriate touch-first experience.
- Mobile has persistent top navigation.
- Mobile has persistent bottom navigation.
- Search is easy to access.
- Categories scroll horizontally.
- Product browsing is touch-friendly.
- Filters use a mobile-friendly sheet/panel.
- Product galleries support swipe interaction.
- Purchase controls remain easily accessible.
- Cart works completely on mobile.
- Checkout is comfortable on mobile.
- International addresses are supported.
- Payment options are clearly presented.
- Navigation never covers important content.
- Safe-area insets are respected.
- Touch targets are sufficiently large.
- Desktop and mobile share business logic without requiring identical layouts.
- No gradients are used.
- No glassmorphism is used.
- No excessive animation is used.
- POSTFORM's Neo-Brutalist/editorial identity remains obvious.
- The final experience feels fast, premium and deliberate.

---

# 45. Final Creative Direction

The final product should feel like:

**A fashion editorial website on desktop.**

**A premium streetwear shopping app on mobile.**

Use:

- Strong typography
- Black structural borders
- Warm milky-white surfaces
- Controlled yellow and purple accents
- High-quality product imagery
- Confident spacing
- Restrained Neo-Brutalist structure
- Excellent touch interactions

The UI should never overpower the products.

The shopping journey should be obvious.

The result should require no instructions for a normal customer to understand.

**Design for confidence. Design for touch. Design for conversion. Keep POSTFORM unmistakably POSTFORM.**
