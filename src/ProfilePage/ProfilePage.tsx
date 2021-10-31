import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UsernameAndPic from "../Generic/UsernameandPic";
import { useEffect, useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import NavBar from "../Generic/Navbar";
import { Story } from "../types/Story";
import axios from "axios";
import moment from "moment";
import { User } from "../types/User";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
      textAlign: "center",
    },
    skeletonContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&>*": { margin: 8 },
    },
    section: {
      display: "flex",
      flexDirection: "column",
      textAlign: "start",
      marginTop: theme.spacing(3),
    },
    sectionBody: { maxHeight: "30vh", overflowY: "scroll" },
    noDataContainer: {
      textAlign: "center",
      margin: theme.spacing(1),
    },
    listItem: {
      marginBottom: theme.spacing(1),
      "&:hover": {
        background: theme.palette.background.paper,
      },
      cursor: "pointer",
    },
    listItemTopLine: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    btn: {
      marginRight: theme.spacing(1),
      borderColor: theme.palette.common.white,
      width: "fit-content",
    },
    deleteBtn: {
      color: theme.palette.text.secondary,
    },
  })
);

export default function ProfilePage() {
  const classes = useStyles();
  let history = useHistory();

  const [currentUser, setCurrentUser] = useCurrentUser();
  const [user, setUser] = useState<User>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isUserError, setIsUserError] = useState(false);

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [isStoriesError, setIsStoriesError] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //get user
  useEffect(() => {
    if (currentUser?.username === history.location.pathname.split("/")[2]) {
      setUser({
        username: currentUser.username,
        id: currentUser.id,
        avatar: currentUser.avatar,
      });
      setIsLoadingUser(false);
    } else {
      axios
        .get(
          `/storymap-api/usersByUsername/${
            history.location.pathname.split("/")[2]
          }`
        )
        .then((response) => setUser(response.data))
        .catch((e) => setIsUserError(true))
        .finally(() => setIsLoadingUser(false));
    }
  }, [currentUser, history.location.pathname]);

  //get stories
  useEffect(() => {
    if (!user) {
      return;
    }

    setIsStoriesError(false);
    setIsLoadingStories(true);
    axios
      .get("/storymap-api/stories", {
        params: {
          userId: user.id,
          offset: 0,
        },
      })
      .then((response) => setStories(response.data))
      .catch((e) => {
        setIsStoriesError(true);
        console.log(e);
      })
      .finally(() => setIsLoadingStories(false));
  }, [user]);

  const handleLogout = () => {
    setCurrentUser(null);
    history.push("/");
  };

  return (
    <>
      <NavBar fetchNotifs />
      <div className={classes.mainContent}>
        {isLoadingUser && (
          <div className={classes.skeletonContainer}>
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton variant="rect" width={100} />
          </div>
        )}
        {isUserError && (
          <UsernameAndPic
            username={"unknown"}
            userId={"unknown"}
            avatar={"unknown"}
          />
        )}
        {!isLoadingUser && !isUserError && user && (
          <UsernameAndPic
            username={user.username}
            userId={user.id}
            avatar={user.avatar}
          />
        )}

        <Divider style={{ margin: 8 }} />
        <div className={classes.section}>
          {user && (
            <Typography
              variant="h5"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Stories
            </Typography>
          )}

          <div className={classes.sectionBody}>
            {isStoriesError && (
              <div style={{ textAlign: "center" }}>
                <Typography
                  style={{ marginTop: 8, alignSelf: "center" }}
                  color={"error"}
                >
                  Oops! Something went wrong.
                </Typography>
                <Typography
                  style={{
                    marginTop: 8,
                    marginBottom: 24,
                    alignSelf: "center",
                  }}
                  color={"textPrimary"}
                >
                  Please check your internet connection and try again later.
                </Typography>
              </div>
            )}
            {isLoadingStories && (
              <div style={{ margin: 16, textAlign: "center" }}>
                <CircularProgress size={20} />
              </div>
            )}
            {!isStoriesError &&
              !isLoadingStories &&
              stories.length === 0 &&
              user && (
                <div className={classes.noDataContainer}>
                  <Typography color="secondary">
                    It's quiet in here...
                  </Typography>
                  <Typography color="textPrimary">
                    {currentUser?.id === user.id
                      ? "You haven't posted any Stories yet."
                      : `${user.username} hasn't posted any stories yet.`}
                  </Typography>
                </div>
              )}
            {!isStoriesError &&
              !isLoadingStories &&
              stories.length > 0 &&
              stories.map((story) => (
                <div
                  className={classes.listItem}
                  key={story.id}
                  onClick={() => history.push(`/story/${story.slug}`)}
                >
                  <div className={classes.listItemTopLine}>
                    <Typography variant={"body1"} color={"textPrimary"}>
                      {story.title}
                    </Typography>
                    <Typography color={"textSecondary"}>
                      {moment(story.created_at).fromNow()}
                    </Typography>
                  </div>

                  <Typography variant={"body1"} color={"secondary"}>
                    {story.place_name}
                  </Typography>
                </div>
              ))}
          </div>
        </div>
        {user && currentUser?.id === user.id && (
          <div className={classes.section}>
            <Typography
              variant="h5"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Account
            </Typography>
            <div className={classes.sectionBody}>
              <Typography color="textPrimary" style={{ marginBottom: 8 }}>
                {currentUser?.email}
              </Typography>
              <Button
                variant="outlined"
                className={classes.btn}
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
              <Button
                variant="outlined"
                className={classes.btn}
                startIcon={<EditIcon />}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                className={`${classes.btn} ${classes.deleteBtn}`}
                startIcon={<DeleteForeverIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                DELETE ACCOUNT
              </Button>
            </div>
          </div>
        )}
      </div>
      {isDeleteDialogOpen && (
        <DeleteAccountDialog
          onCloseDialog={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
}
