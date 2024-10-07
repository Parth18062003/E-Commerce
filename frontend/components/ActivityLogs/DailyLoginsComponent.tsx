"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDailyLoginsCount } from '@/store/activityLogSlice';

const DailyLoginsCountComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { dailyLoginsCount, loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Today's date
    dispatch(fetchDailyLoginsCount(today) as any);
  }, [dispatch]);

  return (
    <div className="bg-zinc-800 p-4 rounded-md shadow-md mb-6">
      <h2 className="text-xl font-bold">Daily Logins Count</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">Count: {dailyLoginsCount}</p>
      )}
    </div>
  );
};

export default DailyLoginsCountComponent;
