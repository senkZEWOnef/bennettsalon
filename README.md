# Bennett Salon de Beauté

A modern, client-friendly webapp for Bennett Salon de Beauté featuring online appointment booking, service gallery, and client testimonials.

## Features

- **Modern Design**: Clean, professional interface built with React and Bootstrap
- **Appointment Booking**: Interactive calendar for clients to book appointments (pending owner confirmation)
- **Services Gallery**: Showcase of past work and services offered
- **Client Testimonials**: Display of client reviews and experiences
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Bootstrap 5 with React Bootstrap
- **Routing**: React Router DOM
- **Calendar**: React Calendar component
- **Build Tool**: Vite
- **Backend**: Node.js/Express (in development)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.tsx   # Main navigation bar
│   └── Footer.tsx       # Site footer
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Booking.tsx      # Appointment booking
│   ├── Gallery.tsx      # Services gallery
│   └── Testimonials.tsx # Client reviews
├── styles/              # CSS styles
│   └── index.css        # Global styles
└── App.tsx              # Main app component
```

## Adding Your Photos

The gallery is ready for your salon photos! To add them:
1. Create a `public/images` folder
2. Add your photos to this folder
3. Update the Gallery component to reference your actual images
4. Let me know if you need help with this step!

## Deployment

The app can be deployed to various platforms:
- **Vercel** (recommended for frontend)
- **Netlify**
- **GitHub Pages**

## Future Enhancements

- Backend API for appointment management
- Database integration
- Email notifications
- Admin dashboard for appointment management
- Payment integration
- SMS notifications

## Contact

For questions or support, contact the development team.