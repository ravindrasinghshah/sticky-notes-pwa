import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { storage } from "@/data";
import type { InsertBucket } from "@/data/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_OPTIONS, BUCKET_COLOR_OPTIONS } from "@/lib/bucket-utils";

interface BucketManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BucketManager({ isOpen, onClose }: BucketManagerProps) {
  const { toast } = useToast();
  const [{ user }] = useStateValue();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("primary");
  const [icon, setIcon] = useState("briefcase");

  // Create bucket mutation
  const createBucketMutation = useMutation({
    mutationFn: async (bucketData: InsertBucket) => {
      return await storage.createBucket(bucketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      toast({
        title: "Success",
        description: "Bucket created successfully",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating bucket:", error);
      toast({
        title: "Error",
        description: "Failed to create bucket",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("primary");
    setIcon("briefcase");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Bucket name is required",
        variant: "destructive",
      });
      return;
    }

    createBucketMutation.mutate({
      name: name.trim(),
      description: description.trim() || null,
      color,
      icon,
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="dialog-bucket-manager">
        <DialogHeader>
          <DialogTitle>Create New Bucket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Bucket Name
            </label>
            <Input
              type="text"
              placeholder="Enter bucket name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-bucket-name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
              data-testid="textarea-bucket-description"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((iconOption) => {
                const IconComponent = iconOption.icon;
                return (
                  <button
                    key={iconOption.value}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 hover:bg-accent transition-colors flex items-center justify-center ${
                      icon === iconOption.value
                        ? "border-ring bg-accent"
                        : "border-border"
                    }`}
                    onClick={() => setIcon(iconOption.value)}
                    title={iconOption.label}
                    data-testid={`button-icon-${iconOption.value}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {BUCKET_COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                    colorOption.color
                  } ${
                    color === colorOption.value
                      ? "border-ring shadow-md"
                      : "border-border"
                  }`}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.label}
                  data-testid={`button-color-${colorOption.value}`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="button-cancel-bucket"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBucketMutation.isPending}
              data-testid="button-create-bucket"
            >
              {createBucketMutation.isPending ? "Creating..." : "Create Bucket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
