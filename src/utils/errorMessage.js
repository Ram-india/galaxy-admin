/**
 * Turns an axios failure into something worth showing a user.
 *
 * The important case is a request that never got a response — the API is down,
 * the wrong port, or blocked. That has no `response.data.message`, so without
 * this it collapses into a generic "could not save" that sends people hunting
 * through their own input for a problem that is not there.
 */
export const toErrorMessage = (error, fallback = "Something went wrong.") => {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) return serverMessage;

  // Request left the browser but nothing came back
  if (error?.request && !error?.response) {
    return "Could not reach the server. Check that the API is running, then try again.";
  }

  if (error?.response?.status === 413) {
    return "That file is too large for the server to accept.";
  }

  return fallback;
};

export default toErrorMessage;
