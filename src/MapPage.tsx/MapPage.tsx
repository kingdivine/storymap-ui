import Map from "./Map";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress, createStyles, Theme, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PostDialog from "./PostDialog";
import Heading from "../Generic/Heading";
import LocationSearch from "./LocationSearch";
import Filter, { FilterObj } from "./Filter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchAndFilter: {
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
      position: "absolute",
      top: "15%",
      left: theme.spacing(2),
    },
    chipContainer: {
      marginTop: theme.spacing(1),
      maxWidth: 250,
    },
    usersChip: {
      margin: 2,
      border: "1px solid white",
    },
    tagChip: {
      margin: 2,
      border: "1px solid white",
      backgroundColor: theme.palette.background.default,
    },
  })
);

export default function MapPage() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState<FilterObj>({
    username: "",
    followingOnly: false,
    tags: [],
  });
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

  const handleFilterChange = (newFilters: FilterObj) => {
    setFilters(newFilters);
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
        <Filter onFilterChange={handleFilterChange} />
        <div className={classes.chipContainer}>
          {filters.username && (
            <Chip
              className={classes.usersChip}
              label={
                filters.username.startsWith("@")
                  ? filters.username
                  : `@${filters.username}`
              }
              size="small"
            />
          )}
          {filters.followingOnly && (
            <Chip
              className={classes.usersChip}
              label={"Following Only"}
              size="small"
            />
          )}
          {filters.tags.map((tag) => (
            <Chip
              key={tag}
              className={classes.tagChip}
              label={tag.startsWith("#") ? tag : `#${tag}`}
              size="small"
            />
          ))}
        </div>
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
