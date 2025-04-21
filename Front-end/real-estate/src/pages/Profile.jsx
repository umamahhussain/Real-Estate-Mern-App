import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserStart
} from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);

	const dispatch = useDispatch();
	const [uploading, setUploading] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [formData, setFormData] = useState({});

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

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("/api/auth/signout");
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(data.message));
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
					className="border p-3 rounded-lg"
					defaultValue={currentUser.username}
					id="username"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="email"
					id="email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					id="password"
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? "Loading..." : "Update"}
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					Delete account
				</span>
				<span onClick={handleSignOut} className="text-red-700 cursor-pointer">
					Sign out
				</span>
			</div>
			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-700 mt-5">
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
		</div>
	);
}
