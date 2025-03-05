import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    if (!data.name.trim() || !data.image) {
      setError("Both name and image are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let formData = new FormData();
      formData.append("image", data.image);
      formData.append("name", data.name);

      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setData({ name: "", image: null });
        navigate("/", { replace: true });
      } else {
        throw new Error("Failed to add user.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2 className="text-center mb-4">Add New User</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Enter name"
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange("name")}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange("image")}
        />
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
