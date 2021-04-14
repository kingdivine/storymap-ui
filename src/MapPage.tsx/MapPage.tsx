import Map from "./Map";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  LinearProgress,
  createStyles,
  Theme,
  Chip,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PostDialog from "./PostDialog";
import Heading from "../Generic/Heading";
import LocationSearch from "./LocationSearch";
import Filter, { FilterObj } from "./Filter";
import Alert from "@material-ui/lab/Alert";

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
    },
    chip: {
      margin: 2,
      border: "1px solid white",
      backgroundColor: theme.palette.background.default,
    },
    loadingBar: {
      zIndex: 1,
    },
    alert: {
      zIndex: 1,
    },
  })
);

export default function MapPage() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState<FilterObj>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [flyToLongLat, setFlyToLongLat] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get("/storymap-api/stories", {
          params: {
            userId: filter?.user?.id,
            tag: filter?.tag?.title,
            followingOnly: filter?.followingOnly,
          },
        });
        setPosts(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleOpenPost = useCallback((postId: string) => {
    setSelectedStoryId(postId);
  }, []);

  const handleClosePost = () => {
    setSelectedStoryId("");
  };

  const handleFilterChange = (newFilter: FilterObj) => {
    setFilter(newFilter);
  };

  return (
    <>
      {isLoading && (
        <LinearProgress className={classes.loadingBar} color={"secondary"} />
      )}

      <Heading />
      <div className={classes.searchAndFilter}>
        <LocationSearch
          onLocationSelect={(coords) => setFlyToLongLat(coords)}
        />
        <Filter onFilterChange={handleFilterChange} />
        <div className={classes.chipContainer}>
          {filter?.user?.username && (
            <Chip
              className={classes.chip}
              label={`@${filter?.user?.username}`}
              size="small"
            />
          )}
          {filter?.followingOnly && (
            <Chip
              className={classes.chip}
              label={"Following Only"}
              size="small"
            />
          )}
          {filter?.tag?.title && (
            <Chip
              className={classes.chip}
              label={`#${filter?.tag?.title}`}
              size="small"
            />
          )}
        </div>
      </div>
      <Map
        posts={posts}
        openPost={handleOpenPost}
        flyToLongLat={flyToLongLat}
        onFlyEnd={() => setFlyToLongLat(null)}
      />
      {isError && (
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() => setIsError(false)}
        >
          <Alert onClose={() => setIsError(false)} severity="error">
            Oops! Something went wrong...
          </Alert>
        </Snackbar>
      )}
      {selectedStoryId && (
        <PostDialog storyId={selectedStoryId} closePost={handleClosePost} />
      )}
    </>
  );
}
