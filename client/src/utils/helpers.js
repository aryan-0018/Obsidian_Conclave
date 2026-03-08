/**
 * Helper Functions
 * 
 * Reusable utility functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

/**
 * Generate a random room ID
 */
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
export const getDuration = (start, end) => {
  if (!start || !end) return "N/A";
  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return "0s";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};
