import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // SHA-256 hash of the current refresh token — used to validate and rotate tokens
    refreshTokenHash: {
      type: String,
      required: true,
    },
    // Auto-delete session after refresh token lifetime (MongoDB TTL)
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
sessionSchema.index({ userId: 1 });         // Fast lookup during refresh & login cleanup
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL auto-cleanup

export const Session = mongoose.model("Session", sessionSchema);