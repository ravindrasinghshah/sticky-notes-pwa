import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/data";
import type { Note, BucketWithCount, InsertNote } from "@/data/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { X, Type, Palette, Pin, PinOff, Tag, ChevronDown, Check } from "lucide-react";
import { TAG_DEFINITIONS, getTagDefinitions } from "@/lib/tags";

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

export default function NoteEditor({
  note,
  buckets,
  selectedBucketId,
  isOpen,
  onClose,
}: NoteEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("accent");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [pinned, setPinned] = useState(false);
  const [primaryBucketId, setPrimaryBucketId] = useState(selectedBucketId);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

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
      setSelectedTags(note.tags || []);
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
      setSelectedTags([]);
    }
  }, [note, selectedBucketId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };

    if (isTagDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagDropdownOpen]);

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
    mutationFn: async (
      noteData: Partial<InsertNote> & { bucketIds: string[] }
    ) => {
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
      tags: selectedTags,
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

    setSelectedBuckets((prev) =>
      prev.includes(bucketId)
        ? prev.filter((id) => id !== bucketId)
        : [...prev, bucketId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        data-testid="dialog-note-editor"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col space-y-6 overflow-hidden"
        >
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
              <label className="block text-sm font-medium mb-2">
                Primary Bucket
              </label>
              <Select
                value={primaryBucketId}
                onValueChange={setPrimaryBucketId}
              >
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
                name="note_content"
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[170px] resize-none"
                style={{ fontFamily }}
                data-testid="textarea-note-content"
                required
              />
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              
              {/* Tag Dropdown */}
              <div className="relative" ref={tagDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground">
                    {selectedTags.length > 0 
                      ? `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected`
                      : "Select tags..."
                    }
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isTagDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {TAG_DEFINITIONS.map((tag) => {
                      const IconComponent = tag.icon;
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => {
                            toggleTag(tag.id);
                          }}
                          title={tag.description}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? tag.bgColor : 'bg-muted'}`}>
                            <IconComponent className={`w-3 h-3 ${isSelected ? tag.color : 'text-muted-foreground'}`} />
                          </div>
                          <span className="flex-1 text-sm">{tag.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {getTagDefinitions(selectedTags).map((tag) => {
                      const IconComponent = tag.icon;
                      return (
                        <div
                          key={tag.id}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${tag.bgColor} ${tag.color}`}
                        >
                          <IconComponent className="w-3 h-3" />
                          {tag.label}
                          <button
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                            title="Remove tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* Additional Buckets */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Share with Additional Buckets
              </label>
              <div className="flex flex-wrap gap-2">
                {buckets
                  .filter((bucket) => bucket.id !== primaryBucketId)
                  .map((bucket) => (
                    <Badge
                      key={bucket.id}
                      variant={
                        selectedBuckets.includes(bucket.id)
                          ? "default"
                          : "outline"
                      }
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
                <span>
                  Last edited: {new Date(note.updatedAt).toLocaleDateString()}
                </span>
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
                disabled={
                  createNoteMutation.isPending || updateNoteMutation.isPending
                }
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
