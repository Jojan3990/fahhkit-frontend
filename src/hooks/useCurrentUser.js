import { useEffect, useState } from "react";
import { getJson, getToken, getUser, setUser } from "../api/client";

// Always re-fetches the logged-in user on mount instead of trusting the
// cached copy in localStorage indefinitely — the cache can go stale when a
// user's role changes server-side after they logged in.
export function useCurrentUser() {
  const isAuthed = Boolean(getToken());
  const [user, setLocalUser] = useState(getUser());
  const [loading, setLoading] = useState(isAuthed);

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    getJson("/v1/user/find/logged-in")
      .then((data) => {
        setUser(data);
        setLocalUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthed]);

  return { user, isAuthed, loading };
}
