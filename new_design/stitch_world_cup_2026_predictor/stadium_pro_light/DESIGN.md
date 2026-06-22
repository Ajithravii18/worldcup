---
name: Stadium Pro Light
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#454654'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757686'
  outline-variant: '#c5c5d7'
  surface-tint: '#3a4ed5'
  primary: '#001278'
  on-primary: '#ffffff'
  primary-container: '#0020b2'
  on-primary-container: '#8f9dff'
  inverse-primary: '#bcc3ff'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#4a0f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#701b00'
  on-tertiary-container: '#ff7f59'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bcc3ff'
  on-primary-fixed: '#000d60'
  on-primary-fixed-variant: '#1b32be'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#862200'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Archivo Narrow
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for elite sports analytics and stadium management, emphasizing high-velocity data consumption and professional precision. The aesthetic is **Corporate Modern with an Athletic Edge**, prioritizing clarity, structural integrity, and energetic movement. 

The target audience consists of data scientists, team managers, and broadcast coordinators who require a "heads-up display" experience that remains comfortable during extended daylight use. By pivoting to a high-fidelity light theme, the system leverages expansive whitespace to reduce cognitive load while maintaining the aggressive, authoritative tone inherent in professional sports. The UI evokes a sense of expertise, reliability, and "match-day" readiness.

## Colors

The palette is rooted in a "Clean Stadium" concept, utilizing high-contrast accents against a sophisticated, cool-neutral foundation.

- **Primary (Tactical Blue):** `#0020B2` is used for navigation, branding, and primary data sets. It provides a deep, authoritative anchor for the light interface.
- **Success (Pitch Green):** `#2E7D32` is utilized for positive performance metrics, "live" indicators, and field-status updates.
- **Action (Striker Orange):** `#FF5722` is reserved strictly for primary calls-to-action and critical alerts, ensuring immediate visual acquisition.
- **Neutral/Surface:** The background uses a crisp `#F8F9FA` to prevent screen glare, while text is set in a deep `#121212` charcoal for maximum legibility and professional rigor.

## Typography

This design system utilizes a dual-type approach to balance intensity with readability. 

**Archivo Narrow** is the engine of the system, used for all headlines, data points, and labels. Its condensed nature allows for high-density information display—perfect for scoreboards and analytical tables—without sacrificing impact. All labels use an uppercase transformation with slight tracking to enhance scanability.

**Inter** serves as the functional workhorse for body copy and descriptions. Its neutral, systematic geometry provides a necessary visual rest from the high-energy headlines, ensuring long-form reports are easily digestible.

## Layout & Spacing

The layout philosophy follows a **Rigid Grid** model, echoing the structured lines of a sports pitch. 

- **Grid:** A 12-column system is used for desktop, collapsing to 4 columns on mobile. 
- **Rhythm:** A 4px baseline grid ensures vertical alignment across all components.
- **Density:** High-density layouts are preferred for dashboard views, using 8px and 16px padding increments to pack data tightly but cleanly. 
- **Adaptation:** On mobile, horizontal scrolling "cards" are used for statistical modules to maintain the integrity of data tables that would otherwise be cramped.

## Elevation & Depth

To maintain a professional, expert aesthetic, this design system rejects heavy glows in favor of **Tonal Layering and Precision Outlines**.

- **Surface Levels:** Depth is created by placing white (`#FFFFFF`) cards on top of the light gray (`#F8F9FA`) background.
- **Shadows:** Use extremely soft, low-opacity ambient shadows (e.g., `box-shadow: 0 4px 12px rgba(0, 32, 178, 0.04)`). The subtle blue tint in the shadow maintains brand cohesion.
- **Borders:** Subtle 1px borders in a light cool-gray (`#E9ECEF`) are used to define boundaries between data modules, replacing the need for aggressive shadows.

## Shapes

The shape language is **Soft (0.25rem)**, striking a balance between the aggressive sharp edges of traditional industrial software and the overly friendly roundedness of consumer apps. 

The slight radius suggests a modern, engineered feel. Large containers (cards) use `rounded-lg` (0.5rem) to differentiate themselves from smaller UI elements like input fields and buttons, which remain at the base `0.25rem` for a more precise, technical appearance.

## Components

- **Buttons:** 
    - *Primary:* Striker Orange background with White text. Bold, uppercase Archivo Narrow labels.
    - *Secondary:* Tactical Blue outline with 1px weight. 
- **Cards:** White backgrounds with a subtle `#E9ECEF` border. Headers within cards should have a light gray bottom border to separate titles from data.
- **Input Fields:** Flat background (`#FFFFFF`) with a 1px border. On focus, the border transitions to Tactical Blue with a 2px outer "halo" of the same color at 10% opacity.
- **Chips/Badges:** Used for status. Pitch Green chips use a light green tint background with dark green text to ensure accessibility on light surfaces.
- **Lists:** Data-heavy lists should utilize zebra-striping with `#F1F3F5` on alternating rows to assist horizontal eye-tracking across complex stats.
- **Progress Bars:** Use a thick 8px track. The "filled" portion should use a gradient of Tactical Blue to denote momentum.