"use server"

import { auth, signOut } from "@/auth";
const API_URL = "http://127.0.0.1:8000";

const checkAccessToken = async (accessToken) => {
    const tokenExpt = new Date(accessToken.expires_at)
    if (tokenExpt < new Date) {
        console.log("expired");
        await signOut()

        return session
    }
}

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

export const getUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/auth`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json.status
    } catch (error) {
        console.error(error.message);
    }
}

export const readAll = async () => {
    const session = await auth();
    const tokenExpt = new Date(session.accessToken.expires_at)
    if (tokenExpt < new Date) {
        console.log("expiredddddddddddddddddddddddd");
        await signOut()
        return
    } else {
        try {
            const response = await fetch(`${API_URL}/admin`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken.access_token}`
                },
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            return json
        } catch (error) {
            console.error(error.message);
        }
    }
}
export const dbLogin = async (username, password) => {
    const payload = new URLSearchParams();
    payload.append("username", username);
    payload.append("password", password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json
    } catch (error) {
        console.error(error.message);
    }
}
export const token = async (username, password) => {
    const payload = new URLSearchParams();
    payload.append("username", username);
    payload.append("password", password);
    try {
        const response = await fetch(`${API_URL}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json
    } catch (error) {
        console.error(error.message);
    }
}