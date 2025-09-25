import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { storage } from "@/data";
import type { BucketWithCount } from "@/data/schema";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteBucketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bucket: BucketWithCount | null;
  onBucketDeleted?: () => void;
}

export default function DeleteBucketDialog({ 
  isOpen, 
  onClose, 
  bucket, 
  onBucketDeleted 
}: DeleteBucketDialogProps) {
  const { toast } = useToast();
  const [{ user }] = useStateValue();
  const queryClient = useQueryClient();

  // Delete bucket mutation
  const deleteBucketMutation = useMutation({
    mutationFn: async (bucketId: string) => {
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }
      return await storage.deleteBucket(bucketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Success",
        description: "Bucket deleted successfully",
      });
      onBucketDeleted?.();
      onClose();
    },
    onError: (error) => {
      console.error("Error deleting bucket:", error);
      toast({
        title: "Error",
        description: "Failed to delete bucket",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (bucket) {
      deleteBucketMutation.mutate(bucket.id);
    }
  };

  if (!bucket) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Delete Bucket</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the bucket <strong>"{bucket.name}"</strong>?
            </p>
            {bucket.noteCount > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ This bucket contains {bucket.noteCount} note{bucket.noteCount === 1 ? '' : 's'}.
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  All notes in this bucket will be permanently deleted and cannot be recovered.
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBucketMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBucketMutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            data-testid="button-confirm-delete-bucket"
          >
            {deleteBucketMutation.isPending ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Bucket
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
