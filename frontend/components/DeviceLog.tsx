"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceLogs,
  logDeviceInfo,
  setDeviceLogs,
} from "../store/deviceLogSlice";
import { AppDispatch, RootState } from "@/store/store";
import UAParser from "ua-parser-js";

interface DeviceLog {
  id: string;
  userId: string;
  os: string;
  browser: string;
  device: string;
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
      const storedLogs = localStorage.getItem("deviceLogs");
      const parsedLogs: DeviceLog[] = storedLogs ? JSON.parse(storedLogs) : [];

      if (
        !hasFetchedLogs.current &&
        deviceLogs.length === 0 &&
        parsedLogs.length === 0
      ) {
        hasFetchedLogs.current = true;
        const fetchedLogs = await dispatch(fetchDeviceLogs(userId));
        if (fetchedLogs.payload) {
          localStorage.setItem(
            "deviceLogs",
            JSON.stringify(fetchedLogs.payload)
          );
        }
      } else {
        const uniqueLogs = parsedLogs.filter(
          (log) => !deviceLogs.some((existingLog) => existingLog.id === log.id)
        );
        if (uniqueLogs.length > 0) {
          dispatch(setDeviceLogs([...deviceLogs, ...uniqueLogs]));
        }
      }
    };

    fetchLogs();
  }, [dispatch, userId, deviceLogs]);

  useEffect(() => {
    const logDeviceInformation = async () => {
      const parser = new UAParser();
      const userAgent = navigator.userAgent;
      console.log("User Agent: ", userAgent);

      // Get detailed results from UAParser
      const result = parser.getResult();

      // Destructure and capture detailed device information
      const os = result.os.name || DEFAULT_DEVICE_INFO.os; // OS name
      const osVersion = result.os.version || "Unknown OS Version"; // OS version
      const browser = result.browser.name || DEFAULT_DEVICE_INFO.browser; // Browser name
      const browserVersion =
        result.browser.version || "Unknown Browser Version"; // Browser version
      const device = result.device.type || DEFAULT_DEVICE_INFO.device; // Device type (mobile, tablet, desktop)
      const deviceVendor = result.device.vendor || "Unknown Vendor"; // Device vendor (Apple, Samsung, etc.)
      const deviceModel = result.device.model || "Unknown Model"; // Device model (iPhone, Galaxy S21, etc.)

      // Log all extracted information
      console.log("Device Information: ", {
        os,
        osVersion,
        browser,
        browserVersion,
        device,
        deviceVendor,
        deviceModel,
      });

      const lastDeviceInfo = localStorage.getItem("lastDeviceInfo");
      const parsedLastDeviceInfo: {
        os?: string;
        osVersion?: string;
        browser?: string;
        browserVersion?: string;
        device?: string;
        deviceVendor?: string;
        deviceModel?: string;
        userId?: string;
      } = lastDeviceInfo ? JSON.parse(lastDeviceInfo) : {};

      // Check for changes in device information
      const hasDeviceChanged =
        os !== parsedLastDeviceInfo.os ||
        osVersion !== parsedLastDeviceInfo.osVersion ||
        browser !== parsedLastDeviceInfo.browser ||
        browserVersion !== parsedLastDeviceInfo.browserVersion ||
        device !== parsedLastDeviceInfo.device ||
        deviceVendor !== parsedLastDeviceInfo.deviceVendor ||
        deviceModel !== parsedLastDeviceInfo.deviceModel;

      // Check if userId has changed
      const hasUserChanged = userId !== parsedLastDeviceInfo.userId;

      // If device or user information has changed and the user is logged in, log the new information
      if ((hasDeviceChanged || hasUserChanged) && hasLoggedIn) {
        await dispatch(
          logDeviceInfo({
            userId,
            os,
            osVersion,
            browser,
            browserVersion,
            device,
            deviceVendor,
            deviceModel,
          })
        );
        localStorage.setItem(
          "lastDeviceInfo",
          JSON.stringify({
            os,
            osVersion,
            browser,
            browserVersion,
            device,
            deviceVendor,
            deviceModel,
            userId,
          })
        );
      }
    };

    if (userId) {
      logDeviceInformation();
      setHasLoggedIn(true); // Set logged-in state
    }
  }, [dispatch, userId, hasLoggedIn]);

  if (loading) {
    return <p className="text-red-500 font-bold">Loading device logs...</p>;
  }

  if (error) {
    return <p className="text-red-500 font-bold">Error: {error}</p>;
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
                <strong>Device Version:</strong> {log.deviceVendor}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Device Model:</strong> {log.deviceModel}
              </div>
              <div className="text-zinc-800 dark:text-zinc-200">
                <strong>Timestamp:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
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
