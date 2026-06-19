import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import BondList from '@/pages/BondList';
import BondDetail from '@/pages/BondDetail';
import FundTracking from '@/pages/FundTracking';
import FinanceMonitor from '@/pages/FinanceMonitor';
import Sentiment from '@/pages/Sentiment';
import Duration from '@/pages/Duration';
import Reports from '@/pages/Reports';

/**
 * 主布局组件
 * 包含侧边栏、顶部导航和主内容区域
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**
 * 应用根组件
 * 配置路由系统
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bonds" element={<BondList />} />
          <Route path="/bonds/:id" element={<BondDetail />} />
          <Route path="/funds" element={<FundTracking />} />
          <Route path="/finance" element={<FinanceMonitor />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/duration" element={<Duration />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
