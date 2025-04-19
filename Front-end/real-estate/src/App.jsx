import { useState } from "react";
import { BrowserRouter, Routes, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
	return (
		<BrowserRouter>
			<Routes>
        < Route path='/' element={<Home/>} />
        < Route path='/sign-in' element={<Signin/>} />
        < Route path='/sign-up' element={<Signup/>} />
        < Route path='/profile' element={<Profile/>} />
        < Route path='/about' element={<About/>} />
      </Routes>
		</BrowserRouter>
	);
}

export default App;
