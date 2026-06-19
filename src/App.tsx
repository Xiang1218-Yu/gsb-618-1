// 应用根组件：路由配置
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import UnderwritingPage from '@/pages/UnderwritingPage';
import IssuancePage from '@/pages/IssuancePage';
import DurationPage from '@/pages/DurationPage';
import FundTrackingPage from '@/pages/FundTrackingPage';
import FinancialPage from '@/pages/FinancialPage';
import SentimentPage from '@/pages/SentimentPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/underwriting" element={<UnderwritingPage />} />
          <Route path="/underwriting/:projectId" element={<UnderwritingPage />} />
          <Route path="/issuance" element={<IssuancePage />} />
          <Route path="/duration" element={<DurationPage />} />
          <Route path="/fund-tracking" element={<FundTrackingPage />} />
          <Route path="/financial" element={<FinancialPage />} />
          <Route path="/sentiment" element={<SentimentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
