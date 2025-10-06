import {
  Link,
  CheckSquare,
  AlertTriangle,
  Clock,
  Lock,
  Star,
  Heart,
  Book,
  Coffee,
  Camera,
  Music,
  MapPin,
  Gift,
  Archive,
  Bookmark,
  Flag,
  Pin,
  Lightbulb,
  ShoppingCart,
  Briefcase,
  Home,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Zap,
  Target,
  Award,
  TrendingUp,
  DollarSign,
  HeartPulse,
  Dumbbell,
} from "lucide-react";

export interface TagDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}

export const TAG_DEFINITIONS: TagDefinition[] = [
  // User requested tags
  {
    id: "link",
    label: "Link",
    icon: Link,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Contains important links or references",
  },
  {
    id: "todo",
    label: "Todo",
    icon: CheckSquare,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Task or item to be completed",
  },
  {
    id: "urgent",
    label: "Urgent",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Requires immediate attention",
  },
  {
    id: "reminder",
    label: "Reminder",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "Something to remember or follow up on",
  },
  {
    id: "secret",
    label: "Secret",
    icon: Lock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Confidential or private information",
  },

  // Additional useful tags
  {
    id: "important",
    label: "Important",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "High priority or significant content",
  },
  {
    id: "favorite",
    label: "Favorite",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    description: "Personal favorite or liked content",
  },
  {
    id: "idea",
    label: "Idea",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    description: "Creative idea or inspiration",
  },
  {
    id: "work",
    label: "Work",
    icon: Briefcase,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    description: "Work-related content",
  },
  {
    id: "personal",
    label: "Personal",
    icon: Home,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "Personal or private content",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingCart,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    description: "Shopping list or purchase notes",
  },
  {
    id: "meeting",
    label: "Meeting",
    icon: Users,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    description: "Meeting notes or discussions",
  },
  {
    id: "project",
    label: "Project",
    icon: Target,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
    description: "Project-related content",
  },
  {
    id: "reference",
    label: "Reference",
    icon: Book,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Reference material or documentation",
  },
  {
    id: "event",
    label: "Event",
    icon: Calendar,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    description: "Event or appointment related",
  },
  {
    id: "note",
    label: "Note",
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "General note or observation",
  },
  {
    id: "quick",
    label: "Quick",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    description: "Quick note or temporary content",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    description: "Archived or completed content",
  },
  {
    id: "bookmark",
    label: "Bookmark",
    icon: Bookmark,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Saved for later reference",
  },
  {
    id: "goal",
    label: "Goal",
    icon: Award,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    description: "Goal or objective related",
  },
  {
    id: "progress",
    label: "Progress",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Progress tracking or updates",
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Financial or money related",
  },
  {
    id: "health",
    label: "Health",
    icon: HeartPulse,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Health related content",
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: Dumbbell,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Fitness related content",
  },
];

export const getTagDefinition = (tagId: string): TagDefinition | undefined => {
  return TAG_DEFINITIONS.find((tag) => tag.id === tagId);
};

export const getTagDefinitions = (tagIds: string[]): TagDefinition[] => {
  return tagIds
    .map(getTagDefinition)
    .filter((tag): tag is TagDefinition => tag !== undefined);
};
