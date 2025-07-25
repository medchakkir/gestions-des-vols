# Travel.com - Flight Booking Application

A modern flight booking web application built with React frontend and Express.js backend, featuring a complete user authentication system, flight search and booking functionality, and responsive design.

## 🚀 Features

### Frontend (React + Vite + Tailwind CSS + shadcn/ui)
- **Modern React Architecture**: Built with React 18, Vite for fast development, and React Router for navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui components for consistent design
- **Authentication**: Complete user authentication flow with protected routes
- **Flight Booking**: Search, compare, and book flights with an intuitive interface
- **User Dashboard**: Manage bookings and view flight history
- **Multi-language Support**: French interface with internationalization ready

### Backend (Express.js + PostgreSQL)
- **RESTful API**: Well-structured API endpoints for all functionality
- **Session Management**: Secure session-based authentication
- **Database Integration**: PostgreSQL with connection pooling
- **Email Services**: User verification and notifications
- **Payment Integration**: PayPal integration for secure payments
- **Security**: CORS, session security, and input validation

## 🏗️ Architecture

```
travel-com/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── layout/     # Layout components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   └── dist/              # Production build
├── backend/                # Express.js server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   ├── middlewares/   # Express middlewares
│   │   ├── config/        # Configuration files
│   │   └── views/         # EJS templates (legacy)
│   └── public/            # Static files
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Express Session** - Session management
- **Nodemailer** - Email sending
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/medchakkir/gestion-des-vols.git
   cd gestion-des-vols
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   # Database
   DB_STRING=your_postgresql_connection_string
   
   # Session
   SESSION_SECRET=your_session_secret_key
   
   # Email (optional)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # PayPal (optional)
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   
   # Environment
   NODE_ENV=development
   PORT=3001
   ```

4. **Set up the database**
   - Create a PostgreSQL database
   - Run the SQL schema (check backend/src/config/schema.sql if available)

### Development

1. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start:
   - Backend server on http://localhost:3001
   - Frontend development server on http://localhost:5173

2. **Or start them separately**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The production build will:
- Build the React frontend to `frontend/dist`
- Serve the React app from the Express server
- Handle both API routes and frontend routing

## 📱 Pages and Features

### Public Pages
- **Home** (`/`) - Landing page with featured destinations
- **About** (`/about`) - Company information and team
- **Contact** (`/contact`) - Contact form and information
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Protected Pages (Requires Authentication)
- **Dashboard** (`/dashboard`) - User dashboard with booking overview
- **Booking** (`/booking`) - Flight search and selection
- **Payment** (`/payment`) - Secure payment processing

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Flights
- `POST /flight/search` - Search flights
- `GET /flight/airports` - Get airports list
- `POST /flight/book` - Book a flight
- `GET /flight/user-flights` - Get user's flights
- `DELETE /flight/booking/:id` - Cancel booking

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

## 🎨 Design System

The application uses a consistent design system built with:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **Custom CSS variables** for theming
- **Responsive breakpoints** for mobile-first design

### Color Palette
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

## 🔒 Security Features

- **Session-based authentication** with secure cookies
- **Password hashing** with bcrypt
- **CORS protection** for API endpoints
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries
- **XSS protection** with proper data handling

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_STRING=your_production_database_url
SESSION_SECRET=your_strong_session_secret
# ... other production variables
```

### Build Process
1. Frontend is built to static files
2. Backend serves the React app for all non-API routes
3. API routes are handled by Express.js
4. Static assets are served efficiently

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Vite](https://vitejs.dev/) - Build tool
- [PostgreSQL](https://www.postgresql.org/) - Database

## 📞 Support

For support, email contact@travel.com or create an issue in this repository.

---

**Travel.com** - Making travel accessible and enjoyable for everyone! ✈️

