import { useState } from 'react'
import axios from "axios";

export function AdminLogin({switchPage, goBack}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

       const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (res.data.message === "Login successful") {
        switchPage();
      } else {
        alert("Invalid credentials, please try again.");
      }
    };

  return (
    <div className="h-screen flex flex-col items-center justify-center ">

        <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl font-semibold">Admin Login</p>
            <p className="text-sm text-gray-500">Sign in to manage visitor inquiries</p>
        </div>

        <div className="flex flex-col border-gray-300 border rounded-lg p-6 mt-10 w-90 max-w-md shadow-md">
        
            <label htmlFor="fullname" className="text-sm font-semibold">Admin Name</label>
            <input type="text" id="fullname" className="w-76 text-sm border border-gray-300 rounded-md p-2 mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="pass" className="text-sm font-semibold mt-5">Password</label>
            <input type="password" id="pass" className="w-76 text-sm border border-gray-300 rounded-md p-2 mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className="bg-blue-600 text-white text-sm cursor-pointer py-2 px-4 rounded-md mt-5 transition duration-300 hover:bg-blue-700" onClick={() => handleLogin()}>Login</button>

            <p className="text-center mt-4 text-sm text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => goBack()}>Go Back to Visitor Portal</p>
        </div>
    </div>
  );
}