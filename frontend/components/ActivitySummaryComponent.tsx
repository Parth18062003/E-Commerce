"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store'; // Adjust the import path accordingly
import { fetchActivitySummary } from '../store/activityLogSlice';

const ActivitySummaryComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    if (userId) {
      dispatch(fetchActivitySummary(userId) as any); // Use 'as any' if necessary to avoid TypeScript issues
    }
  }, [dispatch, userId]);

  if (loading) return <p>Loading activity summary...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Activity Summary</h3>
      <div>{}</div>
      {/* Render the summary here */}
    </div>
  );
};

export default ActivitySummaryComponent;
