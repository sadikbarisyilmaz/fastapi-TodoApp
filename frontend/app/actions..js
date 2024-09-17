"use server"

const API_URL = "http://127.0.0.1:8000";

export const healtCheck = async () => {
    try {
        const response = await fetch(`${API_URL}/healthy`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json.status
    } catch (error) {
        console.error(error.message);
    }
}