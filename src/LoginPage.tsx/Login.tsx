import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
} from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContainer: {
      backgroundImage: `url(${mapBackground})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      border: "1px solid grey",
      boxSizing: "border-box",
      height: "100vh",
    },
    header: {
      position: "fixed",
      right: theme.spacing(5),
      top: theme.spacing(2),
    },
    loginContainer: {
      marginTop: "25vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    strapLine: {
      marginTop: -16,
    },
    button: {
      marginTop: theme.spacing(1),
      borderColor: theme.palette.common.white,
    },
    footer: {
      display: "flex",
      alignItems: "right",
      position: "fixed",
      right: theme.spacing(2),
      bottom: theme.spacing(1),
    },
    footerItem: {
      margin: theme.spacing(1),
      color: theme.palette.grey[400],
    },
  })
);

export default function LoginPage() {
  const classes = useStyles();
  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <Typography variant="body1" color={"textPrimary"}>
          What is Storymap?
        </Typography>
      </header>
      <div className={classes.loginContainer}>
        <Heading />
        <Typography
          variant="h6"
          color={"textPrimary"}
          className={classes.strapLine}
        >
          Your Online Travel Diary
        </Typography>
        <Button
          variant="outlined"
          className={classes.button}
          startIcon={<MailOutlineIcon />}
        >
          Continue with Email
        </Button>
      </div>
      <footer className={classes.footer}>
        <Typography variant="subtitle1" className={classes.footerItem}>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" className={classes.footerItem}>
          Contact
        </Typography>
        <Typography variant="subtitle1" className={classes.footerItem}>
          <span style={{ textDecoration: "underline" }}>divinebuiltthis</span>{" "}
          &#169; 2021
        </Typography>
      </footer>
    </div>
  );
}
