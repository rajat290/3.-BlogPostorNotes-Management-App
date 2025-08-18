import { useState, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";



export default function Signup() {
    const [formData, setFormData] = useState({
       name: "",
        email: "",
        password: "",
        
    });

const [error, setError] = useState(null);
const { setUser, setToken } = useContext(AuthContext);
const  navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    }); 
};

     const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post ("/auth/signup", formData);
        setUser(res.data.user);
        setToken(res.data.token);
        navigate("/dashboard");
    } catch (error) {
        setError(error.response?.data?.message || "Signup failed");
        console.error(error);
    }
};

 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}