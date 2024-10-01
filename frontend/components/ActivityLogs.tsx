"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActivityCounts,
  fetchLastUserActivities,
} from "@/store/activityLogSlice";
import { AppDispatch, RootState } from "@/store/store";

interface ActivityLog {
  userId: string;
  email: string;
  activityType: string;
  details: string;
  timestamp: string;
}

const ActivityLogs: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Get userId from Redux state
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const userId = reduxUser?.id;

  // Get activity log counts and activities from Redux state
  const {
    loginFailuresCount,
    loginSuccessesCount,
    uniqueLoginsCount,
    lastUserActivities,
    loading,
    error,
  } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    // Fetch activity counts if not already loaded
    if (loginFailuresCount === 0) {
      dispatch(fetchActivityCounts());
    }

    // Fetch last user activities only if userId is available
    if (userId) {
      dispatch(fetchLastUserActivities(userId));
    }
  }, [dispatch, loginFailuresCount, userId]);

  return (
    <div className="container mx-auto p-6 bg--100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Activity Logs for User: {userId}
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Counts</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg shadow">
            <h4 className="font-bold">Login Failures</h4>
            <p className="text-lg">{loginFailuresCount}</p>
          </div>
          <div className="p-4 rounded-lg shadow">
            <h4 className="font-bold">Login Successes</h4>
            <p className="text-lg">{loginSuccessesCount}</p>
          </div>
          <div className="p-4 rounded-lg shadow">
            <h4 className="font-bold">Unique Logins</h4>
            <p className="text-lg">{uniqueLoginsCount}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-2">Last Activities</h3>
        <ul className="rounded-lg shadow p-4">
          {lastUserActivities.length > 0 ? (
            lastUserActivities.map((log: ActivityLog) => (
              <li key={log.timestamp} className="border-b last:border-b-0 py-2">
                <span className="font-bold">{log.activityType}</span>: {log.details}{" "}
                <span className="text-gray-500">
                  at {new Date(log.timestamp).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No last activities found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLogs;
