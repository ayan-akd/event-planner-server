# Evenzo Backend API


## 📝 Overview

Evenzo Backend is a RESTful API service built with Node.js, Express, and Prisma ORM that powers the Evenzo Event Planning & Participation System. This API handles authentication, event management, participant control, and payment processing via Shurjopay integration.

## 🚀 Live API

- Backend API: [Evenzo Backend](https://event-planner-server-virid.vercel.app)
- Frontend: [Evenzo Frontend](https://evenzo.vercel.app)


## ✨ Key Features

- **Authentication System**
  - JWT-based secure authentication
  - Role-based access control (User/Admin)
  
- **Event Management**
  - CRUD operations for events
  - Public/Private event visibility settings
  - Registration fee implementation
  
- **User Management**
  - User registration and profile management
  - Admin dashboard for user monitoring
  
- **Participation System**
  - Join requests handling
  - Invitation system
  - Participant approval workflow
  
- **Payment Integration**
  - Shurjopay payment gateway integration
  - Payment verification and status tracking
  
- **Security**
  - Input validation and sanitization
  - Rate limiting for API endpoints
  - Secure headers implementation

## 🔧 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL on Supabase
- **ORM:** Prisma
- **Authentication:** JWT
- **Payment:** Shurjopay
- **Validation:** Zod
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- Supabase account
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/ayan-akd/event-planner-server
cd event-planner-server
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
bun install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:

```
# Application
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL= <your_database_url>
DIRECT_URL= <your_direct_url_from_supabase>
ENABLE_PRISMA_CACHING=false

# Authentication
JWT_SECRET=your_secret_jwt_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Shurjopay
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PASSWORD=pyyk97hu&6u6
SP_PREFIX=SP
SP_RETURN_URL= <your_return_url>
DB_FILE=./shurjopay-tx.db
```

4. **Database Setup**

```bash
npx prisma migrate dev --name init
# Seeds the database with initial data
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Build for production**

```bash
npm run build
# or
yarn build
```


## 🌐 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/change-password` - Change user password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `GET /api/users/invite` - Get users that can be invited
- `PATCH /api/users/:id` - Update user profile
- `PATCH /api/users/change-status/:id` - Update user status
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events with filters
- `GET /api/events/:id` - Get event details
- `GET /api/events/hero-event` - Get hero event
- `GET /api/events/my-events` - Get user's events
- `POST /api/events/create` - Create new event
- `PATCH /api/events/:id` - Update event
- `PATCH /api/events/:id/hero` - Update hero event
- `DELETE /api/events/:id` - Hard delete event
- `DELETE /api/events/:id/admin` - Hard delete event by admin
- `DELETE /api/events/:id/soft` - Soft delete event

### Participation
- `GET /api/participants` - Get all participants
- `POST /api/participants/create-participant` - Join or request to join an event
- `GET /api/participants/:id` - Get participant details
- `PATCH /api/participants/:id` - Approve/reject participant
- `DELETE /api/participants/:id` - Remove participant

### Invitations
- `GET /api/invitations` - Get all invitations
- `GET /api/invitations/:id` - Get invitation details
- `GET /api/invitations/notifications` - Get notifications count
- `GET /api/invitations/my-created-invites` - Get created invitations
- `GET /api/invitations/my-received-invites` - Get received invitations
- `POST /api/invitations` - Send invitation
- `GET /api/invitations/received` - Get received invitations
- `PATCH /api/invitations/:id` - Accept/decline invitation
- `DELETE /api/invitations/delete/:id` - Delete invitation

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/admin` - Get all reviews for admin
- `GET /api/reviews/:id` - Get review details
- `GET /api/reviews/specific-event/:id` - Get reviews for a specific event
- `POST /api/reviews` - Create review
- `PATCH /api/reviews/:id` - Update review
- `PATCH /api/reviews/delete/:id` - Delete review

### Payments
- `POST /api/payment/init` - Initialize payment
- `POST /api/payment/success/:id` - Payment success callback
- `POST /api/payment/fail/:id` - Payment failure callback
- `POST /api/payment/cancel/:id` - Payment cancellation callback

### Admin
- `GET /api/admin/events` - Get all events (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/events/:id` - Update event status (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

## 💳 Shurjopay Integration

Evenzo uses Shurjopay for processing payments:

1. When a user attempts to join a paid event, the API initiates a payment session with Shurjopay
2. User completes payment on the Shurjopay gateway
3. Shurjopay redirects to success/failure endpoints
4. Backend verifies transaction via validation API
5. Upon successful verification, user's participation status is updated


## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **events** - Created events with details
- **participants** - Event participation records
- **invitations** - Event invitations
- **reviews** - Event reviews
- **payments** - Payment records and statuses

### Prisma Schema

The complete database schema is defined in `prisma/schema.prisma`.

## 🔒 Authentication & Security

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- API endpoints have role-based access control
- Input validation prevents common attacks


## 🐞 Troubleshooting

- **Database Connection Issues**: Verify DATABASE_URL in .env file
- **Payment Gateway Errors**: Check Shurjopay credentials and test mode settings
- **JWT Errors**: Ensure JWT_SECRET is properly set

## 🚀 Deployment

### Render Deployment

1. Create a new Web Service on Render or Supabase
2. Connect your GitHub repository
3. Set environment variables from your .env file
4. Set build command: `npm install && npx prisma generate && npm run build`
5. Set start command: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related Projects
- [Evenzo-frontend](https://github.com/ayan-akd/event-planner-client): Frontend repository.

## 👥 Collaborators
- [Ayan Kumar Das](https://github.com/ayan-akd)
- [Hammad Sadi](https://github.com/hammadsadi)
- [Md. Zakaria Hossain](https://github.com/Zakaria-24)


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 📬 Contact

For any inquiries or issues, please contact us at support@evenzo.com
