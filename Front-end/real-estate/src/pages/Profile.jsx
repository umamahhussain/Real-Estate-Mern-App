import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
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
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState([]);

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

	 const handleShowListings = async () => {
			try {
				setShowListingsError(false);
				const res = await fetch(`/api/user/listings/${currentUser._id}`);
				const data = await res.json();
				if (data.success === false) {
					setShowListingsError(true);
					return;
				}

				setUserListings(data);
			} catch (error) {
				setShowListingsError(true);
			}
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

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}

			setUserListings((prev) =>
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7 HeadingFont underline ">
				Profile
			</h1>
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
				<Link
					className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
					to={"/create-listing"}
				>
					Create Listing
				</Link>
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
			<button
				onClick={handleShowListings}
				className="text-green-700 hover:cursor-pointer w-full"
			>
				Show Listings
			</button>
			<p className="text-red-700 mt-5">
				{showListingsError ? "Error showing listings" : ""}
			</p>

			{userListings && userListings.length > 0 && (
				<div className="flex flex-col gap-4">
					<h1 className="text-center mt-7 text-2xl font-semibold HeadingFont underline">
						Your Listings
					</h1>
					{userListings.map((listing) => (
						<div
							key={listing._id}
							className="border rounded-lg p-3 flex justify-between items-center gap-4"
						>
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt="listing cover"
									className="h-16 w-16 object-contain"
								/>
							</Link>
							<Link
								className="text-slate-700 font-semibold hover:cursor-pointer hover:underline truncate flex-1"
								to={`/listing/${listing._id}`}
							>
								<p>{listing.name}</p>
							</Link>

							<div className="flex flex-col item-center">
								<button
									onClick={() => handleListingDelete(listing._id)}
									className="text-red-700 hover:cursor-pointer uppercase"
								>
									Delete
								</button>

								<Link to={`/update-listing/${listing._id}`}>
									<button className="text-green-700 uppercase hover:cursor-pointer">
										Edit
									</button>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
