import { useState } from 'react'
import axios from "axios";

export function Visitor({switchPage}) {

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {

    if (!fullname || !email || !visitDate || !reason) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api", {
        full_name: fullname,
        email: email,
        visit_date: visitDate,
        purpose: reason,
      });

      console.log("server response", res.data);
      alert("Inquiry sent successfully!");

      setFullname("");
      setEmail("");
      setVisitDate("");
      setReason("");

    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to send inquiry, see console for details.");
    }
  }

  return (
    <div className="text-gray-900">
      
        <div className="h-16 flex items-center justify-around text-gray-900 border-b border-gray-300" >
            <h1 className="text-lg font-bold">Visitor Portal</h1>
            <h1 className="text-gray-400 transition duration-300 hover:text-gray-700 cursor-pointer" onClick={() => {switchPage()}}>Admin</h1>
        </div>

        <div className="flex flex-col items-center justify-center my-10">
          <p className="font-bold text-3xl">Welcome to the visitor inquiry page!</p>
          <p className="text-gray-800 mt-4">Fill out the form below to schedule your visit. You will receive an email confirmation once your inquiry has been reviewed.</p>

            <div className="border-gray-300 border rounded-lg p-6 mt-10 w-full max-w-md space-y-4 shadow-md">
                
                <label htmlFor="fullname" className="text-sm font-semibold">Fullname</label>
                <input type="text" placeholder="John Doe" id="fullname" className="w-full text-sm border border-gray-300 rounded-md p-2 mt-1" value={fullname} onChange={(e) => setFullname(e.target.value)} />

                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <input type="email" placeholder="example@gmail.com" id="email" className="w-full text-sm border border-gray-300 rounded-md p-2 mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="date" className="text-sm font-semibold">Visit Date</label>
                <input type="date" id="date" className="w-full text-sm border border-gray-300 rounded-md p-2 mt-1" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />

                <label htmlFor="reason" className="text-sm font-semibold">Reason</label>
                <input type="text" placeholder="Purpose of visit..." id="reason" className="w-full text-sm border border-gray-300 rounded-md p-2 mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />

                <button className="w-full text-sm cursor-pointer bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={() => handleSubmit()}>Submit Inquiry</button>

            </div>
        
        </div>

    </div>
  );
}