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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
      textAlign: "center",
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

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const response = await axios.get("/storymap-api/stories", {
          params: {
            userId: currentUser?.id,
            offset: 0,
          },
        });
        setStories(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.username, currentUser?.id]);

  const handleLogout = () => {
    setCurrentUser(null);
    history.push("/");
  };

  return (
    currentUser && (
      <>
        <NavBar fetchNotifs />

        <div className={classes.mainContent}>
          <UsernameAndPic
            username={currentUser.username}
            userId={currentUser.id}
            avatar={currentUser.avatar}
          />
          <Divider style={{ margin: 8 }} />
          <div className={classes.section}>
            <Typography
              variant="h5"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Stories
            </Typography>
            <div className={classes.sectionBody}>
              {isError && (
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
              {isLoading && (
                <div style={{ margin: 16, textAlign: "center" }}>
                  <CircularProgress size={20} />
                </div>
              )}
              {!isError && !isLoading && stories.length === 0 && (
                <div className={classes.noDataContainer}>
                  <Typography color="secondary">
                    It's quiet in here...
                  </Typography>
                  <Typography color="textPrimary">
                    You haven't posted any Stories yet.
                  </Typography>
                </div>
              )}
              {!isError &&
                !isLoading &&
                stories.length > 0 &&
                [...stories, ...stories, ...stories, ...stories].map(
                  (story) => (
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
                  )
                )}
            </div>
          </div>
          <div className={classes.section}>
            <Typography
              variant="h5"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Account Details
            </Typography>
            <div className={classes.sectionBody}>
              <Typography color="textPrimary" style={{ marginBottom: 8 }}>
                {currentUser.email}
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
        </div>
        {isDeleteDialogOpen && (
          <DeleteAccountDialog
            onCloseDialog={() => setIsDeleteDialogOpen(false)}
          />
        )}
      </>
    )
  );
}
