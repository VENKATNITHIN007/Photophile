export const ERRORS = {
  AUTH: {
    USER_EXISTS: "User name or email already exists",
    INVALID_CREDENTIALS: "These credentials do not match our records",
    WRONG_PASSWORD: "The provided password is incorrect",
    REQUIRED: "Authentication required. Please log in to access this resource",
    USER_NOT_FOUND: "User not found",
    INVALID_TOKEN: "Invalid or expired token",
    FORBIDDEN: "Administrator privileges are required for this action",
    RATE_LIMIT: "Too many login attempts. Please try again later",
    EMAIL_NOT_VERIFIED: "Please verify your email to access this feature",
    VERIFICATION_TOKEN_INVALID: "Invalid or expired verification link",
    RESET_TOKEN_INVALID: "Invalid or expired password reset link",
    EMAIL_SEND_FAILED: "Failed to send email. Please try again later",
    FORGOT_PASSWORD_GENERIC: "If an account exists, a reset email has been sent",
  },

  PHOTOGRAPHER: {
    NOT_FOUND: "Photographer not found",
    ONLY: "Only photographers can access this resource",
    USERNAME_TAKEN: "Username is already taken",
    PROFILE_EXISTS: "Photographer profile already exists for this user",
    PORTFOLIO_ONLY: "Only photographers can manage portfolio items",
    PROFILE_NOT_FOUND: "Photographer profile not found",
  },

  BOOKING: {
    NOT_FOUND: "Booking not found",
    CANNOT_BOOK_SELF: "You cannot book yourself",
    EXISTS:
      "You already have a pending or accepted booking with this photographer for this date",
    CANNOT_MODIFY: "This booking cannot be modified",
    CANNOT_CANCEL: "This booking cannot be cancelled",
    INVALID_TRANSITION: "Invalid status transition",
    UPDATE_STATUS_FAILED: "Something went wrong while updating booking status",
  },

  REVIEW: {
    NOT_FOUND: "Review not found",
    CANNOT_REVIEW_SELF: "You cannot review yourself",
    REQUIRES_BOOKING:
      "You can only review photographers after a completed booking",
    EXISTS: "You have already reviewed this photographer",
  },

  PORTFOLIO: {
    ITEM_NOT_FOUND: "Portfolio item not found",
  },
} as const;
