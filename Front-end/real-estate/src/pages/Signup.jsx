import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signup() {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		const data = await res.json();

		if (data.success === false) {
			setError(data.message);
			setLoading(false);
			return;
		}
		setLoading(false);
		setError(null);
		navigate("/sign-in");
		console.log(data);
	};

	return (
		<div className="p-3 max-w-lg mx-auto heading HeadingFont">
			<h1 className="text-3xl text-center font-semibold my-7">Sign-Up</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="username"
					className="border p-3 rounded-lg"
					id="username"
					onChange={handleChange}
				/>
				<input
					type="text"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-600 text-white p-3 rounded-xl uppercase hover:opacity-95 hover:bg-cyan-600 disabled:opacity-75"
				>
					{loading ? "Loading..." : "Sign Up"}
				</button>
			</form>
			<div className="flex gap-2 mt-6">
				<p>Have an account?</p>
				<Link to="/sign-in">
					<span className="text-blue-600 hover:underline">Sign In</span>
				</Link>
			</div>
			{error && <p className="text-red-800 mt-5">{error}</p>}
		</div>
	);
}
