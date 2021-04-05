import Map from "./Map";
import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";

export default function MapPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get("/stories");
        setPosts(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <CircularProgress />;
  if (isError) return <h1>Whoops something went wrong!</h1>;
  return (
    <>
      <Map posts={posts} />
      <button
        style={{
          backgroundColor: "rgba(35, 55, 75, 0.9)",
          color: "#ffffff",
          padding: "6px 12px",
          font: "15px/24px monospace",
          zIndex: 1,
          position: "absolute",
          top: 30,
          left: 30,
          margin: "8px",
          borderRadius: "4px",
        }}
        onClick={() => setPosts(posts.slice(2, 6))}
      >
        Filter Data
      </button>
    </>
  );
}
