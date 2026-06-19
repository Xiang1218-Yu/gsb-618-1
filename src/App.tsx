import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './pages/Dashboard';
import UnderwritingPage from './pages/Underwriting';
import DurationPage from './pages/Duration';
import FundsPage from './pages/Funds';
import FinancialPage from './pages/Financial';
import SentimentPage from './pages/Sentiment';
import ReportsPage from './pages/Reports';
import { useAppStore } from './store';

// 主应用组件
export default function App() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div
          className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
        >
          <Header />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/underwriting" element={<UnderwritingPage />} />
              <Route path="/duration" element={<DurationPage />} />
              <Route path="/funds" element={<FundsPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/sentiment" element={<SentimentPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
