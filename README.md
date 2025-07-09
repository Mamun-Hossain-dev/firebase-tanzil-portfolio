# Tanzil Hossain - Digital Marketing Portfolio

This is the repository for the personal portfolio website of Tanjil Hossain, an AI-powered, data-driven digital marketer. The site showcases projects, case studies, and services, and provides a dashboard for content management. Built with Next.js, Firebase, and Tailwind CSS, it features modern design, analytics, and secure authentication.

## Features

- **Portfolio Showcase**: Display of latest works and detailed case studies
- **User Authentication**: Secure login and registration with Firebase Authentication
- **Dashboard**: Private dashboard for managing case studies and works
- **Analytics**: Google Analytics 4 integration for traffic and engagement tracking
- **Contact Form**: Visitors can get in touch directly
- **Responsive Design**: Optimized for all devices

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Authentication**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Analytics**: [Google Analytics 4](https://analytics.google.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your_username/firebase-tanzil-portfolio.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd firebase-tanzil-portfolio
   ```
3. **Install dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```
4. **Set up environment variables**
   - Copy `config/env.example` to `.env.local` and fill in your Firebase and Analytics credentials.
5. **Run the development server**
   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env.local` file in the root directory. Use `config/env.example` as a template. Example:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Analytics
NEXT_PUBLIC_GA_ID=
```

## Deployment

This application is deployed on [Vercel](https://vercel.com/). Pushes to the `main` branch trigger automatic deployments.

## Contact

**Tanjil Hossain**  
[Portfolio Website](https://tanjil-hossain.com)  
[Twitter](https://twitter.com/mdtanjilhosain)

For inquiries, use the contact form on the website or email: tanzilhossain@example.com

---

© 2024 Tanjil Hossain. All rights reserved.
