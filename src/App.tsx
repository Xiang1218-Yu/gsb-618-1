// 应用主入口 - 路由配置
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Underwriting from '@/pages/Underwriting';
import Issuance from '@/pages/Issuance';
import Duration from '@/pages/Duration';
import FundTracker from '@/pages/FundTracker';
import FinanceMonitor from '@/pages/FinanceMonitor';
import SentimentMonitor from '@/pages/SentimentMonitor';
import Settings from '@/pages/Settings';

/**
 * 应用根组件
 * 配置全局路由，所有页面使用 MainLayout 布局
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* 工作台首页 */}
          <Route index element={<Dashboard />} />

          {/* 债券承销管理 */}
          <Route path="underwriting" element={<Underwriting />} />
          <Route path="underwriting/:id" element={<Underwriting />} />

          {/* 债券发行管理 */}
          <Route path="issuance" element={<Issuance />} />
          <Route path="issuance/:id" element={<Issuance />} />

          {/* 存续期管理 */}
          <Route path="duration" element={<Duration />} />
          <Route path="duration/:id" element={<Duration />} />

          {/* 募集资金追踪 */}
          <Route path="funds" element={<FundTracker />} />
          <Route path="funds/:id" element={<FundTracker />} />

          {/* 财务监控中心 */}
          <Route path="finance" element={<FinanceMonitor />} />

          {/* 舆情监控中心 */}
          <Route path="sentiment" element={<SentimentMonitor />} />
          <Route path="sentiment/:id" element={<SentimentMonitor />} />

          {/* 系统设置 */}
          <Route path="settings" element={<Settings />} />

          {/* 未知路径重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
