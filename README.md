# HireSight - India Career Exploration Platform

A modern, mobile-first web application designed to help Indian students and professionals explore career fields, compare options, and make informed career decisions.

## 🎯 Project Overview

HireSight provides detailed insights into various career fields in India, including job roles, required skills, salary ranges (in INR), and growth outlook. The platform follows a streamlined three-step process: Select field → Get insights → Explore next steps.

**Target Users**: Students, early professionals, and career explorers in India

**Key Value Proposition**: Complete career exploration in under 10 minutes without overwhelming information

## 🛠 Tech Stack

- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + localStorage
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Tailwind CSS animations + custom keyframes

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (accordion, button, card, etc.)
│   ├── Navigation.tsx       # Global navigation bar with routing
│   ├── FieldCard.tsx        # Career field card component
│   └── NavLink.tsx          # Active link component for navigation
│
├── data/
│   └── careerFields.ts      # Career fields data structure and content
│
├── hooks/
│   ├── useBookmarks.ts      # Bookmark management with localStorage
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notifications hook
│
├── pages/
│   ├── Home.tsx             # Landing page with hero section
│   ├── Fields.tsx           # Career fields browser with search
│   ├── FieldDetail.tsx      # Detailed view of single career field
│   ├── Bookmarks.tsx        # Saved/bookmarked fields page
│   ├── Compare.tsx          # Side-by-side comparison of up to 3 fields
│   └── NotFound.tsx         # 404 error page
│
├── lib/
│   └── utils.ts             # Utility functions (cn for className merging)
│
├── App.tsx                  # Main app component with routing
├── main.tsx                 # Application entry point
└── index.css                # Global styles + design system tokens
```

## 🎨 Design System

### Color Palette (HSL-based)

The application uses a semantic color system defined in `src/index.css`:

```css
--primary: 174 66% 41%        /* Teal - Main brand color */
--primary-foreground: 0 0% 100%
--secondary: 213 27% 84%      /* Light blue-gray */
--accent: 174 66% 51%         /* Lighter teal for highlights */
--background: 0 0% 100%       /* White */
--foreground: 222 47% 11%     /* Dark blue-gray for text */
--muted: 210 40% 96%          /* Very light gray */
--card: 0 0% 100%             /* White */
--border: 214 32% 91%         /* Light border color */
```

### Custom Animations

- `fade-in`: Smooth fade-in with slight translateY
- `slide-in`: Slide from bottom animation
- `scale-in`: Scale up animation
- `pulse-slow`: Slow pulse effect
- `.hover-scale`: Hover scale utility class
- `.gradient-hero`: Primary gradient background
- `.gradient-card`: Subtle card gradient

### Typography

- **Font Family**: Inter (system font stack)
- **Headings**: Bold, responsive sizing
- **Body**: Regular weight, optimized line height

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd careercompass

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📊 Data Structure

### CareerField Interface

```typescript
interface CareerField {
  id: string;
  name: string;
  icon: string;                    // Lucide icon name
  description: string;
  shortDescription: string;
  
  jobRoles: {
    title: string;
    description: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior';
  }[];
  
  skills: {
    technical: string[];
    soft: string[];
  };
  
  salaryRanges: {
    entry: string;    // e.g., "₹3,50,000 - ₹6,00,000"
    mid: string;
    senior: string;
  };
  
