
import { useState } from "react";
import ActionsCard from "./sidebar/ActionsCard";
import SupportCard from "./sidebar/SupportCard";
import ActivityCard from "./sidebar/ActivityCard";
import { DashboardTab } from "./DashboardLayout";

interface RightSidebarProps {
  setActiveTab: (tab: DashboardTab) => void;
}

const RightSidebar = ({ setActiveTab }: RightSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Upcoming Actions */}
      <ActionsCard setActiveTab={setActiveTab} />

      {/* Support Chat */}
      <SupportCard />

      {/* Recent Activity */}
      <ActivityCard />
    </div>
  );
};

export default RightSidebar;
