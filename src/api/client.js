const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function postForm(path, formData) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again in a moment.", 0);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(body?.errorMessage || "Something went wrong. Please try again.", response.status);
  }

  return body?.data;
}
