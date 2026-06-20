export type Attending = "yes" | "no";

// Flat shape keeps the mockup simple; the meal is stored as a dish id so it
// tallies cleanly for the admin dashboard later (Phase 5).
export type RsvpAnswers = {
  attending: Attending;
  mealId: string | null;
  dietary: string;
  note: string;
};
