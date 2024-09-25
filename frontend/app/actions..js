"use server"

import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

// /admin
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
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
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

// /auth
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

// /users
export const getUser = async () => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/users`, {
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
export const changePhoneNumber = async (num) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/users/phone/${num}`, {
                method: "PUT",
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
    revalidatePath("/dashboard")

}
export const changePassword = async (values) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${session.accessToken.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
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

// /todo
export const getTodos = async () => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/todo`, {
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
    revalidatePath("/dashboard")
}
export const getTodo = async (id) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/todo/${id}`, {
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
    revalidatePath("/dashboard")
}
export const deleteTodos = async (id) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/todo/${id}`, {
                method: "DELETE",
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
    revalidatePath("/dashboard")
}
export const createTodo = async (values) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        try {
            const response = await fetch(`${API_URL}/todo`, {
                method: "Post",
                headers: {
                    'Authorization': `Bearer ${session.accessToken.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            revalidatePath("/dashboard")

            return json
        } catch (error) {
            console.error(error.message);
        }
    }
}
export const updateTodo = async (values) => {
    const session = await auth();
    if (new Date(session.accessToken.expires_at) < new Date()) {
        redirect(`/login`)
    } else {
        console.log(",AAAAAAAAAAAAAAA");

        try {
            const response = await fetch(`${API_URL}/todo/${values.id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${session.accessToken.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
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
    revalidatePath(`/dashboard/${values.id}`)
}