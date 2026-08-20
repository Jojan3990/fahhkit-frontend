export const EVENT_TYPE_LABELS = {
  ENDURANCE: "Endurance",
  STRENGTH: "Strength",
  HYBRID: "Hybrid",
  GYMNASTICS: "Gymnastics",
  COMBAT: "Combat",
  TEAM: "Team",
  RACKET: "Racket",
  OUTDOOR: "Outdoor",
  FLEXIBILITY: "Flexibility",
  PHYSIQUE: "Physique",
  RECREATIONAL: "Recreational",
};

export function formatDate(value) {
  if (!value) return "TBA";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
