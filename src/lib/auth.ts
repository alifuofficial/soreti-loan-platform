import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      fullName: string;
      role: Role;
      bankId: string | null;
      phone: string | null;
      image: string | null;
      authProvider: string | null;
    };
  }

  interface User {
    id: string;
    email: string | null;
    fullName: string;
    role: Role;
    bankId: string | null;
    phone: string | null;
    image: string | null;
    authProvider: string | null;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string | null;
    fullName: string;
    role: Role;
    bankId: string | null;
    phone: string | null;
    image: string | null;
    authProvider: string | null;
  }
}

// Get OAuth provider settings from database
async function getOAuthProviders() {
  try {
    const providers = await db.oAuthProvider.findMany({
      where: { isEnabled: true },
    });
    return providers;
  } catch (error) {
    console.error("Failed to fetch OAuth providers:", error);
    return [];
  }
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  // Get enabled OAuth providers from database
  const oauthProviders = await getOAuthProviders();
  const providersMap = new Map(oauthProviders.map(p => [p.name, p]));

  // Build providers list
  const providers: NextAuthOptions["providers"] = [];

  // Google Provider
  const googleProvider = providersMap.get("google");
  const googleClientId = googleProvider?.clientId || process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = googleProvider?.clientSecret || process.env.GOOGLE_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    providers.push(
      GoogleProvider({
        id: "google",
        name: "Google",
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        profile(profile) {
          return {
            id: profile.sub,
            email: profile.email,
            fullName: profile.name || profile.email?.split("@")[0] || "User",
            image: profile.picture,
            role: "CUSTOMER" as Role,
            bankId: null,
            phone: null,
            authProvider: "google",
          };
        },
      })
    );
  }

  // Facebook Provider
  const facebookProvider = providersMap.get("facebook");
  const facebookClientId = facebookProvider?.clientId || process.env.FACEBOOK_CLIENT_ID;
  const facebookClientSecret = facebookProvider?.clientSecret || process.env.FACEBOOK_CLIENT_SECRET;

  if (facebookClientId && facebookClientSecret) {
    providers.push(
      FacebookProvider({
        id: "facebook",
        name: "Facebook",
        clientId: facebookClientId,
        clientSecret: facebookClientSecret,
        profile(profile) {
          return {
            id: profile.id,
            email: profile.email,
            fullName: profile.name || profile.email?.split("@")[0] || "User",
            image: profile.picture?.data?.url,
            role: "CUSTOMER" as Role,
            bankId: null,
            phone: null,
            authProvider: "facebook",
          };
        },
      })
    );
  }

  // Telegram Provider (custom)
  const telegramProvider = providersMap.get("telegram");
  if (telegramProvider?.isEnabled || process.env.TELEGRAM_BOT_TOKEN) {
    providers.push({
      id: "telegram",
      name: "Telegram",
      type: "oauth",
      version: "2.0",
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://oauth.telegram.org/token",
      authorizationUrl: "https://oauth.telegram.org/authorize",
      profileUrl: "https://api.telegram.org/bot" + (telegramProvider?.botToken || process.env.TELEGRAM_BOT_TOKEN) + "/getMe",
      clientId: telegramProvider?.clientId || process.env.TELEGRAM_CLIENT_ID,
      clientSecret: telegramProvider?.clientSecret || process.env.TELEGRAM_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.id?.toString() || profile.result?.id?.toString(),
          email: null,
          fullName: profile.first_name || profile.result?.first_name || "Telegram User",
          image: profile.photo_url || null,
          role: "CUSTOMER" as Role,
          bankId: null,
          phone: null,
          authProvider: "telegram",
        };
      },
    } as any);
  }

  // Credentials Provider (always available)
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated. Please contact support.");
        }

        if (!user.password) {
          throw new Error("This account uses social login. Please sign in with your social provider.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Update lastLoginAt
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          bankId: user.bankId,
          phone: user.phone,
          image: user.image,
          authProvider: "credentials",
        };
      },
    })
  );

  return {
    providers,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
      signIn: "/",
      error: "/",
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // For credentials provider, just return true
        if (account?.provider === "credentials") {
          return true;
        }

        // For OAuth providers, create or update user
        if (account?.provider && user.email) {
          try {
            // Check if user exists
            const existingUser = await db.user.findUnique({
              where: { email: user.email },
              include: { accounts: true },
            });

            if (existingUser) {
              // Update last login
              await db.user.update({
                where: { id: existingUser.id },
                data: {
                  lastLoginAt: new Date(),
                  image: user.image || existingUser.image,
                },
              });

              // Create account link if not exists
              const existingAccount = await db.account.findFirst({
                where: {
                  userId: existingUser.id,
                  provider: account.provider,
                },
              });

              if (!existingAccount) {
                await db.account.create({
                  data: {
                    userId: existingUser.id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId || user.id,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
                    tokenType: account.token_type,
                    scope: account.scope,
                  },
                });
              } else {
                // Update tokens
                await db.account.update({
                  where: { id: existingAccount.id },
                  data: {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
                  },
                });
              }

              // Update user object with database values
              user.id = existingUser.id;
              user.role = existingUser.role;
              user.bankId = existingUser.bankId;
              user.phone = existingUser.phone;
              user.fullName = existingUser.fullName;

              return true;
            }

            // Create new user for OAuth
            const newUser = await db.user.create({
              data: {
                email: user.email,
                fullName: user.fullName || user.email.split("@")[0],
                image: user.image,
                role: "CUSTOMER",
                isActive: true,
                authProvider: account.provider,
                providerId: account.providerAccountId || user.id,
                emailVerified: new Date(),
                firstVisitAt: new Date(),
              },
            });

            // Create account link
            await db.account.create({
              data: {
                userId: newUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId || user.id,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
                tokenType: account.token_type,
                scope: account.scope,
              },
            });

            user.id = newUser.id;
            user.role = newUser.role;
            user.bankId = null;
            user.phone = null;

            return true;
          } catch (error) {
            console.error("Error in signIn callback:", error);
            return false;
          }
        }

        // Handle users without email (Telegram)
        if (account?.provider === "telegram" && user.id) {
          try {
            // Check by provider ID
            const existingUser = await db.user.findFirst({
              where: {
                authProvider: "telegram",
                providerId: user.id.toString(),
              },
            });

            if (existingUser) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { lastLoginAt: new Date() },
              });
              user.email = existingUser.email;
              user.fullName = existingUser.fullName;
              user.role = existingUser.role;
              return true;
            }

            // Create new telegram user
            const newUser = await db.user.create({
              data: {
                fullName: user.fullName || "Telegram User",
                image: user.image,
                role: "CUSTOMER",
                isActive: true,
                authProvider: "telegram",
                providerId: user.id.toString(),
                firstVisitAt: new Date(),
              },
            });

            user.id = newUser.id;
            user.email = null;
            user.role = newUser.role;
            return true;
          } catch (error) {
            console.error("Error creating Telegram user:", error);
            return false;
          }
        }

        return true;
      },
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.fullName = user.fullName;
          token.role = user.role;
          token.bankId = user.bankId;
          token.phone = user.phone;
          token.image = user.image;
          token.authProvider = user.authProvider;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = {
            id: token.id,
            email: token.email,
            fullName: token.fullName,
            role: token.role,
            bankId: token.bankId,
            phone: token.phone,
            image: token.image,
            authProvider: token.authProvider,
          };
        }
        return session;
      },
    },
    events: {
      async signIn({ user }) {
        console.log(`User signed in: ${user.email || user.id} at ${new Date().toISOString()}`);
      },
      async signOut({ token }) {
        console.log(`User signed out: ${token?.email} at ${new Date().toISOString()}`);
      },
    },
    debug: process.env.NODE_ENV === "development",
  };
}

// Default auth options for route handler
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated. Please contact support.");
        }

        if (!user.password) {
          throw new Error("This account uses social login. Please sign in with your social provider.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          bankId: user.bankId,
          phone: user.phone,
          image: user.image,
          authProvider: "credentials",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
        token.bankId = user.bankId;
        token.phone = user.phone;
        token.image = user.image;
        token.authProvider = user.authProvider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          fullName: token.fullName,
          role: token.role,
          bankId: token.bankId,
          phone: token.phone,
          image: token.image,
          authProvider: token.authProvider,
        };
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email} at ${new Date().toISOString()}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email} at ${new Date().toISOString()}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper function to check if user has required role
export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

// Role hierarchy for permission checks
export const roleHierarchy: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  CEO: 85,
  GENERAL_MANAGER: 80,
  FINANCE_MANAGER: 70,
  MARKETING_MANAGER: 70,
  BANKER: 60,
  SELLER: 50,
  CUSTOMER: 10,
};

// Check if user role is at least a certain level
export function hasRoleLevel(userRole: Role, minimumRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}
