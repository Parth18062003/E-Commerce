"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store'; // Adjust the import path accordingly
import { fetchUserActivities } from '../store/activityLogSlice';

const UserActivitiesComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { userActivities, loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserActivities(userId) as any); // Type assertion if needed
    }
  }, [dispatch, userId]);

  // Loading state
  if (loading) return <p>Loading user activities...</p>;

  // Error handling
  if (error) return <p>Error: {error}</p>;

  // Check if userActivities is an array and render appropriately
  return (
    <div>
      <h3>User Activities</h3>
      <ul>
        {Array.isArray(userActivities) && userActivities.length > 0 ? (
          userActivities.map((activity) => (
            <li key={activity.timestamp}>
              <p>
                {activity.activityType}: {activity.details} at {activity.timestamp}
              </p>
            </li>
          ))
        ) : (
          <li>No user activities found.</li>
        )}
      </ul>
    </div>
  );
};

export default UserActivitiesComponent;
