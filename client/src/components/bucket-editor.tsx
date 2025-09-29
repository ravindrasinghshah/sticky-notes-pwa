import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { storage } from "@/data";
import type { BucketWithCount } from "@/data/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Briefcase,
  Home,
  Lightbulb,
  ShoppingCart,
  Star,
  Heart,
  Book,
  Coffee,
  Camera,
  Music,
  MapPin,
  Gift,
  Folder,
  Archive,
  Bookmark,
  Tag,
  Flag,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "briefcase", label: "Briefcase", icon: Briefcase },
  { value: "home", label: "Home", icon: Home },
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "shopping-cart", label: "Shopping Cart", icon: ShoppingCart },
  { value: "star", label: "Star", icon: Star },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "book", label: "Book", icon: Book },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "camera", label: "Camera", icon: Camera },
  { value: "music", label: "Music", icon: Music },
  { value: "map-pin", label: "Location", icon: MapPin },
  { value: "gift", label: "Gift", icon: Gift },
  { value: "folder", label: "Folder", icon: Folder },
  { value: "archive", label: "Archive", icon: Archive },
  { value: "bookmark", label: "Bookmark", icon: Bookmark },
  { value: "tag", label: "Tag", icon: Tag },
  { value: "flag", label: "Flag", icon: Flag },
];

const COLOR_OPTIONS = [
  { value: "primary", label: "Primary", color: "bg-primary" },
  { value: "secondary", label: "Secondary", color: "bg-secondary" },
  { value: "accent", label: "Accent", color: "bg-accent" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

interface BucketEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bucket: BucketWithCount | null;
}

export default function BucketEditor({ isOpen, onClose, bucket }: BucketEditorProps) {
  const { toast } = useToast();
  const [{ user }] = useStateValue();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("primary");
  const [icon, setIcon] = useState("briefcase");

  // Initialize form with bucket data
  useEffect(() => {
    if (bucket) {
      setName(bucket.name);
      setDescription(bucket.description || "");
      setColor(bucket.color);
      setIcon(bucket.icon);
    }
  }, [bucket]);

  // Update bucket mutation
  const updateBucketMutation = useMutation({
    mutationFn: async (bucketData: { name: string; description?: string | null; color: string; icon: string }) => {
      if (!bucket || !user?.uid) {
        throw new Error("Missing bucket or user data");
      }
      return await storage.updateBucket(bucket.id, bucketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      toast({
        title: "Success",
        description: "Bucket updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating bucket:", error);
      toast({
        title: "Error",
        description: "Failed to update bucket",
        variant: "destructive",
      });
    },
  });

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

    updateBucketMutation.mutate({
      name: name.trim(),
      description: description.trim() || null,
      color,
      icon,
    });
  };

  const handleClose = () => {
    onClose();
  };

  if (!bucket) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bucket</DialogTitle>
          <DialogDescription>
            Update the bucket name, description, color, and icon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bucket name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter bucket description (optional)"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateBucketMutation.isPending}>
              {updateBucketMutation.isPending ? "Updating..." : "Update Bucket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
