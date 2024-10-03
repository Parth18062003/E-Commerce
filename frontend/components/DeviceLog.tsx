"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceLogs,
  logDeviceInfo,
} from "../store/deviceLogSlice";
import { AppDispatch, RootState } from "@/store/store";
import UAParser from "ua-parser-js";

interface DeviceLog {
  id: string;
  userId: string;
  os: string;
  browser: string;
  device: string;
  osVersion?: string;
  browserVersion?: string;
  deviceVendor?: string;
  deviceModel?: string;
  timestamp: string;
}

const DEFAULT_DEVICE_INFO = {
  os: "Unknown OS",
  browser: "Unknown Browser",
  device: "Desktop",
};

const DeviceLogsComponent: React.FC<{ userId: string; firstName: string }> = ({
  userId,
  firstName,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { deviceLogs, loading, error } = useSelector(
    (state: RootState) => state.deviceLog
  );

  const hasFetchedLogs = useRef(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!hasFetchedLogs.current && deviceLogs.length === 0) {
        hasFetchedLogs.current = true;
        await dispatch(fetchDeviceLogs(userId));
      }
    };

    fetchLogs();
  }, [dispatch, userId, deviceLogs]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching logs:", error);
    }
  }, [error]);

  useEffect(() => {
    const logDeviceInformation = async () => {
      const parser = new UAParser();
      const result = parser.getResult();
      
      const os = result.os.name || DEFAULT_DEVICE_INFO.os;
      const osVersion = result.os.version || "Unknown OS Version";
      const browser = result.browser.name || DEFAULT_DEVICE_INFO.browser;
      const device = result.device.type || DEFAULT_DEVICE_INFO.device;
      const deviceVendor = result.device.vendor || "Unknown Vendor";
      const deviceModel = result.device.model || "Unknown Model";

      const lastDeviceInfo = localStorage.getItem("lastDeviceInfo");
      const parsedLastDeviceInfo = lastDeviceInfo ? JSON.parse(lastDeviceInfo) : {};

      const hasDeviceChanged =
        os !== parsedLastDeviceInfo.os ||
        osVersion !== parsedLastDeviceInfo.osVersion ||
        browser !== parsedLastDeviceInfo.browser ||
        device !== parsedLastDeviceInfo.device;

      const hasUserChanged = userId !== parsedLastDeviceInfo.userId;

      if ((hasDeviceChanged || hasUserChanged) && hasLoggedIn) {
        try {
          await dispatch(
            logDeviceInfo({
              userId,
              os,
              osVersion,
              browser,
              device,
              deviceVendor,
              deviceModel,
            })
          );
          localStorage.setItem("lastDeviceInfo", JSON.stringify({ os, osVersion, browser, device, deviceVendor, deviceModel, userId }));
        } catch (err) {
          console.error("Error logging device info:", err);
        }
      }
    };

    if (userId) {
      logDeviceInformation();
      if (!hasLoggedIn) setHasLoggedIn(true);
    }
  }, [dispatch, userId, hasLoggedIn]);

  if (loading) {
    return <p className="text-red-500 font-bold">Loading device logs...</p>;
  }

  return (
    <div className="p-4 bg-zinc-200 dark:bg-zinc-950 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Device Logs for User: {firstName}
      </h2>
      {deviceLogs.length > 0 ? (
        <ul className="space-y-4">
          {deviceLogs.map((log) => (
            <li
              key={log.id}
              className="p-4 bg-zinc-100 dark:bg-zinc-700 border border-zinc-700 dark:border-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Device:</strong> {log.device}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>OS:</strong> {log.os}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Browser:</strong> {log.browser}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>OS Version:</strong> {log.osVersion}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Device Vendor:</strong> {log.deviceVendor}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Device Model:</strong> {log.deviceModel}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No device logs found.</p>
      )}
    </div>
  );
};

export default DeviceLogsComponent;
