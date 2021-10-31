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
import { useHistory } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useCurrentUser } from "../hooks/useCurrentUser";
import LoginToContinueDialog from "../Generic/LoginToContinueDialog";
import { Story } from "../types/Story";
import Navbar from "../Generic/Navbar";
import StoryClusterDialog from "./StoryClusterDialog";

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
    fab: {
      position: "fixed",
      bottom: theme.spacing(5),
      right: theme.spacing(4),
    },
  })
);

export default function MapPage() {
  const classes = useStyles();
  let history = useHistory();

  const [currentUser] = useCurrentUser();

  const [posts, setPosts] = useState<Story[]>([]);
  const [filter, setFilter] = useState<FilterObj>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [flyToLongLat, setFlyToLongLat] = useState<[number, number] | null>(
    null
  );
  const [isCreatePostFormOpen, setIsCreatePostFormOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const [selectedClusteredPostIds, setSelectedClusteredPostIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get("/storymap-api/stories/top");
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

  useEffect(() => {
    if (!filter) {
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get("/storymap-api/stories", {
          params: {
            userId: filter?.user?.id,
            tag: filter?.tag?.title,
            followingOnly: filter?.followingOnly,
            offset: 0,
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

  const handleOpenPost = useCallback(
    (storySlug: string) => {
      history.push(`/story/${storySlug}`);
    },
    [history]
  );

  const handleOpenClusteredPostsMenu = (ids: string[]) => {
    setSelectedClusteredPostIds(ids);
  };

  const handleClosePost = () => {
    history.push(`/`);
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

  const handleCreatePostClick = () => {
    if (currentUser) {
      setIsCreatePostFormOpen(true);
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <>
      {isLoading && (
        <LinearProgress className={classes.loadingBar} color={"secondary"} />
      )}

      <Heading />

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
      <Navbar fetchNotifs />
      <Map
        posts={posts}
        onPostClick={handleOpenPost}
        onClusterClick={handleOpenClusteredPostsMenu}
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
            Oops! Something went wrong.
          </Alert>
        </Snackbar>
      )}
      {history.location.pathname.includes("/story") && (
        <ViewPostDialog
          storySlug={history.location.pathname.split("/")[2]}
          closePost={handleClosePost}
        />
      )}
      {isCreatePostFormOpen && <CreatePostForm closeForm={handleCloseForm} />}
      {isLoginDialogOpen && (
        <LoginToContinueDialog
          icon={
            <AccountCircleIcon
              style={{ width: "100%", height: "100%" }}
              color={"secondary"}
            />
          }
          message={`Join Storymap to create Stories.`}
          onCloseDialog={() => setIsLoginDialogOpen(false)}
        />
      )}
      {selectedClusteredPostIds.length > 0 && (
        <StoryClusterDialog
          posts={posts.filter((post) =>
            selectedClusteredPostIds.includes(post.id)
          )}
          onCloseDialog={() => setSelectedClusteredPostIds([])}
        />
      )}
      <Fab
        color="primary"
        className={classes.fab}
        onClick={() => handleCreatePostClick()}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
