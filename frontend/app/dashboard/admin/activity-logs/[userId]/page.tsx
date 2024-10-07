"use client";

import ActivityCountsComponent from "@/components/ActivityLogs/ActivityCountsComponent";
import ActivitySummaryComponent from "@/components/ActivityLogs/ActivitySummaryComponent";
import { DailyActivityTrendsComponent } from "@/components/ActivityLogs/DailyActivityTrendsComponent";

import DailyLoginsCountComponent from "@/components/ActivityLogs/DailyLoginsComponent";
import RegistrationsCountComponent from "@/components/ActivityLogs/RegistrationsCountComponent";
import UpdatesCountComponent from "@/components/ActivityLogs/UpdatesCountComponent";
import UserActivitiesComponent from "@/components/ActivityLogs/UserActivitiesComponent";
import UserSearchComponent from "@/components/UserSearchComponent";
import React, { useState } from "react";

const ActivityLogsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null); // State to hold user ID

  const handleUserIdFetched = (id: string) => {
    setUserId(id); // Update user ID state
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 translate-x-20">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      
      <ActivityCountsComponent />
      <DailyLoginsCountComponent />
      <UpdatesCountComponent />
      <RegistrationsCountComponent />
      <UserSearchComponent onUserIdFetched={handleUserIdFetched} />
      {userId && (
        <>
          <ActivitySummaryComponent userId={userId} />
          <div className="mt-6">
            <UserActivitiesComponent userId={userId} />
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogsPage;
