import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import RecordPage from "@/pages/RecordPage";
import ErrorBook from "@/pages/ErrorBook";
import GoalsPage from "@/pages/GoalsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import DailyDetailPage from "@/pages/DailyDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import { NotificationBanner } from "@/components/NotificationBanner";
import { useTheme } from "@/hooks/useTheme";

/**
 * 主应用组件 - 单用户模式，无需认证
 * 提供路由配置和页面导航
 */
export default function App() {
  const { theme } = useTheme();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/error-book" element={<ErrorBook />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/daily/:date" element={<DailyDetailPage />} />
      </Routes>
      
      {/* 全局通知横幅 */}
      <NotificationBanner theme={theme} />
    </>
  );
}
