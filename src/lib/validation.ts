// Input validation utilities

export const VALIDATION_RULES = {
  TODO_TITLE_MIN: 1,
  TODO_TITLE_MAX: 500,
  EMAIL_MAX: 254, // RFC 5321
  PASSWORD_MIN: 12,
  PASSWORD_MAX: 128,
};

// Password validation with strong requirements
export function validatePassword(password: string): {
  valid: boolean;
  error: string;
} {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN) {
    return {
      valid: false,
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN} characters`,
    };
  }

  if (password.length > VALIDATION_RULES.PASSWORD_MAX) {
    return {
      valid: false,
      error: `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX} characters`,
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      valid: false,
      error:
        "Password must contain uppercase, lowercase, number, and special character",
    };
  }

  // Check against common passwords
  const commonPasswords = [
    "Password123!",
    "Welcome123!",
    "Qwerty123!",
    "Admin123!",
    "Test1234!",
    "User1234!",
    "Pass1234!",
  ];
  if (commonPasswords.includes(password)) {
    return {
      valid: false,
      error: "Password is too common. Please choose a stronger password",
    };
  }

  return { valid: true, error: "" };
}

// Email validation
export function validateEmail(email: string): {
  valid: boolean;
  error: string;
} {
  if (email.length > VALIDATION_RULES.EMAIL_MAX) {
    return { valid: false, error: "Email is too long" };
  }

  // Comprehensive email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true, error: "" };
}

// Todo title validation
export function validateTodoTitle(title: string): {
  valid: boolean;
  error: string;
} {
  const trimmed = title.trim();

  if (trimmed.length < VALIDATION_RULES.TODO_TITLE_MIN) {
    return { valid: false, error: "Todo title cannot be empty" };
  }

  if (trimmed.length > VALIDATION_RULES.TODO_TITLE_MAX) {
    return {
      valid: false,
      error: `Todo title must be less than ${VALIDATION_RULES.TODO_TITLE_MAX} characters`,
    };
  }

  // Check for suspicious patterns (XSS prevention)
  if (/<script|javascript:|onerror=|onclick=/i.test(title)) {
    return { valid: false, error: "Invalid characters in title" };
  }

  return { valid: true, error: "" };
}

// Sanitize todo title (remove any potential HTML/scripts)
export function sanitizeTodoTitle(title: string): string {
  // Remove any HTML tags and trim
  const sanitized = title
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim();

  return sanitized.substring(0, VALIDATION_RULES.TODO_TITLE_MAX);
}

// UUID validation
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Environment variable validation
export function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Please check your .env.local file.`
    );
  }

  return value;
}

// Validate Supabase URL
export function validateSupabaseUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("supabase")) {
      console.warn(
        "Warning: SUPABASE_URL does not appear to be a Supabase URL"
      );
    }
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
  }
}

// Validate Supabase key
export function validateSupabaseKey(key: string): void {
  if (key.length < 20) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)"
    );
  }
}
