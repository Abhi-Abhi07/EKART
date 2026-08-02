import mongoose from "mongoose";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 1000;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

// ─── Schema ──────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries unless explicitly requested
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either 'user' or 'admin'",
      },
      default: "user",
    },

    // ── Profile ───────────────────────────────────────────────────────────────
    profilePic: {
      type: String,
      default: "",
    },
    profilePicPublicId: {
      type: String,
      default: "",
      select: false, // Internal Cloudinary ID — never expose to frontend
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    phoneNo: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },

    // ── Address (subdocument for scalability) ─────────────────────────────────
    address: {
      street:  { type: String, trim: true },
      city:    { type: String, trim: true },
      state:   { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
    },

    // ── Account Status ────────────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ── Email Verification Token (short-lived) ────────────────────────────────
    token: {
      type: String,
      default: null,
      select: false,
    },

    // ── OTP (always store hashed, never plain text) ───────────────────────────
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    // ── Brute-Force Protection ────────────────────────────────────────────────
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },

    // ── JWT Security: invalidate tokens issued before password change ──────────
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt

    // ── toJSON transform: strip all sensitive fields on serialization ──────────
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.token;
        delete ret.otp;
        delete ret.otpExpiry;
        delete ret.profilePicPublicId;
        delete ret.lockUntil;
        delete ret.passwordChangedAt;
        delete ret.__v;
        return ret;
      },
    },

    // ── toObject transform: same safety when using .toObject() ────────────────
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.token;
        delete ret.otp;
        delete ret.otpExpiry;
        delete ret.profilePicPublicId;
        delete ret.lockUntil;
        delete ret.passwordChangedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });   // Explicit index (unique already implies this)
userSchema.index({ role: 1 });    // Fast admin-level user lookups

// ─── Virtual: fullName ────────────────────────────────────────────────────────
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Virtual: isLocked ────────────────────────────────────────────────────────
// True if the account is currently under a brute-force lockout
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Increment failed login attempts.
 * Locks the account for LOCK_TIME_MS after MAX_LOGIN_ATTEMPTS failures.
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // If a previous lockout has expired, reset and start fresh
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set:   { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account when reaching max attempts and not already locked
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME_MS) };
  }

  return this.updateOne(updates);
};

/**
 * Reset login attempts and remove lockout after a successful login.
 */
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set:   { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

/**
 * Returns true if password was changed AFTER the given JWT was issued.
 * Used to invalidate old tokens after a password reset.
 * @param {number} jwtIssuedAt - Unix timestamp (seconds) from JWT `iat` claim
 */
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedAt = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return jwtIssuedAt < changedAt;
  }
  return false;
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const User = mongoose.model("User", userSchema);