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
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">My Profile</h3>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.Name}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myprofile;
