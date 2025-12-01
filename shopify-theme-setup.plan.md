# Shopify Theme Creation Plan

## Overview

Create a Shopify theme under `shopify-template/` folder that covers all 14 HTML files in the repository, using Shopify CLI and the Skeleton theme as a foundation.

## Phase 1: Initialize Shopify Theme

Use Shopify CLI to clone the Skeleton theme ([reference](https://github.com/Shopify/skeleton-theme)):

```bash
cd /Users/maxsaad/Desktop/mindvalley/states
shopify theme init shopify-template --clone-url https://github.com/Shopify/skeleton-theme.git
```

This creates the standard Shopify theme structure:

- `layout/` - Base layouts
- `templates/` - Page templates (JSON)
- `sections/` - Reusable sections
- `snippets/` - Small reusable code
- `assets/` - CSS, JS, images
- `config/` - Theme settings
- `locales/` - Translations

## Phase 2: Template Mapping

| Source HTML | Shopify Template | Type |
|-------------|------------------|------|
| `mockup.html` | `templates/index.json` | Homepage |
| `bliss.html` | `templates/product.bliss.json` | Product (Bliss) |
| `dream.html` | `templates/product.dream.json` | Product (Dream) |
| `focus.html` | `templates/product.focus.json` | Product (Focus) |
| `gazm.html` | `templates/product.gazm.json` | Product (Gazm) |
| `zen.html` | `templates/product.zen.json` | Product (Zen) |
| `testimonials.html` | `templates/page.testimonials.json` | Page |
| `science.html` | `templates/page.science.json` | Page |
| `state-assessment-quiz.html` | `templates/page.quiz.json` | Page |
| `index.html` | `templates/collection.json` | Collection |
| `dearteam.html` | `templates/page.about.json` | Page |
| `analysis-report.html` | `templates/page.analysis.json` | Page |
| `states-analysis-report.html` | `templates/page.states-analysis.json` | Page |
| `optimization-guide.html` | `templates/page.guide.json` | Page |

## Phase 3: Section Development

Create custom sections for each unique component:

1. **Hero Sections**
   - Product hero with image and CTA
   - Science hero
   - Quiz hero

2. **Content Sections**
   - Benefits grid
   - Testimonials carousel
   - Science content blocks
   - Ingredients list
   - FAQ accordion

3. **Product Sections**
   - Product details
   - Product images gallery
   - Cross-sell recommendations
   - Add to cart functionality

4. **Interactive Sections**
   - Quiz form
   - Assessment calculator
   - Results display

## Phase 4: Asset Migration

1. **CSS Files**
   - Copy `mv-selfreset-base.css` to `assets/base-styles.css`
   - Create modular CSS for each section
   - Optimize for Shopify's asset pipeline

2. **Images**
   - Organize product images in `assets/`
   - Set up image optimization
   - Create responsive image snippets

3. **JavaScript**
   - Interactive quiz functionality
   - Cart drawer functionality
   - Smooth scroll and animations

## Phase 5: Liquid Development

### Snippets to Create

- `product-card.liquid` - Product display component
- `testimonial-card.liquid` - Testimonial component
- `ingredient-card.liquid` - Ingredient display
- `image.liquid` - Responsive image handler
- `meta-tags.liquid` - SEO optimization

### Sections to Create

- `hero.liquid` - Hero section with variants
- `benefits.liquid` - Benefits grid
- `testimonials.liquid` - Testimonials section
- `science-hero.liquid` - Science page hero
- `quiz.liquid` - Assessment quiz
- `products-grid.liquid` - Product listing
- `video-section.liquid` - Video content
- `cross-sell.liquid` - Related products

## Phase 6: Theme Settings

Configure in `config/settings_schema.json`:

- Color schemes
- Typography settings
- Spacing options
- Layout preferences
- Animation controls

## Phase 7: Testing & Optimization

1. **Functionality Testing**
   - All pages render correctly
   - Forms submit properly
   - Cart functions work
   - Navigation is smooth

2. **Performance**
   - Optimize images
   - Minify CSS/JS
   - Lazy load images
   - Test page speed

3. **Responsive Design**
   - Mobile optimization
   - Tablet layouts
   - Desktop views

4. **Browser Testing**
   - Chrome
   - Safari
   - Firefox
   - Edge

## Phase 8: Deployment

1. Connect to Shopify store
2. Upload theme via CLI
3. Preview theme
4. Publish when ready

```bash
shopify theme push
shopify theme serve
```

## Success Criteria

- ✓ All 14 HTML files converted to Shopify templates
- ✓ Responsive design maintained
- ✓ All functionality working
- ✓ Performance optimized
- ✓ Theme customizable through Shopify admin
- ✓ SEO optimization in place

