import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user`);
        if (!res.ok) throw new Error("Failed to fetch users.");
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      } else {
        throw new Error("Failed to delete user.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        {loading ? (
          <p className="text-center mt-4">Loading users...</p>
        ) : error ? (
          <p className="text-danger text-center mt-4">{error}</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div className="col-md-4 mb-4" key={user._id}>
              <div className="card shadow-lg">
                <img
                  src={user.avatar}
                  alt="User"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{user.name}</h5>
                  <div className="d-flex justify-content-between">
                    <Link to={`/edit/${user._id}`} className="btn btn-primary btn-sm">
                      Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
