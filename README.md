# �� Expenso Together - A Shared Expense Tracker

A modern, simple, and privacy-focused app for tracking group expenses. Create an event, share the link, and start adding expenses with friends—no sign-up required.

## ✨ Features

- **Simplified Interface**: A clean UI focused entirely on shared events.
- **Link-Based Sharing**: Create an event and share a unique link. No accounts or logins needed.
- **Real-time Updates**: See new expenses from friends update in real-time.
- **Mobile Responsive**: Works perfectly on desktop, tablets, and phones.
- **Beautiful UI**: Built with modern shadcn/ui components.
- **Deployable**: Get your own instance running on Vercel in minutes.

## 🚀 Quick Start

### Local Development

1.  **Clone and install dependencies**:
    ```bash
    git clone <your-repo-url>
    cd expenso-together-now
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Open your browser**:
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:3001` (for local dev)

### Deploy to Vercel (Recommended)

1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Ready for initial deployment"
    git push origin main
    ```

2.  **Deploy from Vercel**:
    -   Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
    -   Use the **Vite** framework preset.
    -   Set the Root Directory to `expenso-together-now` if needed.
    -   Deploy!

3.  **Your app will be live at**: `https://your-app.vercel.app`

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
- **Node.js** with Express (running as a Vercel Serverless Function)
- **SQLite** (for Vercel's temporary storage) or **Postgres** (for permanent storage)
- **RESTful API** design

### Database Schema
```sql
-- Shared events
shared_events (id, name, description, shareCode, isActive, createdAt)

-- Expenses within a shared event
shared_expenses (id, eventId, description, amount, paidBy, splitBetween, date, category, paymentMode, createdBy)
```

## 📱 How to Use

1.  Click **"Create New Event"**.
2.  Give your event a name (e.g., "Road Trip" or "Apartment Bills").
3.  A unique shareable link will be created.
4.  Share the link with your friends.
5.  Anyone with the link can view the event and add new expenses.

## 🔧 API Endpoints

### Shared Events
- `GET /api/shared-events` - Get all events
- `POST /api/shared-events` - Create new event
- `GET /api/shared-events/:shareCode` - Get event by code
- `POST /api/shared-events/:shareCode/expenses` - Add expense to event
- `GET /api/shared-events/:shareCode/expenses` - Get event expenses

### Health Check
- `GET /api/health` - Server status

## 🗄️ Database Options

### Current: SQLite (Vercel's Temporary Storage)
- The default setup uses a temporary SQLite file.
- **Data will be deleted after a period of inactivity.**
- Good for testing and short-term events.

### Recommended: Vercel Postgres (Permanent Storage)
For permanent data that is never lost, you can connect a free Vercel Postgres database in the "Storage" tab of your project's dashboard.

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start both frontend and backend for local development
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Project Structure
```
expenso-together-now/
├── api/
│   └── index.js       # Vercel serverless function (Backend)
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── services/      # API services
├── public/            # Static assets
└── dist/              # Build output
```

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Make your changes
4.  Test thoroughly
5.  Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**🎯 Ready to track expenses together? Deploy your app and start sharing!**
