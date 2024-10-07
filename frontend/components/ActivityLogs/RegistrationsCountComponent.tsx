"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchRegistrationsCount } from '@/store/activityLogSlice';

const RegistrationsCountComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { registrationsCount, loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    dispatch(fetchRegistrationsCount({ startDate: startDate.toISOString(), endDate: endDate.toISOString() }) as any);
  }, [dispatch]);

  return (
    <div className="bg-zinc-800 p-4 rounded-md shadow-md mb-6">
      <h2 className="text-xl font-bold">Registrations Count</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">Count: {registrationsCount}</p>
      )}
    </div>
  );
};

export default RegistrationsCountComponent;
