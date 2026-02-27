import { useState, useEffect } from 'react'
import axios from "axios";

export function Admin({switchPage}) {

    const [data, setData] = useState([]);
    const [inquriesStatus, setInquiriesStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this inquiry?")) {
        return;
      }
      try {
        await axios.delete(`http://localhost:5000/api/${id}`);
        // remove locally so UI updates immediately
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    };

    const handleStatusChange = async (id, newStatus) => {
      try {
        await axios.put(`http://localhost:5000/api/${id}`, { status: newStatus });
        // update locally so UI updates immediately
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "Pending":
          return "bg-blue-100 text-blue-800";
        case "Approved":
          return "bg-green-100 text-green-800";
        case "Rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    // apply status and search filters
    const filteredData = data
      .filter((item) => {
        if (inquriesStatus === "All") return true;
        return item.status === inquriesStatus;
      })
      .filter((item) => {
        if (!searchTerm) return true;
        return item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      });

return (
    <div className="text-gray-900">

        <div className="h-16 flex items-center justify-around text-gray-900 border-b border-gray-300" >
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <h1 className="text-gray-400 transition duration-300 hover:text-gray-700 cursor-pointer" onClick={() => switchPage()}>Logout</h1>
        </div>
 
        <p className="text-gray-900 font-bold ml-10 mt-10">Manage visitor inquiries</p>

        <div className="ml-10 mt-5 flex justify-between">
            <input
              type="text"
              placeholder="Search name..."
              className="w-90 text-sm border border-gray-300 rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="text-xs flex space-x-2 mr-10">
                <button className={`p-1 w-20 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer ${inquriesStatus === "All" ? "bg-gray-200" : ""}`} onClick={() => setInquiriesStatus("All")}>All</button>
                <button className={`p-1 w-20 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer ${inquriesStatus === "Pending" ? "bg-gray-200" : ""}`} onClick={() => setInquiriesStatus("Pending")}>Pending</button>
                <button className={`p-1 w-20 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer ${inquriesStatus === "Approved" ? "bg-gray-200" : ""}`} onClick={() => setInquiriesStatus("Approved")}>Approved</button>
                <button className={`p-1 w-20 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer ${inquriesStatus === "Rejected" ? "bg-gray-200" : ""}`} onClick={() => setInquiriesStatus("Rejected")}>Rejected</button>
            </div>
        </div>
        <div className="p-10">
              <table className="w-full shadow-md">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Visit Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {filteredData.map((item) => (
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-800">{item.full_name}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{item.email}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{new Date(item.visit_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{item.purpose}</td>
                        <td className="px-4 py-3 text-sm">
                        <select 
                          value={item.status} 
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${getStatusColor(item.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">02/15/2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            <div className="mb-30"></div>
    </div>
  );
}