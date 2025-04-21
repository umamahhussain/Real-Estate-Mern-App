// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	try {
		const token = req.cookies.access_token;

		if (!token) {
			return res.status(401).json({ message: "No token provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