  growthOutlook: {
    trend: 'Growing' | 'Stable' | 'Declining';
    percentage: string;
    description: string;
  };
}
```

### Current Career Fields

1. **Information Technology** (IT)
2. **Healthcare** (Health)
3. **Finance** (DollarSign)
4. **Education** (GraduationCap)
5. **Marketing** (Megaphone)
6. **Engineering** (Cog)

All data is located in `src/data/careerFields.ts`

## 🗺 Routing Structure

```
/ (Home)                           → Landing page
├── /fields                        → Browse all career fields
├── /field/:fieldId                → Detailed view of specific field
├── /bookmarks                     → View saved/bookmarked fields
├── /compare?fields=id1,id2,id3    → Compare up to 3 fields
└── /* (NotFound)                  → 404 page
```

### Route Parameters

- `/field/:fieldId`: Dynamic route accepting field ID from data
- `/compare`: Query params `?fields=` accepts comma-separated field IDs

## 🔧 Key Features & Implementation

### 1. Bookmarking System

**Location**: `src/hooks/useBookmarks.ts`

**Storage**: localStorage with key `'career-compass-bookmarks'`

**Methods**:
- `toggleBookmark(fieldId)`: Add/remove bookmark
- `isBookmarked(fieldId)`: Check bookmark status
- `bookmarkedIds`: Array of bookmarked field IDs

**Usage**:
```typescript
const { toggleBookmark, isBookmarked } = useBookmarks();
```

### 2. Search Functionality

**Location**: `src/pages/Fields.tsx`

**Implementation**: Client-side filtering on field name and description

```typescript
const filteredFields = careerFields.filter(field =>
  field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  field.description.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### 3. Compare Feature

**Location**: `src/pages/Compare.tsx`

**URL Pattern**: `/compare?fields=it,healthcare,finance`

**Logic**:
- Parse field IDs from query params
- Limit to 3 fields maximum
- Display side-by-side comparison table
- Show job roles, skills, salary, and growth outlook

### 4. Dynamic Icon Rendering

**Location**: `src/components/FieldCard.tsx`, `src/pages/FieldDetail.tsx`

**Implementation**: Dynamic import of Lucide icons

```typescript
const iconName = field.icon as keyof typeof icons;
const Icon = icons[iconName];
```

## 🎯 Component Guidelines

### Creating New Components

1. **Location**: Place in `src/components/` or `src/components/ui/` for UI primitives
2. **Naming**: PascalCase for component files (e.g., `FieldCard.tsx`)
3. **Styling**: Use Tailwind classes with semantic tokens from design system
4. **Props**: Define TypeScript interfaces for all props
5. **Exports**: Use default exports for pages, named exports for components

### Using shadcn/ui Components

All UI components are in `src/components/ui/`. To add new shadcn components:

```bash
npx shadcn-ui@latest add [component-name]
```

**Never modify shadcn components directly**. Instead, create wrapper components or variants.

## 🎨 Styling Best Practices

### DO ✅

```tsx
// Use semantic tokens
<div className="bg-card text-foreground border-border">

// Use design system gradients
<div className="bg-gradient-hero">

// Use custom animations
<div className="animate-fade-in hover-scale">
```

### DON'T ❌

```tsx
// Don't use direct colors
<div className="bg-white text-black border-gray-200">

// Don't use arbitrary values unless absolutely necessary
<div className="bg-[#ffffff]">
```

### Responsive Design

Always use mobile-first approach:

```tsx
<div className="text-sm sm:text-base lg:text-lg">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🔄 Adding New Career Fields

1. Open `src/data/careerFields.ts`
2. Add new field object following the `CareerField` interface
3. Choose an appropriate Lucide icon name
4. Ensure salary ranges are in INR (₹)
5. Add India-specific growth outlook descriptions
6. Include 5-8 job roles with varied experience levels

**Example**:

```typescript
{
  id: 'design',
  name: 'Design',
  icon: 'Palette',
  description: 'Creative visual communication...',
  shortDescription: 'Visual and UX design careers',
  // ... rest of the structure
}
```

## 🧪 Future Enhancement Ideas

### Short-term
- Add state-wise salary filters
- Include popular Indian companies per field
- Add certification requirements (AICTE, UGC, etc.)
- Export comparison as PDF
- Dark mode toggle

### Long-term
- User authentication (with Lovable Cloud)
- Save custom notes per field
- Career path recommendations based on skills
- Integration with job portals (Naukri, LinkedIn)
- Real-time salary data from APIs
- Video testimonials from professionals

## 🐛 Debugging

### Console Logs
The app uses minimal console logging. Check browser DevTools for:
- Routing issues
- localStorage bookmark persistence
- Data fetching errors

### Common Issues

**Issue**: Bookmarks not persisting  
**Solution**: Check localStorage in DevTools → Application → Local Storage

**Issue**: Icons not displaying  
**Solution**: Verify icon name matches Lucide React icon exports

**Issue**: Styles not applying  
**Solution**: Run `npm run build` to regenerate Tailwind classes

## 📝 Code Conventions

### TypeScript
- Use explicit types for all props and state
- Avoid `any` type
- Use interfaces for object shapes

### Naming
- Components: PascalCase (`FieldCard.tsx`)
- Hooks: camelCase with `use` prefix (`useBookmarks.ts`)
- Utilities: camelCase (`utils.ts`)
- CSS classes: kebab-case (via Tailwind)

### File Organization
- One component per file
- Colocate types with components
- Keep data separate in `/data` folder

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check existing documentation
- Review code comments

---

**Built with ❤️ using Lovable.dev**
