import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UsernameAndPic from "../Generic/UsernameandPic";
import { useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import NavBar from "../Generic/Navbar";

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
    sectionBody: {
      "&>*": {
        margin: theme.spacing(1),
      },
    },
    btn: {
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
              Account Details
            </Typography>
            <div className={classes.sectionBody}>
              <Typography color="textPrimary">{currentUser.email}</Typography>
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
