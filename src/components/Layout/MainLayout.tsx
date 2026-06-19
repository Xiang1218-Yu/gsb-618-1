import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * 主布局组件
 * 包含左侧侧边栏、顶部导航栏和主内容区域
 */
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧导航栏 */}
      <Sidebar />

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部状态栏 */}
        <Header />

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
