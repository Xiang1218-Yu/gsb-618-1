import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Card,
  Button,
  PageHeader
} from '@/components/UI';

// 系统设置页面
const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // 个人信息
    username: 'admin',
    realName: '系统管理员',
    email: '****@***********',
    phone: '138****8888',
    department: '风险管理部',
    position: '风控专员',
    // 通知设置
    emailNotify: true,
    smsNotify: true,
    inAppNotify: true,
    riskWarningNotify: true,
    dailyReportNotify: false,
    weeklyReportNotify: true,
    // 预警阈值
    debtRatioWarning: 70,
    debtRatioDanger: 85,
    currentRatioWarning: 1.5,
    currentRatioDanger: 1.0,
    sentimentNegativeThreshold: 100,
    // 系统设置
    autoLogoutMinutes: 30,
    dataRefreshInterval: 5,
    enableLog: true,
    darkMode: false
  });

  // 设置菜单
  const menuItems = [
    { key: 'profile', label: '个人信息', icon: User },
    { key: 'notification', label: '通知设置', icon: Bell },
    { key: 'warning', label: '预警配置', icon: Shield },
    { key: 'system', label: '系统设置', icon: Database }
  ];

  // 更新设置
  const updateSetting = (key: keyof typeof settings, value: boolean | number | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 保存设置
  const handleSave = () => {
    alert('设置已保存');
  };

  // 渲染个人信息
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#d97706] flex items-center justify-center">
          <UserIcon className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{settings.realName}</h3>
          <p className="text-gray-500">{settings.department} · {settings.position}</p>
        </div>
        <Button variant="outline" className="ml-auto">
          更换头像
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <input
            type="text"
            value={settings.username}
            onChange={e => updateSetting('username', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">真实姓名</label>
          <input
            type="text"
            value={settings.realName}
            onChange={e => updateSetting('realName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            邮箱
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={e => updateSetting('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            手机号
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={e => updateSetting('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
          <input
            type="text"
            value={settings.department}
            onChange={e => updateSetting('department', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
          <input
            type="text"
            value={settings.position}
            onChange={e => updateSetting('position', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1e3a8a]" />
          修改密码
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入当前密码"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
            <input
              type="password"
              placeholder="请输入新密码"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
            <input
              type="password"
              placeholder="请再次输入新密码"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染通知设置
  const renderNotification = () => (
    <div className="space-y-6">
      <h4 className="text-base font-semibold text-gray-900">通知渠道</h4>
      <div className="space-y-4">
        {[
          { key: 'emailNotify', label: '邮件通知', desc: '重要事项发送邮件提醒' },
          { key: 'smsNotify', label: '短信通知', desc: '紧急风险预警发送短信' },
          { key: 'inAppNotify', label: '站内通知', desc: '系统内消息推送' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={e => updateSetting(item.key as keyof typeof settings, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
            </label>
          </div>
        ))}
      </div>

      <h4 className="text-base font-semibold text-gray-900 pt-4">通知内容</h4>
      <div className="space-y-4">
        {[
          { key: 'riskWarningNotify', label: '风险预警通知', desc: '财务指标异常、舆情风险等预警信息' },
          { key: 'dailyReportNotify', label: '日报推送', desc: '每日工作摘要和数据概览' },
          { key: 'weeklyReportNotify', label: '周报推送', desc: '每周风险分析和数据统计' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={e => updateSetting(item.key as keyof typeof settings, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染预警配置
  const renderWarning = () => (
    <div className="space-y-6">
      <h4 className="text-base font-semibold text-gray-900">资产负债率阈值 (%)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">预警阈值</label>
          <input
            type="number"
            value={settings.debtRatioWarning}
            onChange={e => updateSetting('debtRatioWarning', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
          <p className="text-xs text-amber-600 mt-1">超过此值触发预警</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">危险阈值</label>
          <input
            type="number"
            value={settings.debtRatioDanger}
            onChange={e => updateSetting('debtRatioDanger', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
          <p className="text-xs text-red-600 mt-1">超过此值触发危险警报</p>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 pt-4">流动比率阈值</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">预警阈值</label>
          <input
            type="number"
            step="0.1"
            value={settings.currentRatioWarning}
            onChange={e => updateSetting('currentRatioWarning', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
          <p className="text-xs text-amber-600 mt-1">低于此值触发预警</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">危险阈值</label>
          <input
            type="number"
            step="0.1"
            value={settings.currentRatioDanger}
            onChange={e => updateSetting('currentRatioDanger', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
          <p className="text-xs text-red-600 mt-1">低于此值触发危险警报</p>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 pt-4">舆情预警阈值</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">负面舆情单日数量阈值</label>
        <input
          type="number"
          value={settings.sentimentNegativeThreshold}
          onChange={e => updateSetting('sentimentNegativeThreshold', Number(e.target.value))}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">单日负面舆情超过此数量自动触发预警</p>
      </div>
    </div>
  );

  // 渲染系统设置
  const renderSystem = () => (
    <div className="space-y-6">
      <h4 className="text-base font-semibold text-gray-900">安全设置</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">自动登出时间 (分钟)</label>
          <select
            value={settings.autoLogoutMinutes}
            onChange={e => updateSetting('autoLogoutMinutes', Number(e.target.value))}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value={15}>15分钟</option>
            <option value={30}>30分钟</option>
            <option value={60}>60分钟</option>
            <option value={120}>2小时</option>
          </select>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 pt-4">数据设置</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">数据刷新间隔 (分钟)</label>
          <select
            value={settings.dataRefreshInterval}
            onChange={e => updateSetting('dataRefreshInterval', Number(e.target.value))}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value={1}>1分钟</option>
            <option value={5}>5分钟</option>
            <option value={15}>15分钟</option>
            <option value={30}>30分钟</option>
          </select>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">启用操作日志</p>
            <p className="text-xs text-gray-500 mt-0.5">记录用户所有操作行为</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableLog}
              onChange={e => updateSetting('enableLog', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
          </label>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 pt-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-[#1e3a8a]" />
        外观设置
      </h4>
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-900">深色模式</p>
          <p className="text-xs text-gray-500 mt-0.5">切换深色/浅色主题</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={e => updateSetting('darkMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
        </label>
      </div>
    </div>
  );

  // 获取当前内容
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfile();
      case 'notification':
        return renderNotification();
      case 'warning':
        return renderWarning();
      case 'system':
        return renderSystem();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="系统设置"
        description="管理个人信息、通知偏好、预警阈值和系统配置"
        breadcrumbs={[
          { title: '系统设置', href: '/settings' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧菜单 */}
        <div className="lg:col-span-1">
          <Card bodyClassName="p-3">
            <nav className="space-y-1">
              {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.key
                        ? 'bg-[#1e3a8a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* 右侧内容 */}
        <div className="lg:col-span-3">
          <Card
            title={menuItems.find(m => m.key === activeSection)?.label}
            extra={
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                保存设置
              </Button>
            }
          >
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
