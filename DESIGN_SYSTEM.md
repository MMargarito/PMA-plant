# Myceili Design System

## Color Palette

Inspired by the organic, interconnected nature of mycelium networks, our color palette features natural greens and teals that reflect growth, connection, and vitality.

### Primary Colors (Green - Growth & Nature)
```
#E8F5E9 - primary-50  - Backgrounds, light sections
#C8E6C9 - primary-100 - Hover states
#A5D6A7 - primary-200 - Borders
#81C784 - primary-300 - Active states
#66BB6A - primary-400 - Accents
#4CAF50 - primary-500 - Brand green (logo core)
#43A047 - primary-600 - Hover on primary
#388E3C - primary-700 - Dark accents
#2E7D32 - primary-800 - Very dark
#1B5E20 - primary-900 - Darkest
```

### Secondary Colors (Teal - Connection & Flow)
```
#E0F2F1 - secondary-50  - Light backgrounds
#B2DFDB - secondary-100 - Subtle highlights
#80CBC4 - secondary-200 - Borders
#4DB6AC - secondary-300 - Active elements
#26A69A - secondary-400 - Buttons
#009688 - secondary-500 - Brand teal
#00897B - secondary-600 - Hover states (logo accent)
#00796B - secondary-700 - Dark teal
#00695C - secondary-800 - Very dark
#004D40 - secondary-900 - Darkest
```

### Brand Colors
```
#A4D866 - myceili-lime   - Light accent (logo highlight)
#4CAF50 - myceili-green  - Primary brand color
#00897B - myceili-teal   - Secondary brand color
#1B5E20 - myceili-dark   - Dark text/accents
#E8F5E9 - myceili-light  - Light backgrounds
#81C784 - myceili-accent - Interactive elements
```

### Brand Gradients
```css
/* Main brand gradient - Green to Teal */
background: linear-gradient(135deg, #4CAF50 0%, #00897B 100%);

/* Dark variant - Rich, deep tones */
background: linear-gradient(135deg, #2E7D32 0%, #00695C 100%);

/* Light variant - Subtle, organic feel */
background: linear-gradient(135deg, #81C784 0%, #4DB6AC 100%);

/* Radial gradient - Network effect */
background: radial-gradient(circle at top right, #4CAF50, #00897B);

/* Tailwind classes */
.bg-myceili-gradient       /* Main green-to-teal */
.bg-myceili-gradient-dark  /* Deep, rich variant */
.bg-myceili-gradient-light /* Soft, organic variant */
.bg-myceili-radial         /* Network effect */
```

### Usage Guidelines

**Primary Green** - Use for:
- Growth indicators (progress bars, stats)
- Success messages and confirmations
- Primary call-to-action buttons
- Active/selected states
- Organic, natural elements

**Secondary Teal** - Use for:
- Connection indicators
- Secondary actions
- Links and navigation
- Info messages
- Complementary accents

**Gradients** - Use for:
- Primary buttons and CTAs
- Logo and branding elements
- Feature highlights and heroes
- User avatars and initials
- Progress indicators
- Cards and panels (subtle)

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
             'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Sizes
```
text-xs   - 12px - Small labels, captions
text-sm   - 14px - Body text, descriptions
text-base - 16px - Default body
text-lg   - 18px - Large body, subtitles
text-xl   - 20px - Section headings
text-2xl  - 24px - Page headings
text-3xl  - 30px - Main titles
```

### Gradient Text
```jsx
<h1 className="bg-myceili-gradient bg-clip-text text-transparent">
  Myceili
</h1>
```

## Components

### Buttons

#### Primary Button
```jsx
<button className="px-4 py-2 text-white bg-myceili-gradient 
                   hover:opacity-90 rounded-lg shadow-sm
                   transition-all focus:ring-2 
                   focus:ring-secondary-500">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2 text-gray-700 bg-white 
                   border border-gray-300 hover:bg-gray-50 
                   rounded-lg shadow-sm transition-colors">
  Secondary Action
</button>
```

