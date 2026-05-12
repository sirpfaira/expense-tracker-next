# Expense Tracker Next

A modern, full-featured expense tracking application built with Next.js. Track expenses across multiple currencies, collaborate with other users, and gain insights into your spending patterns in real-time.

## Features

### 💰 Multi-Currency Support
- Track expenses in multiple currencies simultaneously
- Automatic currency conversion with real-time exchange rates
- Support for 150+ global currencies
- View all expenses in your preferred base currency

### 👥 Multi-User Collaboration
- Create shared expense groups with friends and family
- Real-time collaboration and updates
- Expense splitting and fair settlement calculations
- User roles and permissions management
- Detailed expense history and audit trail

### 📊 Analytics & Insights
- Beautiful dashboards with spending trends
- Category-based expense breakdown
- Monthly and yearly spending reports
- Budget tracking and alerts
- Custom date range filtering

### 🔐 Security & Privacy
- Secure authentication and authorization
- End-to-end encryption for sensitive data
- User data privacy controls
- Two-factor authentication support

### 📱 Responsive Design
- Mobile-first responsive interface
- PWA support for offline access
- Works seamlessly on desktop, tablet, and mobile

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sirpfaira/expense-tracker-next.git
cd expense-tracker-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CURRENCY_API_KEY=your_currency_api_key
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The app will auto-reload as you edit files. Start modifying `app/page.tsx` or other components to see changes in real-time.

## Project Structure

```
expense-tracker-next/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── expenses/             # Expense management pages
│   ├── groups/               # Group management pages
│   └── page.tsx              # Home page
├── components/               # Reusable React components
├── lib/                      # Utility functions and helpers
├── public/                   # Static files
├── styles/                   # Global styles
└── types/                    # TypeScript type definitions
```

## Usage

### Creating an Expense
1. Navigate to the Expenses section
2. Click "Add Expense"
3. Enter the amount, currency, category, and description
4. Optionally split with group members
5. Save the expense

### Managing Groups
1. Go to Groups section
2. Create a new group or join an existing one
3. Add members to share expenses
4. View group expenses and settle debts

### Viewing Analytics
- Visit the Dashboard to see spending trends
- Filter by date range, currency, or category
- Export reports as PDF or CSV

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - Runtime environment

### Database & Storage
- **PostgreSQL** - Relational database
- **Prisma** - ORM for database management

### Authentication
- **NextAuth.js** - Authentication solution
- **JWT** - Token-based authentication

### Utilities
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Zod** - Schema validation
- **date-fns** - Date manipulation

## API Documentation

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Expenses**
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

**Groups**
- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

**Currency**
- `GET /api/currency/rates` - Get current exchange rates
- `POST /api/currency/convert` - Convert between currencies

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API endpoint URL | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CURRENCY_API_KEY` | API key for currency conversion service | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | NextAuth callback URL | Yes |

## Development

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

## Database Migrations

```bash
# Run pending migrations
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma db push --force-reset
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@expensetracker.com or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI-powered expense categorization
- [ ] Recurring expenses and bills
- [ ] Receipt OCR scanning
- [ ] Email and SMS notifications
- [ ] Advanced budget planning tools
- [ ] Integration with bank APIs
- [ ] Dark mode support

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database ORM by [Prisma](https://www.prisma.io/)
