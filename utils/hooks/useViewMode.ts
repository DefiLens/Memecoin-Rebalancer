import { useState, useEffect } from 'react';

export const useViewMode = () => {
    // Start with a default value
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // First useEffect to handle initial localStorage read
    useEffect(() => {
        const savedMode = localStorage.getItem("viewMode") as "list" | "grid";
        if (savedMode) {
            setViewMode(savedMode);
        }
    }, []);

    // Second useEffect to handle localStorage writes
    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    // Return both the state and the loaded flag
    return {
        viewMode,
        setViewMode,
    };
};