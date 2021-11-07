import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  Theme,
  Badge,
  IconButton,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      zIndex: 10,
      position: "fixed",
      bottom: 0,
      height: 55,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: theme.palette.grey[900],
      borderTop: `1px solid ${theme.palette.grey[700]}`,
    },
    navLinkBtn: {
      textTransform: "lowercase",
      color: theme.palette.common.white,
    },
  })
);

export default function BottomBar(props: { notificationsCount: number }) {
  const classes = useStyles();
  const { notificationsCount } = props;

  const [currentUser] = useCurrentUser();

  return (
    <div className={classes.navBar}>
      {currentUser && (
        <>
          <Badge
            badgeContent={notificationsCount}
            max={99}
            showZero={false}
            color="secondary"
          >
            <IconButton className={classes.navLinkBtn} href="/notifications">
              <NotificationsActiveIcon fontSize={"large"} />
            </IconButton>
          </Badge>
          <Divider orientation="vertical" variant="middle" />
        </>
      )}
      {currentUser && (
        <>
          <IconButton
            className={classes.navLinkBtn}
            href={`/users/${currentUser.username}`}
          >
            <FaceIcon fontSize={"large"} />
          </IconButton>
          <Divider orientation="vertical" variant="middle" />
        </>
      )}
      {!currentUser && (
        <>
          <IconButton className={classes.navLinkBtn} href={"/login"}>
            <PersonPinIcon fontSize={"large"} />
          </IconButton>
          <Divider orientation="vertical" variant="middle" />
        </>
      )}

      <IconButton className={classes.navLinkBtn} href="/about">
        <HelpIcon fontSize={"large"} />
      </IconButton>
    </div>
  );
}
