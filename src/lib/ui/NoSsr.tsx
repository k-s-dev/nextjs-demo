"use client";

import dynamic from "next/dynamic";

// uses random key for form id
export const PriorityListNoSsr = dynamic(
  () => import("@/lib/features/org/tasks/features/workspace/features/priority/List"),
  {
    ssr: false,
  },
);

// uses random key for form id
export const StatusListNoSsr = dynamic(
  () => import("@/lib/features/org/tasks/features/workspace/features/status/List"),
  {
    ssr: false,
  },
);
