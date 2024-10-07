"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchActivitySummary } from '@/store/activityLogSlice';

const ActivitySummaryComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    if (userId) {
      dispatch(fetchActivitySummary(userId) as any);
    }
  }, [dispatch, userId]);

  return (
    <div className="bg-zinc-800 p-4 rounded-md shadow-md mb-6">
      <h2 className="text-xl font-bold">Activity Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>

        </ul>
      )}
    </div>
  );
};

export default ActivitySummaryComponent;
