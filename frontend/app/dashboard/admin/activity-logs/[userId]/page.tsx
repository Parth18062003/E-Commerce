import ActivityCountsComponent from "@/components/ActivityCountsComponent";
import ActivityLogs from "@/components/ActivityLogs";
import ActivitySummaryComponent from "@/components/ActivitySummaryComponent";
import ListUsers from "@/components/ListUsers";
import UserActivitiesComponent from "@/components/UserActivitiesComponent";
import React from "react";

const ActivityLogsPage = () => {
  const userId = "b0c03b40-e11f-4bfa-9120-316b88349d46"; // Get the user ID from the URL
  return (
    <div className="translate-x-20 max-w-7xl"> 
      <ActivityCountsComponent />
      <ActivitySummaryComponent userId={userId} />
      <UserActivitiesComponent userId={userId} /> 
      <ListUsers />
    </div>
  );
};

export default ActivityLogsPage;
