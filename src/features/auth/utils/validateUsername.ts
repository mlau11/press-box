export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export const USERNAME_RULE =
  "3–20 characters, lowercase letters, numbers and underscores only.";

export const validateUsername = (raw: string): string | null => {
  const value = raw.trim().toLowerCase();

  if (value.length === 0) return "Username is required";
  if (value.length < 3) return "Username must be at least 3 characters";
  if (value.length > 20) return "Username must be 20 characters or fewer";
  if (!USERNAME_PATTERN.test(value)) {
    return "Use lowercase letters, numbers and underscores only";
  }
  return null;
};
