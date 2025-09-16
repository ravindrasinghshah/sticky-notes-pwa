import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { InsertBucket } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Gift
} from "lucide-react";

interface BucketManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

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
];

const COLOR_OPTIONS = [
  { value: "primary", label: "Primary", color: "bg-primary" },
  { value: "accent", label: "Accent", color: "bg-accent" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

export default function BucketManager({ isOpen, onClose }: BucketManagerProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("primary");
  const [icon, setIcon] = useState("briefcase");

  // Create bucket mutation
  const createBucketMutation = useMutation({
    mutationFn: async (bucketData: InsertBucket) => {
      const res = await apiRequest("POST", "/api/buckets", bucketData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buckets"] });
      toast({
        title: "Success",
        description: "Bucket created successfully",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
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
            <label className="block text-sm font-medium mb-2">Bucket Name</label>
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
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
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
              {COLOR_OPTIONS.map((colorOption) => (
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
