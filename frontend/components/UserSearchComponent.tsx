"use client";

import React, { useState } from "react";
import axios from "axios";

interface UserSearchComponentProps {
  onUserIdFetched: (userId: string) => void;
}

const UserSearchComponent: React.FC<UserSearchComponentProps> = ({ onUserIdFetched }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      let response;

      // Check if the search term is an email or username
      if (searchTerm.includes("@")) {
        response = await axios.get<string>(`http://192.168.29.159:8081/api/v1/users/email/${searchTerm}`);
      } else {
        response = await axios.get<string>(`http://192.168.29.159:8081/api/v1/users/username/${searchTerm}`);
      }

      // Parse the response to extract the user ID
      const userId = response.data.split(":")[1]; // Assuming the format is "id:some-id"
      if (userId) {
        onUserIdFetched(userId);
      } else {
        throw new Error("User ID not found in response");
      }
      setSearchTerm(""); // Clear the search term
    } catch (err) {
      setError("User not found. Please check the email or username.");
      setSearchTerm(""); // Clear the search term
      console.error(err);
    }
  };

  return (
    <div className="mb-6 p-4 bg-zinc-800 rounded-md shadow-md">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Enter user email or username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="grow border border-zinc-400 rounded-l-md p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-md p-2 transition duration-300"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default UserSearchComponent;
