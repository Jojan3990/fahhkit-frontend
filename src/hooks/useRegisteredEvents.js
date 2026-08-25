import { useEffect, useState } from "react";
import { getJson } from "../api/client";
import { useCurrentUser } from "./useCurrentUser";

// Map of eventId -> payment status for the current user's own registrations, derived
// from their athlete history (there's no dedicated "check status" endpoint). Only a
// PAID entry means they're actually registered - PENDING/FAILED/CANCELLED rows exist
// but shouldn't be treated as a completed registration.
export function useEventRegistrationStatuses() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser();
  const [statuses, setStatuses] = useState(new Map());

  useEffect(() => {
    if (userLoading || !isAuthed || !user?.id) {
      setStatuses(new Map());
      return;
    }
    getJson(`/v1/athlete/${user.id}/history`)
      .then((data) => setStatuses(new Map((data || []).map((h) => [h.eventId, h.paymentStatus]))))
      .catch(() => {});
  }, [userLoading, isAuthed, user?.id]);

  return statuses;
}
