import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/data";
import type { Note, BucketWithCount, InsertNote } from "@/data/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Type, Palette, Pin, PinOff } from "lucide-react";

interface NoteEditorProps {
  note?: Note | null;
  buckets: BucketWithCount[];
  selectedBucketId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Open Sans", label: "Open Sans" },
];

const COLOR_OPTIONS = [
  { value: "accent", label: "Default", color: "bg-accent" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-200" },
  { value: "blue", label: "Blue", color: "bg-blue-200" },
  { value: "green", label: "Green", color: "bg-green-200" },
  { value: "pink", label: "Pink", color: "bg-pink-200" },
  { value: "purple", label: "Purple", color: "bg-purple-200" },
  { value: "orange", label: "Orange", color: "bg-orange-200" },
];

export default function NoteEditor({ note, buckets, selectedBucketId, isOpen, onClose }: NoteEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("accent");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [pinned, setPinned] = useState(false);
  const [primaryBucketId, setPrimaryBucketId] = useState(selectedBucketId);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);

  const isEditing = !!note;

  // Initialize form data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setFontFamily(note.fontFamily);
      setPinned(note.pinned);
      setPrimaryBucketId(note.primaryBucketId);
      // TODO: Load shared buckets for this note
      setSelectedBuckets([]);
    } else {
      setTitle("");
      setContent("");
      setColor("accent");
      setFontFamily("Inter");
      setPinned(false);
      setPrimaryBucketId(selectedBucketId);
      setSelectedBuckets([]);
    }
  }, [note, selectedBucketId]);

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: InsertNote & { bucketIds: string[] }) => {
      return await storage.createNote(noteData, noteData.bucketIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["notes", selectedBucketId] });
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: Partial<InsertNote> & { bucketIds: string[] }) => {
      return await storage.updateNote(note!.id, noteData, noteData.bucketIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["notes", selectedBucketId] });
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      color,
      fontFamily,
      pinned,
      primaryBucketId,
      bucketIds: [primaryBucketId, ...selectedBuckets],
    };

    if (isEditing) {
      updateNoteMutation.mutate(noteData);
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  const toggleBucket = (bucketId: string) => {
    if (bucketId === primaryBucketId) return; // Can't unselect primary bucket
    
    setSelectedBuckets(prev => 
      prev.includes(bucketId) 
        ? prev.filter(id => id !== bucketId)
        : [...prev, bucketId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-note-editor">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-note-title"
                required
              />
            </div>

            {/* Primary Bucket */}
            <div>
              <label className="block text-sm font-medium mb-2">Primary Bucket</label>
              <Select value={primaryBucketId} onValueChange={setPrimaryBucketId}>
                <SelectTrigger data-testid="select-primary-bucket">
                  <SelectValue placeholder="Select primary bucket" />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formatting Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Type className="w-4 h-4 inline mr-1" />
                  Font
                </label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger data-testid="select-font-family">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Color
                </label>
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Pin className="w-4 h-4 inline mr-1" />
                  Pin Note
                </label>
                <Button
                  type="button"
                  variant={pinned ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPinned(!pinned)}
                  className="w-full justify-start"
                  data-testid="button-toggle-pin"
                >
                  {pinned ? (
                    <>
                      <PinOff className="w-4 h-4 mr-2" />
                      Unpin Note
                    </>
                  ) : (
                    <>
                      <Pin className="w-4 h-4 mr-2" />
                      Pin Note
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
                style={{ fontFamily }}
                data-testid="textarea-note-content"
                required
              />
            </div>

            {/* Additional Buckets */}
            <div>
              <label className="block text-sm font-medium mb-2">Share with Additional Buckets</label>
              <div className="flex flex-wrap gap-2">
                {buckets
                  .filter(bucket => bucket.id !== primaryBucketId)
                  .map((bucket) => (
                    <Badge
                      key={bucket.id}
                      variant={selectedBuckets.includes(bucket.id) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleBucket(bucket.id)}
                      data-testid={`badge-bucket-${bucket.id}`}
                    >
                      {bucket.name}
                      {selectedBuckets.includes(bucket.id) ? " ✓" : " +"}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {isEditing && note?.updatedAt && (
                <span>Last edited: {new Date(note.updatedAt).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel-note"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                data-testid="button-save-note"
              >
                {createNoteMutation.isPending || updateNoteMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Note"
                  : "Create Note"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
