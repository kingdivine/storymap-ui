import Map from "./Map";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import PostDialog from "./PostDialog";
import Heading from "../Generic/Heading";

export default function MapPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postInView, setPostInView] = useState<any>(null);

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

  const handleOpenPost = useCallback(
    (postId: string) => {
      const selectedPost = posts.find((post: any) => post.id === postId);
      setPostInView(selectedPost);
    },
    [posts]
  );

  const handleClosePost = () => {
    setPostInView(null);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <h1>Whoops something went wrong!</h1>;
  return (
    <>
      <Heading />
      <Map posts={posts} openPost={handleOpenPost} />
      {postInView && (
        <PostDialog post={postInView} closePost={handleClosePost} />
      )}
    </>
  );
}
