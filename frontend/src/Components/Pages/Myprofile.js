// import React from "react";

// function Myprofile() {
//   return <div>my profile</div>;
// }

// export default Myprofile;
import React, { useEffect, useState } from "react";
import axios from "axios";

function Myprofile() {
  const [user, setUser] = useState({
    email: "",
    Name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/myprofile", {
          headers: { Authorization: token },
        });
        setUser(response.data);
        setLoading(false); // Mark loading as false after successful fetch
      } catch (error) {
        console.error("Failed to fetch profile", error);
        // Optionally handle error state or retry logic
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures useEffect runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">My Profile</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Name
              </p>
              <p className="mt-1 text-lg text-gray-900">{user.Name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Phone
              </p>
              <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myprofile;
