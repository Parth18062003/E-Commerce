"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store'; 
import { fetchUserActivities } from '../store/activityLogSlice';
import { Button } from './ui/button'; // Ensure you have a button component from ShadCN
import { Card } from './ui/card'; // Example of a card component from ShadCN

const UserActivitiesComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { userActivities, loading, error, pagination } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserActivities({ userId, page: 0 }) as any); // Fetch the first page of activities
    }
  }, [dispatch, userId]);

  console.log(pagination.totalPages, pagination.currentPage);
  return (
    <div className="p-4 bg-zinc-900 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">User Activities</h3>

      {loading && <p className="text-zinc-500">Loading user activities...</p>}

      {error && <p className="text-red-500">Error: {error}</p>}

      <Card className="mt-4 p-4">
        {Array.isArray(userActivities) && userActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-zinc-800">
              <thead>
                <tr className="bg-zinc-700">
                  <th className="px-4 py-2 text-left text-zinc-300">Activity Type</th>
                  <th className="px-4 py-2 text-left text-zinc-300">Details</th>
                  <th className="px-4 py-2 text-left text-zinc-300">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {userActivities.map((activity) => (
                  <tr key={activity.timestamp} className="border-b border-zinc-600">
                    <td className="px-4 py-2 text-zinc-200">{activity.activityType}</td>
                    <td className="px-4 py-2 text-zinc-200">{activity.details}</td>
                    <td className="px-4 py-2 text-zinc-200">{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-500">No user activities found.</p>
        )}
      </Card>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-zinc-600">Page {pagination.currentPage + 1} of {pagination.totalPages}</p>
          <div className="flex space-x-2">
            <Button
              onClick={() => dispatch(fetchUserActivities({ userId, page: pagination.currentPage - 1 }))} 
              disabled={pagination.currentPage === 0}
              className={pagination.currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}
            >
              Previous
            </Button>
            <Button
              onClick={() => dispatch(fetchUserActivities({ userId, page: pagination.currentPage + 1 }))} 
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className={pagination.currentPage >= pagination.totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivitiesComponent;
