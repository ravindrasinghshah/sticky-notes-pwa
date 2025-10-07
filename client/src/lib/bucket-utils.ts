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
    case "green":
      return "bg-green-200 text-green-800";
    case "blue":
      return "bg-blue-200 text-blue-800";
    case "pink":
      return "bg-pink-200 text-pink-800";
    case "orange":
      return "bg-orange-200 text-orange-800";
    case "purple":
      return "bg-purple-200 text-purple-800";
    default:
      return "bg-accent text-accent-foreground";
  }
};
