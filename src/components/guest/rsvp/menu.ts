export type Dish = {
  /** Stable id — this is the structured value the admin dashboard will tally. */
  id: string;
  /** Short name for the "Your choice" summary + confirmation chips. */
  label: string;
  /** Full menu description, shown under the photo. */
  name: string;
  image: string;
};

// Order follows menu.txt. Casing lightly normalised for display.
export const DISHES: Dish[] = [
  {
    id: "chicken",
    label: "Spring Chicken",
    name: "Marinated lemongrass half spring chicken with red chilli pepper sauce",
    image: "/rsvp-menu/chicken.png",
  },
  {
    id: "fish",
    label: "White Snapper",
    name: "Salted baked white snapper with Thai seafood sauce",
    image: "/rsvp-menu/fish.png",
  },
  {
    id: "pork",
    label: "Pork Neck",
    name: "Thai-style marinated grilled pork neck with Nam Jim Jaew",
    image: "/rsvp-menu/pork.png",
  },
  {
    id: "beef",
    label: "Ribeye Steak",
    name: "Australian Ribeye steak with spicy hot basil sauce",
    image: "/rsvp-menu/beef.png",
  },
  {
    id: "prawn",
    label: "River Prawn",
    name: "Grilled river prawn with garlic and pepper sauce",
    image: "/rsvp-menu/prawn.png",
  },
];

export function dishById(id: string | null): Dish | undefined {
  if (!id) return undefined;
  return DISHES.find((dish) => dish.id === id);
}
