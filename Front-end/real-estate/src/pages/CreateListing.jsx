import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useSelector } from "react-redux";

export default function CreateListing() {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		regularPrice: 0,
		discountPrice: 0,
		bathrooms: 1,
		bedrooms: 1,
		furnished: false,
		parking: false,
		type: "rent", // Default value, adjust as needed
		offer: false,
		imageUrls: [],
	});

	const [uploading, setUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [createListingError, setCreateListingError] = useState(null);
	const [createListingSuccess, setCreateListingSuccess] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		if (e.target.type === "checkbox") {
			setFormData({ ...formData, [e.target.id]: e.target.checked });
		} else if (e.target.type === "radio") {
			setFormData({ ...formData, type: e.target.value }); // Update 'type' based on the value
		} else if (e.target.type === "number") {
			setFormData({
				...formData,
				[e.target.id]: parseInt(e.target.value) || 0,
			});
		} else {
			setFormData({ ...formData, [e.target.id]: e.target.value });
		}
	};

	const handleImageUpload = async () => {
		if (formData.imageUrls.length >= 6) {
			setImageUploadError("You can only upload 6 images per listing");
			return;
		}

		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.multiple = true;

		fileInput.onchange = async (e) => {
			const selectedFiles = Array.from(e.target.files);

			if (selectedFiles.length + formData.imageUrls.length > 6) {
				setImageUploadError("You can only upload 6 images per listing");
				return;
			}

			setUploading(true);
			setImageUploadError("");

			try {
				const uploadedUrls = await Promise.all(
					selectedFiles.map(async (file) => {
						const data = new FormData();
						data.append("file", file);
						data.append("upload_preset", "real-estate"); // your preset

						const res = await axios.post(
							"https://api.cloudinary.com/v1_1/umamahhussain/image/upload",
							data
						);
						return res.data.secure_url;
					})
				);

				setFormData((prev) => ({
					...prev,
					imageUrls: [...prev.imageUrls, ...uploadedUrls],
				}));
			} catch (err) {
				console.error("Upload failed:", err);
				setImageUploadError("Upload failed. Max 2MB per image.");
			} finally {
				setUploading(false);
			}
		};

		fileInput.click();
	};

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		});
	};

	const { currentUser } = useSelector((state) => state.user); // Get currentUser from Redux

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setCreateListingError(null);
			setCreateListingSuccess(false);

			if (!currentUser?._id) {
				setCreateListingError("User not logged in.");
				return;
			}

			const formDataWithUserRef = {
				...formData,
				userRef: currentUser._id, // Add the user's ID
			};

			const res = await axios.post("/api/listing/create", formDataWithUserRef, {
				withCredentials: true,
			});

			if (res.status === 201) {
				setCreateListingSuccess(true);
				navigate(`/listing/${res.data._id}`);
			} else {
				setCreateListingError("Failed to create listing");
			}
		} catch (error) {
			setCreateListingError(
				error.response?.data?.message || "Failed to create listing"
			);
		}
	};

	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create a Listing
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						maxLength="62"
						minLength="10"
						required
						onChange={handleChange}
						value={formData.name}
					/>
					<textarea
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
						onChange={handleChange}
						value={formData.description}
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						required
						onChange={handleChange}
						value={formData.address}
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChange}
								checked={formData.furnished}
							/>
							<span>Furnished</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={formData.parking}
							/>
							<span>Parking spot</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={formData.offer}
							/>
							<span>Offer</span>
						</div>
						<div className="flex gap-2">
							<label htmlFor="type-sell" className="cursor-pointer">
								<input
									type="radio"
									id="type-sell"
									name="type"
									value="sell"
									className="w-5 mr-1"
									onChange={handleChange}
									checked={formData.type === "sell"}
								/>
								<span>Sell</span>
							</label>
						</div>
						<div className="flex gap-2">
							<label htmlFor="type-rent" className="cursor-pointer">
								<input
									type="radio"
									id="type-rent"
									name="type"
									value="rent"
									className="w-5 mr-1"
									onChange={handleChange}
									checked={formData.type === "rent"}
								/>
								<span>Rent</span>
							</label>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg w-24"
								onChange={handleChange}
								value={formData.bedrooms}
							/>
							<p>Beds</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg w-24"
								onChange={handleChange}
								value={formData.bathrooms}
							/>
							<p>Baths</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="regularPrice"
								min="1"
								required
								className="p-3 border border-gray-300 rounded-lg w-36"
								onChange={handleChange}
								value={formData.regularPrice}
							/>
							<div className="flex flex-col items-start">
								<p>Regular price</p>
								{formData.type === "rent" && (
									<span className="text-xs">($ / month)</span>
								)}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="discountPrice"
								min="0"
								className="p-3 border border-gray-300 rounded-lg w-36"
								onChange={handleChange}
								value={formData.discountPrice}
							/>
							<div className="flex flex-col items-start">
								<p>Discounted price</p>
								{formData.type === "rent" && (
									<span className="text-xs">($ / month)</span>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-gray-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className="flex flex-col gap-4">
						<button
							type="button"
							onClick={handleImageUpload}
							disabled={uploading}
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
						>
							{uploading ? "Uploading..." : "Upload Images"}
						</button>

						{imageUploadError && (
							<p className="text-red-700 text-sm">{imageUploadError}</p>
						)}

						<div className="flex flex-wrap gap-2">
							{formData.imageUrls.map((url, index) => (
								<div
									key={url}
									className="relative border rounded-lg overflow-hidden w-24 h-24"
								>
									<img
										src={url}
										alt={`Uploaded ${index}`}
										className="w-full h-full object-cover"
									/>
									<button
										type="button"
										onClick={() => handleRemoveImage(index)}
										className="absolute top-0 right-0 p-1 text-red-700 bg-gray-100 rounded-full hover:bg-gray-200"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							))}
						</div>
					</div>
					<button
						type="submit"
						className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
					>
						Create Listing
					</button>
					{createListingError && (
						<p className="text-red-700 text-sm mt-2">{createListingError}</p>
					)}
					{createListingSuccess && (
						<p className="text-green-700 text-sm mt-2">
							Listing created successfully!
						</p>
					)}
				</div>
			</form>
		</main>
	);
}
