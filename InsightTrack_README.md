# 📊 InsightTrack – Data Analytics Dashboard

**InsightTrack** is a full-stack application that lets you upload, explore, and visualize datasets in real time. Designed for both technical and non-technical users, it simplifies data analysis with an intuitive interface, interactive charts, and instant insights — all without the need for complex tools.

---

## 🚀 Features

- **CSV Upload & Parsing** – Drag-and-drop CSV files with automatic parsing and type detection  
- **Interactive Visualizations** – Bar, line, and pie charts powered by Chart.js  
- **Live Filtering** – Column-wise filters with instant visual updates  
- **Data Tables** – Paginated, sortable tables for exploring raw data  
- **Statistical Insights** – Auto-generated summaries and profiling  
- **Responsive Design** – Works seamlessly on desktop and mobile  

---

## 🏗 Tech Stack

**Frontend**
- React + TypeScript  
- Vite for blazing-fast builds   
- Tailwind CSS for utility-first styling with theming & dark mode   
- Chart.js for interactive data visualizations   

**Backend**
- Node.js + Express.js  
- TypeScript for end-to-end type safety  
- Multer for file uploads with size & type validation  
- Papa Parse for robust CSV parsing   
- Comprehensive error handling and logging  

**Data & Storage**
- In-memory storage layer via `IStorage` interface (swappable backends)  
- Drizzle ORM with PostgreSQL schema ready for migration  
- Neon Database for serverless cloud hosting  
- Connection pooling & session management via **connect-pg-simple**  

---

## 🔄 Data Processing Pipeline
1. **Validation** – MIME type & size check (max 10 MB)  
2. **Parsing** – Papa Parse with error recovery  
3. **Type Inference** – Detects text, number, and date columns  
4. **Profiling** – Generates metadata (rows, columns, file size)  
5. **Visualization** – Feeds processed data into charts and tables  

---

## 📂 Project Structure
```
insighttrack/
├── client/          # React + Vite frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── server/          # Express backend
│   ├── routes/
│   ├── storage/
│   └── utils/
└── shared/          # Shared schemas and types
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+  
- npm or yarn  
- PostgreSQL database (optional if using in-memory storage)

### Installation
```sh
git clone <your-repo-url>
cd insighttrack
npm install
```

### Environment Variables
Create `.env` in the root:
```env
PORT=5173
VITE_API_URL=TYPE_YOUR-API
DATABASE_URL=postgres://user:password@host:port/db
SESSION_SECRET=your_secret_here
```

### Run the app
Frontend:
```sh
cd client
npm run dev
```
Backend:
```sh
cd server
npm run dev
```

---

## 📜 License
MIT License