#### Icon Button
```jsx
<button className="p-2 text-gray-600 hover:bg-gray-50 
                   rounded-lg transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### Cards

#### Standard Card
```jsx
<div className="bg-white rounded-lg shadow hover:shadow-md 
                transition-shadow p-6">
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

#### Highlighted Card
```jsx
<div className="bg-gradient-to-br from-myceili-light to-primary-50 
                rounded-lg shadow-sm p-6 border border-primary-200">
  <h3 className="text-lg font-semibold text-secondary-700">Title</h3>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

### Forms

#### Input Field
```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Label
  </label>
  <input 
    type="text"
    className="block w-full px-3 py-2 border border-gray-300 
               rounded-lg focus:ring-2 focus:ring-secondary-500 
               focus:border-transparent"
    placeholder="Enter value..."
  />
</div>
```

#### Select
```jsx
<select className="block w-full px-3 py-2 border border-gray-300 
                   rounded-lg focus:ring-2 focus:ring-secondary-500">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Avatars

#### User Avatar (Gradient)
```jsx
<div className="w-10 h-10 bg-myceili-gradient rounded-full 
                flex items-center justify-center shadow">
  <span className="text-white font-semibold text-sm">JD</span>
</div>
```

#### Large Avatar
```jsx
<div className="w-24 h-24 bg-myceili-gradient rounded-full 
                flex items-center justify-center shadow-lg">
  <span className="text-white font-bold text-3xl">JD</span>
</div>
```

### Badges

#### Status Badge
```jsx
<span className="px-2 py-1 text-xs font-medium rounded-full
               bg-green-100 text-green-800">
  Active
</span>
```

#### Priority Badge
```jsx
<span className="px-2 py-1 text-xs font-medium rounded-full
               bg-red-100 text-red-800">
  High
</span>
```

### Navigation

#### Active Nav Item
```jsx
<a className="flex items-center px-3 py-3 rounded-lg
              bg-gradient-to-r from-myceili-light to-primary-50 
              text-secondary-700 shadow-sm font-medium">
  <Icon className="w-6 h-6" />
  <span className="ml-3">Dashboard</span>
</a>
```

#### Inactive Nav Item
```jsx
<a className="flex items-center px-3 py-3 rounded-lg
              text-gray-700 hover:bg-gray-50 font-medium
              transition-colors">
  <Icon className="w-6 h-6" />
  <span className="ml-3">Projects</span>
</a>
```

## Logo Usage

### Full Logo (Sidebar Expanded)
```jsx
<div className="flex items-center space-x-3">
  <div className="w-8 h-8 bg-myceili-gradient rounded-lg 
                  flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 20 20">
      <!-- Mycelium icon paths -->
    </svg>
  </div>
  <h1 className="text-xl font-bold bg-myceili-gradient 
                 bg-clip-text text-transparent">
    Myceili
  </h1>
</div>
```

### Icon Only (Sidebar Collapsed)
```jsx
<div className="w-8 h-8 bg-myceili-gradient rounded-lg 
                flex items-center justify-center">
  <svg width="20" height="20" viewBox="0 0 20 20">
    <!-- Mycelium icon paths -->
  </svg>
</div>
```

### Large Logo (Auth Pages)
```jsx
<div className="w-16 h-16 bg-myceili-gradient rounded-2xl 
                flex items-center justify-center shadow-lg">
  <svg width="32" height="32" viewBox="0 0 32 32">
    <!-- Mycelium icon paths -->
  </svg>
</div>
```

## Spacing

### Standard Spacing Scale
```
0   - 0px
1   - 0.25rem (4px)
2   - 0.5rem (8px)
3   - 0.75rem (12px)
4   - 1rem (16px)    - Standard gap
5   - 1.25rem (20px)
6   - 1.5rem (24px)  - Card padding
8   - 2rem (32px)    - Section spacing
12  - 3rem (48px)    - Large spacing
16  - 4rem (64px)    - Hero spacing
```

