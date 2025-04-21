import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [uploading, setUploading] = useState(false);

	const handleAvatarClick = async () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";

		fileInput.onchange = async (event) => {
			const file = event.target.files[0];
			if (!file) return;

			setUploading(true);

			try {
				// 1. Upload to Cloudinary
				const formData = new FormData();
				formData.append("file", file);
				formData.append("upload_preset", "real-estate"); // replace with your Cloudinary unsigned upload preset
				const res = await axios.post(
					`https://api.cloudinary.com/v1_1/umamahhussain/image/upload`,
					formData
				);

				const imageUrl = res.data.secure_url;

				// 2. Update avatar in DB
				const updateRes = await axios.put(
					"/api/user/update-avatar",
					{ avatar: imageUrl },
					{
						withCredentials: true, // IMPORTANT
					}
				);



				// 3. Update Redux
				dispatch(signInSuccess(updateRes.data));
				alert("Avatar updated!");
			} catch (error) {
				console.error("Error uploading avatar:", error);
				alert("Failed to upload avatar");
			} finally {
				setUploading(false);
			}
		};

		fileInput.click();
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4">
				<img
					src={currentUser.avatar}
					alt="profile"
					onClick={handleAvatarClick}
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
				/>
				{uploading && (
					<p className="text-center text-sm text-gray-500">Uploading...</p>
				)}
				<input
					type="text"
					placeholder="username"
					id="username"
					className="border p-3 rounded-lg"
				/>
				<input
					type="email"
					placeholder="email"
					id="email"
					className="border p-3 rounded-lg"
				/>
				<input
					type="text"
					placeholder="password"
					id="password"
					className="border p-3 rounded-lg"
				/>
				<button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
					update
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span className="text-red-700 cursor-pointer">Delete account</span>
				<span className="text-red-700 cursor-pointer">Sign out</span>
			</div>
		</div>
	);
}
