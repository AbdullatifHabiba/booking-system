// app/utils/tokenStore.ts
import prisma from './database';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Save tokens to the database
async function saveTokens(userId: number, tokens: Tokens): Promise<void> {
  await prisma.token.upsert({
    where: { userId: userId },
    update: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      updatedAt: new Date(),
    },
    create: {
      userId: userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
}

// Retrieve tokens from the database
async function getTokens(userId: number): Promise<Tokens | null> {

console.log("userId", userId)
  const token = await prisma.token.findUnique({
    where: { userId: userId },
  });
  if (token) {
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }
  return null;
}

// Get stored refresh token
async function getStoredRefreshToken(userId: number): Promise<string | null> {
  const tokens = await getTokens(userId);
  return tokens?.refreshToken || null;
}

export { saveTokens, getTokens, getStoredRefreshToken };