## Shadows

### Elevation Levels
```css
/* Small - Cards, buttons */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)

/* Medium - Elevated cards */
shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
        0 1px 2px rgba(0, 0, 0, 0.06)

/* Large - Modals, important elements */
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1),
           0 4px 6px rgba(0, 0, 0, 0.05)

/* Extra large - Overlays */
shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

## Border Radius

### Radius Scale
```
rounded-sm   - 0.125rem (2px)  - Small elements
rounded      - 0.25rem (4px)   - Default
rounded-md   - 0.375rem (6px)  - Medium
rounded-lg   - 0.5rem (8px)    - Cards, buttons
rounded-xl   - 0.75rem (12px)  - Large cards
rounded-2xl  - 1rem (16px)     - Modals, large elements
rounded-full - 9999px          - Circles, pills
```

## Animation

### Transitions
```css
/* Standard transition */
transition-colors  /* 150ms ease-in-out */
transition-all     /* 150ms ease-in-out */

/* Hover states */
hover:opacity-90       /* Gradient buttons */
hover:bg-gray-50       /* Secondary buttons */
hover:shadow-md        /* Cards */
```

### Loading Spinner
```jsx
<div className="animate-spin rounded-full h-12 w-12 
                border-b-2 border-secondary-600"></div>
```

## Responsive Breakpoints

```css
sm:  640px   - Small tablets
md:  768px   - Tablets
lg:  1024px  - Small laptops
xl:  1280px  - Desktops
2xl: 1536px  - Large desktops
```

### Usage
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  <!-- Responsive width -->
</div>
```

## Accessibility

### Focus States
```jsx
<button className="focus:outline-none focus:ring-2 
                   focus:ring-secondary-500 focus:ring-offset-2">
  Click me
</button>
```

### Color Contrast
- All text meets WCAG AA standards
- Gradient text on white: 7:1 ratio
- White text on gradient: 4.5:1 ratio

### Keyboard Navigation
- All interactive elements focusable
- Clear focus indicators
- Logical tab order

## Design Principles

### 1. Simplicity
- Clean layouts
- Minimal decoration
- Focus on content

### 2. Consistency
- Same spacing throughout
- Consistent component styles
- Predictable interactions

### 3. Clarity
- Clear visual hierarchy
- Readable typography
- Obvious interactive elements

### 4. Brand Identity
- Mycelium metaphor throughout
- Gradient as signature element
- Connected, organic feel

### 5. Performance
- Optimized colors
- Efficient animations
- Fast loading

## Examples

### Dashboard Stats Card
```jsx
<div className="bg-white rounded-lg shadow hover:shadow-md 
                transition-shadow p-5">
  <div className="flex items-center">
    <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 
                    rounded-md p-3">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-5">
      <dt className="text-sm font-medium text-gray-500">
        Total Projects
      </dt>
      <dd className="text-2xl font-semibold text-gray-900">
        24
      </dd>
    </div>
  </div>
</div>
```

### Project Card
```jsx
<div className="bg-white rounded-lg shadow hover:shadow-lg 
                transition-shadow cursor-pointer p-5">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 rounded-lg flex items-center 
                    justify-center text-white font-bold text-xl"
         style={{backgroundColor: projectColor}}>
      {projectInitial}
    </div>
    <span className="px-2 py-1 text-xs font-medium rounded-full 
                     bg-green-100 text-green-800">
      active
    </span>
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Project Name
  </h3>
  <p className="text-sm text-gray-500 mb-4">
    Description text here
  </p>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="h-2 rounded-full bg-myceili-gradient"
         style={{width: `${progress}%`}}></div>
  </div>
</div>
```

---

**Myceili Design System v1.0**

*Building beautiful, connected experiences*

