import axios from "../api/axios";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux"; // Added Redux hook

export function useLocationEngine() {
    const [locationData, setLocationData] = useState(() => {
        const cached = localStorage.getItem("user_location");
        return cached ? JSON.parse(cached) : null;
    });
    const [permissionStatus, setPermissionStatus] = useState("prompt");
    const [isLoading, setIsLoading] = useState(false);

    // Grab the real token from your Redux Auth State
    const { accessToken } = useSelector((state) => state.auth);

    const updateLocalState = (state, district) => {
        const updatedData = { state, district, timestamp: Date.now() };
        setLocationData(updatedData);
        localStorage.setItem("user_location", JSON.stringify(updatedData));
    };

    const syncWithBackend = async (lat, lon, rawState, rawDistrict, force = false) => {
        try {
            // Prevent attempting to save to DB if user is a guest (not logged in)
            if (!accessToken) {
                console.warn("User not logged in. Location displayed locally but not saved to DB.");
                return;
            }

            const response = await axios.post("/user/location", {
                latitude: lat,
                longitude: lon,
                rawState: rawState || "",
                rawDistrict: rawDistrict || "",
                forceUpdate: force
            }, {
                // Explicitly attach the Redux token!
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data && response.data.state) {
                updateLocalState(response.data.state, response.data.district);
            }
        } catch (err) {
            console.warn("Backend sync failed. Server responded with:", err.response?.status || err.message);
        }
    };

    const fetchLocation = useCallback(async (isManualTrigger = false) => {
        if (!isManualTrigger) {
            const cached = localStorage.getItem("user_location");
            if (cached) {
                const parsed = JSON.parse(cached);
                const isPast24Hours = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;

                if (!isPast24Hours) {
                    setPermissionStatus("granted");
                    setLocationData(parsed);
                    return;
                }
            }
        }

        if (!navigator.geolocation) return;
        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setPermissionStatus("granted");

                try {
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
                    );
                    const geoData = await geoRes.json();
                    const address = geoData.address || {};

                    const rawState = address.state || address.region || "Unknown State";
                    const rawDistrict = address.state_district || address.district || address.county || address.city || "Unknown District";

                    updateLocalState(rawState, rawDistrict);

                    // Passing the exact text components extracted from OpenStreetMap
                    await syncWithBackend(latitude, longitude, rawState, rawDistrict, isManualTrigger);
                } catch (err) {
                    updateLocalState("Unknown State", "Unknown District");
                    await syncWithBackend(latitude, longitude, "", "", isManualTrigger);
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                setIsLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setPermissionStatus("denied");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        // Include accessToken in dependency array so it updates if they log in
    }, [accessToken]);

    useEffect(() => {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: "geolocation" }).then((status) => {
                setPermissionStatus(status.state);

                if (status.state === "granted") {
                    fetchLocation(false);
                }

                status.onchange = () => {
                    setPermissionStatus(status.state);
                    if (status.state === "granted") {
                        fetchLocation(true);
                    }
                };
            });
        } else {
            fetchLocation(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { locationData, permissionStatus, isLoading, fetchLocation };
}