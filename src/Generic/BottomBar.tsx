import { useCurrentUser } from "../hooks/useCurrentUser";
import { createStyles, Theme, Badge, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      display: "flex",
      alignItems: "center",
      zIndex: 10,
      position: "absolute",
      bottom: 0,
      backgroundColor: "black",
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
        <Badge
          badgeContent={notificationsCount}
          max={99}
          showZero={false}
          color="secondary"
        >
          <IconButton className={classes.navLinkBtn} href="/notifications">
            <NotificationsActiveIcon />
          </IconButton>
        </Badge>
      )}
      {currentUser && (
        <IconButton
          className={classes.navLinkBtn}
          href={`/users/${currentUser.username}`}
        >
          <FaceIcon />
        </IconButton>
      )}
      {!currentUser && (
        <IconButton className={classes.navLinkBtn} href={"/login"}>
          <PersonPinIcon />
        </IconButton>
      )}
      <IconButton className={classes.navLinkBtn} href="/about">
        <HelpIcon />
      </IconButton>
    </div>
  );
}
