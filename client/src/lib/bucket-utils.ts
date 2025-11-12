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
  BadgeDollarSign,
} from "lucide-react";

export interface IconOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

/**
 * Available icon options for buckets
 */
export const ICON_OPTIONS: IconOption[] = [
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
  { value: "badge-dollar-sign", label: "Dollar Sign", icon: BadgeDollarSign },
];

/**
 * Available color options for buckets
 */
export const BUCKET_COLOR_OPTIONS: ColorOption[] = [
  { value: "primary", label: "Primary", color: "bg-primary" },
  { value: "accent", label: "Accent", color: "bg-accent" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

/**
 * Available color options for notes (lighter shades)
 */
export const NOTE_COLOR_OPTIONS: ColorOption[] = [
  { value: "accent", label: "Default", color: "bg-accent" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-200" },
  { value: "blue", label: "Blue", color: "bg-blue-200" },
  { value: "green", label: "Green", color: "bg-green-200" },
  { value: "pink", label: "Pink", color: "bg-pink-200" },
  { value: "purple", label: "Purple", color: "bg-purple-200" },
  { value: "orange", label: "Orange", color: "bg-orange-200" },
];

/**
 * Get bucket icon component based on icon name
 */
export const getBucketIcon = (iconName: string) => {
  const iconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    briefcase: Briefcase,
    home: Home,
    lightbulb: Lightbulb,
    "shopping-cart": ShoppingCart,
    star: Star,
    heart: Heart,
    book: Book,
    coffee: Coffee,
    camera: Camera,
    music: Music,
    "map-pin": MapPin,
    gift: Gift,
    folder: Folder,
    archive: Archive,
    bookmark: Bookmark,
    tag: Tag,
    flag: Flag,
    "badge-dollar-sign": BadgeDollarSign,
  };

  const IconComponent = iconMap[iconName] || Briefcase;
  return IconComponent;
};

/**
 * Get bucket icon color class based on color name
 */
export const getBucketIconColorClass = (color: string) => {
  switch (color) {
    case "primary":
      return "text-primary";
    case "accent":
      return "text-accent-foreground";
    case "green":
      return "text-green-600";
    case "red":
      return "text-red-600";
    case "blue":
      return "text-blue-600";
    case "purple":
      return "text-purple-600";
    case "yellow":
      return "text-yellow-600";
    case "pink":
      return "text-pink-600";
    default:
      return "text-primary";
  }
};

/**
 * Get bucket background color class based on color name
 */
export const getBucketColorClass = (color: string) => {
  switch (color) {
    case "primary":
      return "bg-primary";
    case "accent":
      return "bg-accent";
    case "green":
      return "bg-green-500";
    case "red":
      return "bg-red-500";
    case "blue":
      return "bg-blue-500";
    case "purple":
      return "bg-purple-500";
    case "yellow":
      return "bg-yellow-500";
    case "pink":
      return "bg-pink-500";
    default:
      return "bg-primary";
  }
};

/**
 * Get note color classes based on color name
 */
export const getNoteColorClasses = (color: string) => {
  switch (color) {
    case "accent":
      return "bg-accent text-accent-foreground";
    case "yellow":
      return "bg-yellow-200 text-yellow-800";
    case "green":
      return "bg-green-200 text-green-800";
    case "blue":
      return "bg-blue-200 text-blue-800";
    case "pink":
      return "bg-pink-200 text-pink-800";
    case "purple":
      return "bg-purple-200 text-purple-800";
    case "orange":
      return "bg-orange-200 text-orange-800";
    default:
      return "bg-accent text-accent-foreground";
  }
};
