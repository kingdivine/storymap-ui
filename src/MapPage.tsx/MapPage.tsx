import Map from "./Map";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress, createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PostDialog from "./PostDialog";
import Heading from "../Generic/Heading";
import LocationSearch from "./LocationSearch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchAndFilter: {
      display: "flex",
      alignItems: "center",
      zIndex: 1,
      position: "absolute",
      top: "15%",
      left: theme.spacing(2),
    },
  })
);

export default function MapPage() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postInView, setPostInView] = useState<any>(null);
  const [flyToLongLat, setFlyToLongLat] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get("/storymap-api/stories");
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
      <div className={classes.searchAndFilter}>
        <LocationSearch
          onLocationSelect={(coords) => setFlyToLongLat(coords)}
        />
      </div>
      <Map
        posts={posts}
        openPost={handleOpenPost}
        flyToLongLat={flyToLongLat}
        onFlyEnd={() => setFlyToLongLat(null)}
      />
      {postInView && (
        <PostDialog post={postInView} closePost={handleClosePost} />
      )}
    </>
  );
}
