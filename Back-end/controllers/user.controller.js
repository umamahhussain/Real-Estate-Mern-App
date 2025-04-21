import User from "../models/user.model.js";

export const updateAvatar = async (req, res, next) => {
	try {
		
		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			{ avatar: req.body.avatar },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		const { password, ...rest } = updatedUser._doc;
		res.status(200).json(rest);
	} catch (error) {
		console.error("Error updating avatar:", error);
		res.status(500).json({ message: "Failed to update avatar" });
	}
};
