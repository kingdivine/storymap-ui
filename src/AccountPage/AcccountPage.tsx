import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Divider,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UsernameAndPic from "../Generic/UsernameandPic";

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
    checkBoxLabel: {
      color: theme.palette.common.white,
    },
    logoutBtnContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  })
);

export default function AccountPage() {
  const classes = useStyles();
  let history = useHistory();
  const [currentUser, setCurrentUser] = useCurrentUser();

  const handleLogout = () => {
    setCurrentUser(null);
    history.push("/");
  };

  return (
    currentUser && (
      <>
        <Heading />
        <div className={classes.mainContent}>
          <UsernameAndPic
            username={currentUser.username}
            userId={currentUser.id}
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
                startIcon={<EditIcon />}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                className={classes.btn}
                color="secondary"
                startIcon={<DeleteForeverIcon />}
              >
                DELETE ACCOUNT
              </Button>
            </div>
          </div>

          <div className={classes.section}>
            <Typography
              variant="h5"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Email Preferences
            </Typography>
            <div className={classes.sectionBody}>
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    className={classes.checkBoxLabel}
                    control={<Checkbox checked={true} onChange={() => {}} />}
                    label="Notify me when I have a new friend request."
                  />
                  <FormControlLabel
                    className={classes.checkBoxLabel}
                    control={<Checkbox checked={true} onChange={() => {}} />}
                    label="Notify me of new comments and likes on my posts."
                  />
                  <FormControlLabel
                    className={classes.checkBoxLabel}
                    control={<Checkbox checked={true} onChange={() => {}} />}
                    label="Opt into very occasional (we promise!) product update emails."
                  />
                </FormGroup>
              </FormControl>
              <Button
                variant="outlined"
                className={classes.btn}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </div>
          </div>
          <div className={classes.logoutBtnContainer}>
            <Button
              variant="outlined"
              className={classes.btn}
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  );
}
