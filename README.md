
# Event Planner Server

A robust backend server for the Event Planner application that handles event management, user authentication, and booking services.

## Features

- User authentication and authorization
- Event creation, management, and booking
- Payment processing integration
- Admin dashboard for event oversight
- Review and rating system
- Email notifications for bookings and updates

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Stripe for payment processing
- Nodemailer for email services

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayan-akd/event-planner-server.git
```

2. Navigate to the project directory:
```bash
cd event-planner-server
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event (Admin only)
- `PUT /api/events/:id` - Update an event (Admin only)
- `DELETE /api/events/:id` - Delete an event (Admin only)

### Bookings
- `GET /api/bookings` - Get all bookings for current user
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel a booking

### Reviews
- `GET /api/reviews/:eventId` - Get all reviews for an event
- `POST /api/reviews` - Add a review for an event
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

## Deployment

The server is deployed on [Vercel/Heroku/etc]. You can access the live API at [API URL].

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Ayan - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/ayan-akd/event-planner-server](https://github.com/ayan-akd/event-planner-server)
