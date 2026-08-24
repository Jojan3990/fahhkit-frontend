import { useEffect, useState } from "react";
import { getJson } from "../api/client";
import { useCurrentUser } from "./useCurrentUser";

// Set of event IDs the current user has already registered for, derived
// from their own athlete history (there's no dedicated "check status"
// endpoint, so this is the closest thing the backend exposes).
export function useRegisteredEventIds() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser();
  const [registeredIds, setRegisteredIds] = useState(new Set());

  useEffect(() => {
    if (userLoading || !isAuthed || !user?.id) {
      setRegisteredIds(new Set());
      return;
    }
    getJson(`/v1/athlete/${user.id}/history`)
      .then((data) => setRegisteredIds(new Set((data || []).map((h) => h.eventId))))
      .catch(() => {});
  }, [userLoading, isAuthed, user?.id]);

  return registeredIds;
}
