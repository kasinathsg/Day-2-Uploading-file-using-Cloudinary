import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/files/upload", formData);
      
      if (res.data?.url) {
        setImageUrl(res.data.url);
        setError("");
      } else {
        throw new Error("No URL returned from upload.");
      }
    } catch (err) {
      setError("Upload failed. Please try again later.");
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded file" style={{ maxWidth: "300px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
