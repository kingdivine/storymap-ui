import Map from "./Map";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  LinearProgress,
  createStyles,
  Theme,
  Chip,
  Snackbar,
  Fab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ViewPostDialog from "./ViewPostDialog";
import Heading from "../Generic/Heading";
import LocationSearch from "./LocationSearch";
import Filter, { FilterObj } from "./Filter";
import CreatePostForm from "./CreatePostForm";
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headingContainer: {
      zIndex: 1,
      position: "absolute",
      top: theme.spacing(1),
      left: theme.spacing(2),
    },
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
    fab: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: theme.spacing(4),
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
  const [isCreatePostFormOpen, setIsCreatePostFormOpen] = useState(false);

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

  const handleCloseForm = () => {
    setIsCreatePostFormOpen(false);
  };

  const handleFilterChange = (newFilter: FilterObj) => {
    setFilter(newFilter);
  };

  const clearFilter = () => {
    setFilter({ user: null, tag: null, followingOnly: null });
  };

  return (
    <>
      {isLoading && (
        <LinearProgress className={classes.loadingBar} color={"secondary"} />
      )}
      <div className={classes.headingContainer}>
        <Heading />
      </div>

      <div className={classes.searchAndFilter}>
        <LocationSearch
          placeHolderText={"Fly to..."}
          textFieldWidth={165}
          onLocationSelect={(coords) => setFlyToLongLat(coords)}
        />
        <Filter onFilterChange={handleFilterChange} />
        <div className={classes.chipContainer}>
          {filter?.user?.username && (
            <Chip
              className={classes.chip}
              label={`@${filter?.user?.username}`}
              size="small"
              onDelete={() => clearFilter()}
            />
          )}
          {filter?.followingOnly && (
            <Chip
              className={classes.chip}
              label={"Following Only"}
              size="small"
              onDelete={() => clearFilter()}
            />
          )}
          {filter?.tag?.title && (
            <Chip
              className={classes.chip}
              label={`#${filter?.tag?.title}`}
              size="small"
              onDelete={() => clearFilter()}
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
        <ViewPostDialog storyId={selectedStoryId} closePost={handleClosePost} />
      )}
      {isCreatePostFormOpen && <CreatePostForm closeForm={handleCloseForm} />}
      <Fab
        color="primary"
        className={classes.fab}
        onClick={() => setIsCreatePostFormOpen(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
