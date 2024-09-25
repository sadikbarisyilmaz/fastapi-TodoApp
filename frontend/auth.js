import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { dbLogin, token } from "./app/actions."
import { authConfig } from "./auth.config.ts";
// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password"

const baseConfig = {
    ...authConfig,

    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null
                // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)

                // logic to verify if the user exists
                user = await dbLogin(credentials.username, credentials.password)
                const accessToken = await token(credentials.username, credentials.password)
                user.accessToken = accessToken
                // console.log("AUTHORIZE:", accessToken);

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // meaning this is also the place you could do registration
                    throw new Error("User not found.")
                }
                // console.log("log userrrrrrrrrrr:", user);

                // return user object with their profile data
                return user
            },
        }),
    ],
    callbacks: {
        jwt({ token, user, account }) {
            if (user) { // User is available during sign-in
                token.id = user.id
                token.role = user.role
                token.username = user.username
                token.accessToken = user.accessToken
            }

            return token
        },


    },
};

const serverConfig = {
    ...baseConfig,
    callbacks: {
        ...baseConfig.callbacks,
        session({ session, token }) {
            session.user.id = token.id
            session.user.role = token.role
            session.accessToken = token.accessToken
            session.user.username = token.username
            // session.expires = token.accessToken.expires_at
            return session
            // }

        },
    },
};

export const { handlers, signIn, signOut } = NextAuth(baseConfig)
export const { auth } = NextAuth(serverConfig)