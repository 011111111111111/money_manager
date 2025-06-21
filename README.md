# 💰 Expenso Together - Shared Expense Tracker

A modern expense tracking app built with React, TypeScript, and Node.js that allows you to track personal expenses and create shared events for group expenses.

## ✨ Features

- **Personal Expense Tracking**: Track your daily expenses with categories and payment modes
- **Shared Events**: Create events and share links with friends to track group expenses
- **Real-time Updates**: See expenses update in real-time across all participants
- **Beautiful UI**: Modern design with shadcn/ui components
- **Mobile Responsive**: Works perfectly on all devices
- **No Registration Required**: Simple link-based sharing system

## 🚀 Quick Start

### Local Development

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd expenso-together-now
   npm install
   cd backend && npm install && cd ..
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - Framework: Vite
     - Root Directory: `expenso-together-now`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy!

3. **Your app will be live at**: `https://your-app.vercel.app`

📖 **Detailed deployment guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **React Query** for data fetching
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express
- **SQLite** database (with cloud database options)
- **RESTful API** design
- **CORS** enabled for cross-origin requests

### Database Schema
```sql
-- Personal expenses
expenses (id, type, amount, category, description, date, paymentMode, splitInfo)

-- Shared events
shared_events (id, name, description, shareCode, isActive, createdAt)

-- Shared expenses
shared_expenses (id, eventId, description, amount, paidBy, splitBetween, date, category, paymentMode, createdBy)
```

## 📱 How to Use

### Personal Expenses
1. Add expenses with categories (Food, Transport, Entertainment, etc.)
2. Choose payment mode (Cash, Card, UPI, etc.)
3. View expense history and charts
4. Track your spending patterns

### Shared Events
1. Create a new shared event
2. Get a unique share code (e.g., ABC123)
3. Share the link: `https://your-app.vercel.app/shared/ABC123`
4. Anyone with the link can add expenses
5. View all expenses and splits in real-time

## 🔧 API Endpoints

### Personal Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Shared Events
- `GET /api/shared-events` - Get all events
- `POST /api/shared-events` - Create new event
- `GET /api/shared-events/:shareCode` - Get event by code
- `POST /api/shared-events/:shareCode/expenses` - Add expense to event
- `GET /api/shared-events/:shareCode/expenses` - Get event expenses

### Health Check
- `GET /api/health` - Server status

## 🗄️ Database Options

### Current: SQLite (Vercel)
- Stored in `/tmp` directory
- Data may be cleared occasionally (serverless limitation)
- Good for testing and small apps

### Recommended: Cloud Database
For production apps, consider:
- **Supabase** (free PostgreSQL)
- **PlanetScale** (free MySQL)
- **MongoDB Atlas** (free MongoDB)

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Start only frontend
npm run dev:backend  # Start only backend
npm run build        # Build for production
npm run preview      # Preview production build
```

### Project Structure
```
expenso-together-now/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── backend/
│   └── server.js      # Express server
├── public/            # Static assets
└── dist/              # Build output
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Cards, Buttons, Forms
- Modals, Dropdowns, Tabs
- Charts, Tables, Badges
- Toast notifications
- Responsive design

## 🔒 Security

- CORS configured for production domains
- Input validation on all endpoints
- SQL injection protection with parameterized queries
- No sensitive data stored in client-side storage

## 🚀 Performance

- React Query for efficient data caching
- Vite for fast builds and HMR
- Optimized bundle size
- Lazy loading for routes
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the deployment guide
- **Community**: Share your feedback and ideas

---

**🎯 Ready to track expenses together? Deploy your app and start sharing!**
