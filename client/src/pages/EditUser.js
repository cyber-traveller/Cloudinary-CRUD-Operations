import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userid = pathname.substring(pathname.lastIndexOf("/") + 1);

  const [data, setData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userid}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e?.target?.files[0] : e?.target?.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("image", data?.image);
      formData.append("name", data?.name);

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/user/${userid}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (res.ok) {
        setData({ name: "", image: "" });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: 500 }}>
        <h4 className="text-center mb-4">Edit User</h4>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange("name")}
            placeholder="Enter new name"
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
          <button className="btn btn-warning w-100" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
