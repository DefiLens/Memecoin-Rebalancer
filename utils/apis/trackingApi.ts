import axios from "axios";
import axiosInstance from "../axiosInstance";

// Login API
export const handleLogin = async (
    userAddress: string,
) => {
    try {
        // Check if the user is already logged in
        const existingUserResponse = await axiosInstance.get(`/auth/login/${userAddress}`);
        if (existingUserResponse.status === 200) {
            // User is already registered, do not proceed witxh login
            return;
        }

        // Proceed with login
        const requestBody = {
            userAddress: userAddress,
        };

        const response = await axiosInstance.post("/auth/login", requestBody);

        // Check if the login was successful
        if (response.status === 200) {
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
