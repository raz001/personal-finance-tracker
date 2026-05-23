import {
  Bus,
  CreditCard,
  Heart,
  MoreHorizontal,
  Music,
  ShoppingBag,
  UtensilsCrossed
} from "lucide-react";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Bills",
  "Other"
];

// Maps each category to the Lucide icon component and the CSS variable that
// holds its color. Keeping this in one place means any visual change to a
// category propagates everywhere — chart, list, and form.
export const CATEGORY_META = {
  Food:          { icon: UtensilsCrossed, color: "var(--cat-food)" },
  Transport:     { icon: Bus,             color: "var(--cat-transport)" },
  Shopping:      { icon: ShoppingBag,     color: "var(--cat-shopping)" },
  Health:        { icon: Heart,           color: "var(--cat-health)" },
  Entertainment: { icon: Music,           color: "var(--cat-entertainment)" },
  Bills:         { icon: CreditCard,      color: "var(--cat-bills)" },
  Other:         { icon: MoreHorizontal,  color: "var(--cat-other)" }
};

export const getCategoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META.Other;
