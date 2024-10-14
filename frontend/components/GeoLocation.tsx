"use client";

import React, { useState } from "react";

export default function TestGeolocation() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  } | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          await fetchLocationDetails(latitude, longitude, newLocation);
        },
        (error) => {
          console.error("Error getting user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  const fetchLocationDetails = async (latitude: number, longitude: number, newLocation: { latitude: number; longitude: number }) => {
    const apiKey = process.env.OPENCAGE_API_KEY; // Accessing the API key from the .env file
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { components } = data.results[0];

      setUserLocation({
        ...newLocation,
        city: components.city || components.locality || components.town,
        country: components.country,
      });
    }
  };

  return (
    <>
      <h1>Geolocation App</h1>
      <button onClick={getUserLocation}>Get User Location</button>
      {userLocation && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
          {userLocation.city && <p>City: {userLocation.city}</p>}
          {userLocation.country && <p>Country: {userLocation.country}</p>}
        </div>
      )}
    </>
  );
}
