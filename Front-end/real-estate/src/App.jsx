import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/header";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route path="/sign-up" element={<Signup />} />
				<Route element={<PrivateRoute />}>
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path="/about" element={<About />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
