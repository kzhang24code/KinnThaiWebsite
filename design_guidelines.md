# KINN Thai Eatery - Design Guidelines

## Design Approach
**Elegant Thai Restaurant** - Drawing inspiration from premium restaurant websites like Eleven Madison Park and The French Laundry, combined with modern minimalist aesthetics. The design balances sophistication with warmth, using red as an accent color against clean white spaces.

## Typography System
- **Headings**: Playfair Display (serif) - Elegant, premium feel
  - H1: 4xl to 6xl (60-72px desktop)
  - H2: 3xl to 4xl (36-48px)
  - H3: 2xl to 3xl (24-36px)
- **Body**: Inter or system-ui (sans-serif) - Clean, readable
  - Base: text-base to lg (16-18px)
  - Small: text-sm (14px)

## Layout & Spacing System
**Tailwind Units**: Use 4, 6, 8, 12, 16, 20, 24, 32 for consistent spacing
- Section padding: py-16 (mobile), py-24 to py-32 (desktop)
- Container: max-w-7xl with px-4 to px-8
- Component spacing: gap-6 to gap-8 for grids
- Card padding: p-6 to p-8

## Color Implementation (User Specified)
- **Primary Red**: Use for CTAs, section accents, hover states
- **White**: Base background, cards, clean space
- **Supporting Neutrals**: Gray-100 to Gray-200 for subtle backgrounds, Gray-600 to Gray-900 for text hierarchy

## Component Library

### Hero Section
- Full viewport height (min-h-screen)
- Dark overlay (bg-black/40) over background image for text legibility
- Centered content with restaurant name in large Playfair Display
- Tagline/subtitle beneath name
- Three prominent CTAs in horizontal row (desktop), stacked (mobile)
- Buttons: Semi-transparent white backgrounds with backdrop blur (bg-white/10 backdrop-blur-md) with white text and borders

### About Section
- Two-column layout (desktop): Left text, right atmospheric restaurant image
- Single column (mobile): Image above text
- max-w-prose for readable paragraph width
- Include: Brief history, culinary philosophy, chef's signature approach
- Consider pull quote or highlighted text snippet

### Menu Preview Grid
- 4-column grid (desktop): grid-cols-4
- 2-column (tablet): grid-cols-2  
- 1-column (mobile): grid-cols-1
- Each dish card includes:
  - High-quality food image (aspect-square or 4:3)
  - Dish name (Playfair Display, text-xl)
  - Brief description (2 lines max)
  - Price (prominent, red accent)
  - Subtle hover effect (slight scale/shadow)
- Link to full menu at bottom

### Reservation Section
- Two-column layout: Calendar picker (left), Form fields (right)
- Calendar component: Clean, minimal design with red accents for selected dates
- Form fields: Name, Email, Phone, Party size (dropdown), Special requests (textarea)
- Time slot selector (dropdown or button grid)
- Prominent "Reserve Table" CTA button
- Confirmation message area

### Navigation
- Sticky header with transparent background initially, solid white on scroll
- Logo/restaurant name (left), navigation links (center/right)
- Mobile: Hamburger menu
- Links: Home, Menu, Reservations, About, Contact
- Smooth scroll to sections

### Footer
- Three-column layout: Hours & Location, Contact Info, Social Media
- Newsletter signup with minimal form
- Copyright and legal links
- Subtle red accent line or border

## Images Required

1. **Hero Background**: Full-width atmospheric shot of restaurant interior or signature dish presentation (high-res, 1920x1080+)
2. **About Section**: Cozy restaurant ambiance or chef in action (1200x800)
3. **4 Menu Preview Images**: Professional food photography of signature dishes - each aspect-square (800x800)
   - Suggested: Pad Thai, Green Curry, Tom Yum Soup, Mango Sticky Rice
4. **Optional**: Additional lifestyle/dining experience images throughout

## Interaction & Animation
- Minimal, purposeful animations only
- Smooth scroll behavior between sections
- Subtle fade-in on scroll for section reveals
- Hover states: Slight scale (scale-105) for cards, color transitions for buttons
- No parallax or complex scroll-driven effects

## Responsive Breakpoints
- Mobile-first approach
- sm: 640px (small tablets)
- md: 768px (tablets)  
- lg: 1024px (small laptops)
- xl: 1280px (desktops)

## Accessibility
- High contrast between text and backgrounds
- Focus states for all interactive elements (ring-2 ring-red-500)
- Alt text for all images
- Semantic HTML structure
- Form labels properly associated