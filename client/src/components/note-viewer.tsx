import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pin, PinOff } from "lucide-react";
import { getBucketIcon, getBucketIconColorClass } from "@/lib/bucket-utils";
import { getTagDefinitions } from "@/lib/tags";
import { convertTextToLinks } from "@/lib/linkUtils";
import type { NoteWithBuckets } from "@/data/schema";

interface NoteViewerProps {
  note: NoteWithBuckets | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePin?: (noteId: string, pinned: boolean) => void;
}

export default function NoteViewer({
  note,
  isOpen,
  onClose,
  onTogglePin,
}: NoteViewerProps) {
  if (!note) return null;

  const tagDefinitions = getTagDefinitions(note.tags || []);
  const primaryBucket = note.sharedBuckets[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold pr-4">
                {note.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleDateString()
                    : "No date"}
                </span>
                {primaryBucket && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const IconComponent = getBucketIcon(primaryBucket.icon);
                        return (
                          <IconComponent
                            className={`h-4 w-4 ${getBucketIconColorClass(
                              primaryBucket.color
                            )}`}
                          />
                        );
                      })()}
                      <span>{primaryBucket.name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {onTogglePin && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePin(note.id, !note.pinned)}
                  className="h-8 w-8 p-0"
                >
                  {note.pinned ? (
                    <Pin className="h-4 w-4" />
                  ) : (
                    <PinOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Content */}
          <div>
            <h4 className="text-sm font-medium mb-2">Content</h4>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              style={{
                fontFamily: note.fontFamily || "inherit",
                color: note.color || "inherit",
              }}
            >
              <div className="whitespace-pre-wrap break-words">
                {convertTextToLinks(note.content)}
              </div>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {tagDefinitions.map((tag) => {
                  const IconComponent = tag.icon;
                  return (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                      title={tag.label}
                    >
                      <div style={{ color: tag.color }}>
                        <IconComponent className="h-3 w-3" />
                      </div>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shared Buckets */}
          {note.sharedBuckets.length > 1 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Also in</h4>
              <div className="flex flex-wrap gap-2">
                {note.sharedBuckets.slice(1).map((bucket) => {
                  const IconComponent = getBucketIcon(bucket.icon);
                  return (
                    <div
                      key={bucket.id}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                    >
                      <IconComponent
                        className={`h-3 w-3 ${getBucketIconColorClass(
                          bucket.color
                        )}`}
                      />
                      <span>{bucket.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
