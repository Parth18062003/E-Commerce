"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchActivityCounts } from '../store/activityLogSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ActivityCountsComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loginFailuresCount, loginSuccessesCount, uniqueLoginsCount, loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    dispatch(fetchActivityCounts() as any);
  }, [dispatch]);

  if (loading) return <div className="text-center text-lg text-zinc-500">Loading activity counts...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-zinc-950 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Activity Counts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{loginFailuresCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Login Successes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{loginSuccessesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{uniqueLoginsCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityCountsComponent;
