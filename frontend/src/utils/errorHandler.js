// src/utils/errorHandler.js

export const handleError = (error, context = "Global") => {
  console.error(`[${context}] Error:`, error);

  // Extract error message from response or use a generic fallback
  let errorMessage = "Something went wrong. Please try again.";

  if (error.response) {
    errorMessage = error.response.data?.message || error.response.statusText;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Show alert for now (you can replace this with a toast notification)
  alert(errorMessage);
};
