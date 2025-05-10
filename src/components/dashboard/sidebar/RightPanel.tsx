
import { useState } from "react";
import { DashboardTab } from "../DashboardLayout";
import QuickActions from "./QuickActions";
import SupportChat from "./SupportChat";
import RecentActivity from "./RecentActivity";

interface RightPanelProps {
  setActiveTab: (tab: DashboardTab) => void;
}

const RightPanel = ({ setActiveTab }: RightPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions setActiveTab={setActiveTab} />

      {/* Support Chat */}
      <SupportChat />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default RightPanel;
