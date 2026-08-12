import { cache } from "react";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import type { User } from "@/generated/prisma/client";

export const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const DEMO_USER = {
  id: "demo-user",
  email: "demo@linger.app",
  name: "Demo Reader",
};

/**
 * Clerk owns identity; Linger owns reading data. This upserts our User row
 * from the signed-in Clerk identity (or a fixed demo user when no Clerk
 * keys are configured, so the app is fully click-through testable without
 * live credentials). Memoized per request with React's cache().
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!clerkConfigured) {
    return db.user.upsert({
      where: { id: DEMO_USER.id },
      update: {},
      create: DEMO_USER,
    });
  }

  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? `${user.id}@clerk.local`;
  const name = user.fullName ?? undefined;
  const avatarUrl = user.imageUrl ?? undefined;

  return db.user.upsert({
    where: { id: user.id },
    update: { email, name, avatarUrl },
    create: { id: user.id, email, name, avatarUrl },
  });
});
