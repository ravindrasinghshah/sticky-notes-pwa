import { ReactNode } from "react";
import AuthGuard from "@/security/AuthGuard";
import AuthLayout from "@/components/auth-layout";

import type { NoteWithBuckets } from "@/data/schema";

interface LayoutWrapperProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string, bucketId?: string) => void;
  currentBucketId?: string;
  notes?: NoteWithBuckets[];
}

/**
 * LayoutWrapper combines AuthGuard and AuthLayout for protected pages
 * This eliminates code repetition and provides a consistent layout for all protected routes
 */
export default function LayoutWrapper({
  children,
  showSearch = false,
  onSearch,
  currentBucketId,
  notes,
}: LayoutWrapperProps) {
  return (
    <AuthGuard>
      <AuthLayout
        showSearch={showSearch}
        onSearch={onSearch}
        currentBucketId={currentBucketId}
        notes={notes}
      >
        {children}
      </AuthLayout>
    </AuthGuard>
  );
}
