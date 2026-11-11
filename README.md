# StayOS – Hotel Review Management Landing Page

A responsive SaaS landing page for **StayOS**, a fictional hotel review management platform. Built as the Front-End Development Internship Assignment for **Sankar Group**.

**Live Demo:** https://website-ten-gamma-21.vercel.app
**Repository:** https://github.com/Unishkabisht/website

---

## About the Product

StayOS brings guest reviews from Google, TripAdvisor, Booking.com and MakeMyTrip into one dashboard. Hotels can reply faster with AI-drafted responses, collect feedback automatically after checkout, and track reputation trends. The landing page explains the product and pushes visitors to join the early access waitlist.

## Page Sections

| Section | What it does |
|---|---|
| **Navigation bar** | Logo, anchor links (Platform, Results, Who It Serves, FAQ), Login and Get Early Access buttons, hamburger menu on mobile |
| **Hero** | Headline, short description, two CTAs (Get Early Access, See the Platform) and a promo video |
| **Problem** | Three cards explaining the pain points hotels face with reviews |
| **Results** | Key numbers: reply rate, median reply time, reviews tracked, platforms |
| **Features** | Eight feature blocks with product screenshots: unified reviews, automated feedback collection, AI reply drafts, insights, auto-reply rules, competitor benchmarking, team roles, embeddable widgets |
| **Benefits** | Four benefit cards for owners and managers |
| **Who It Serves** | Ownership, General Manager and Front Desk perspectives |
| **How It Works** | Three-step flow: connect, respond, track |
| **FAQ** | Expandable accordion answering common questions |
| **Footer** | Quick links, product links, legal links and copyright |

## Functionality

- Navigation links smooth-scroll to the matching section
- CTA buttons open the signup page; "See the Platform" scrolls to the features
- Login and Signup pages with basic input validation and a success message (no backend)
- FAQ accordion expands and collapses on click
- Mobile hamburger menu for small screens
- Fully responsive across mobile, tablet and desktop

## Tech Stack

- **HTML5** – semantic structure
- **CSS3** – custom styling, Flexbox/Grid, media queries
- **JavaScript (vanilla)** – menu toggle, FAQ accordion, form validation
- **Vercel** – deployment

No backend, database or payment integration, as per the assignment.

## Project Structure

```
website/
├── index.html      # Landing page
├── login.html      # Login page
├── signup.html     # Early access signup page
├── images/         # Logo, product screenshots, promo video
└── README.md
```

## Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Unishkabisht/website.git

# 2. Go into the folder
cd website

# 3. Open index.html in your browser
# or use a local server (VS Code Live Server / npx serve)
npx serve
```

## Design Choices

- Kept a clean, consistent layout with one visual language across all sections, so the page reads top to bottom: problem, solution, proof, how it works, FAQ.
- Used real product screenshots in the features section so visitors see what they are signing up for.
- Placed the primary "Get Early Access" CTA in the navbar, hero, features and closing section for repeated conversion points.
- Went mobile-first with a collapsible navbar and stacked sections on small screens.
- Added SEO-friendly meta tags, keyword-rich headings and descriptive image alt text.
- Challenge solved: keeping the large feature screenshots and promo video responsive without breaking the layout on narrow screens.

## Author

**Unishka Bisht**
GitHub: [Unishkabisht](https://github.com/Unishkabisht) · LinkedIn: [unishka-bisht](https://www.linkedin.com/in/unishka-bisht-46b7b2400) · Portfolio: [portfolio-unishkabisht](https://portfolio-unishkabisht-s27e.vercel.app/)

---

