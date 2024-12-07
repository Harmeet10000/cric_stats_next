// src/lib/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const register = async (
  email: string,
  password: string,
  name: string
) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    name,
    role: "audience", // default role
  });

  if (response.data) {
    // Optionally handle token storage or authentication context here
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};


export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const adminUser = response.data;

    // Store the user in local storage
    localStorage.setItem("user", JSON.stringify(adminUser));

    return adminUser;
  } catch (error) {
    console.log("Login failed", API_URL, email, password);
    throw new Error("Login failed");
  }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile");
  }
};

export const createMatch = async (matchData: {
  country1: string;
  country2: string;
  overs: number;
  title: string;
  players1: string[];
  players2: string[];
  matchDate: string;
  matchTime: string;
}) => {
  const response = await axios.post(`${API_URL}/matches/create`, matchData);
  return response.data;
};


