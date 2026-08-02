// User profile and admin management controller.

import "dotenv/config";
import { User } from "../../models/userModel.js";
import cloudinary from "../../utils/cloudinary.js";
import { ok, fail } from "../../utils/apiResponse.js";

// ─── Get My Profile ───────────────────────────────────────────────────────────
// Returns the currently authenticated user's own profile.
export const getMyProfile = async (req, res) => {
  try {
    // req.user is set by isAuthenticated middleware
    // toJSON transform on req.user strips all sensitive fields automatically
    return res.status(200).json(ok("Profile fetched successfully.", { user: req.user }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Get All Users (Admin only) ───────────────────────────────────────────────
export const allUser = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query?.page)  || 1);
    const limit = Math.min(100, parseInt(req.query?.limit) || 20);
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return res.status(200).json(
      ok("Users fetched successfully.", {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Get User By ID (Admin only) ──────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // schema select:false + toJSON transform handles all sensitive field exclusion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(fail("User not found."));
    }
    return res.status(200).json(ok("User fetched successfully.", { user }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Update User ──────────────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser   = req.user;

    // Authorization: only own profile or admin
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json(fail("You are not allowed to update this profile."));
    }

    const user = await User.findById(userIdToUpdate).select("+profilePicPublicId");
    if (!user) {
      return res.status(404).json(fail("User not found."));
    }

    const {
      firstName,
      lastName,
      phoneNo,
      role,
      // Address subdocument fields
      street,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    // Handle profile picture upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (user.profilePicPublicId) {
        await cloudinary.uploader.destroy(user.profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      user.profilePic          = uploadResult.secure_url;
      user.profilePicPublicId  = uploadResult.public_id; // stored but never returned
    }

    // Update flat fields
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (phoneNo)   user.phoneNo   = phoneNo;

    // Only admin can change role
    if (role && loggedInUser.role === "admin") {
      user.role = role;
    }

    // Update nested address subdocument fields selectively
    user.address = {
      street:  street  ?? user.address?.street,
      city:    city    ?? user.address?.city,
      state:   state   ?? user.address?.state,
      zipCode: zipCode ?? user.address?.zipCode,
      country: country ?? user.address?.country,
    };

    const updatedUser = await user.save();

    // toJSON transform strips profilePicPublicId and other sensitive fields
    return res.status(200).json(
      ok("Profile updated successfully.", { user: updatedUser })
    );
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};
