import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UsernameAndPic from "../Generic/UsernameandPic";
import { useEffect, useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import NavBar from "../Generic/Navbar";
import axios from "axios";

import { User } from "../types/User";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import StoriesSection from "./StoriesSection";
import { isMobile, storymapApiUrl } from "../utils";

const smallScreen = isMobile();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: smallScreen ? "10vh" : "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "85%",
      textAlign: "center",
    },
    skeletonContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&>*": { margin: 8 },
    },
    sectionContainer: {
      maxHeight: smallScreen ? "60vh" : undefined,
      overflowY: smallScreen ? "scroll" : undefined,
    },
    section: {
      display: "flex",
      flexDirection: "column",
      textAlign: "start",
      marginTop: theme.spacing(3),
    },
    sectionBody: {
      maxHeight: "30vh",
      overflowY: "auto",
      paddingRight: theme.spacing(1),
    },
    btn: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderColor: theme.palette.common.white,
      width: "fit-content",
      alignItems: "self-start",
    },
    deleteBtn: {
      color: theme.palette.text.secondary,
    },
  })
);

export default function ProfilePage() {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useCurrentUser();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const history = useHistory();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.username === history.location.pathname.split("/")[2]) {
      setUser({
        username: currentUser.username,
        id: currentUser.id,
        avatar: currentUser.avatar,
      });
      setIsLoading(false);
    } else {
      axios
        .get(
          `${storymapApiUrl}/usersByUsername/${
            history.location.pathname.split("/")[2]
          }`
        )
        .then((response) => setUser(response.data))
        .catch((e) => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [currentUser, history.location.pathname]);

  const handleLogout = () => {
    setCurrentUser(null);
    history.push("/");
  };

  return (
    <>
      <NavBar fetchNotifs />
      <div className={classes.mainContent}>
        {isLoading && (
          <div className={classes.skeletonContainer}>
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton variant="rect" width={100} />
          </div>
        )}
        {isError && (
          <UsernameAndPic
            username={"unknown"}
            userId={"unknown"}
            avatar={"unknown"}
          />
        )}
        {user && (
          <UsernameAndPic
            username={user.username}
            userId={user.id}
            avatar={user.avatar}
          />
        )}

        <Divider style={{ margin: 8 }} />
        <div className={classes.sectionContainer}>
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
              {user && <StoriesSection user={user} />}
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
                  size={"small"}
                  className={classes.btn}
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
                <Button
                  variant="outlined"
                  size={"small"}
                  className={classes.btn}
                  startIcon={<EditIcon />}
                  href={"/get-password-reset-link"}
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}
          {user && currentUser?.id === user.id && (
            <div className={classes.section}>
              <Typography
                variant="h5"
                color="error"
                style={{ marginBottom: 8 }}
              >
                Danger Zone
              </Typography>
              <Button
                variant="outlined"
                size={"small"}
                className={`${classes.btn} ${classes.deleteBtn}`}
                startIcon={<DeleteForeverIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                DELETE ACCOUNT
              </Button>
            </div>
          )}
        </div>
      </div>
      {isDeleteDialogOpen && (
        <DeleteAccountDialog
          onCloseDialog={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
}
