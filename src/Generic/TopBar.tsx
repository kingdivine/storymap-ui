import { useCurrentUser } from "../hooks/useCurrentUser";
import { createStyles, Theme, Button, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      position: "fixed",
      right: theme.spacing(5),
      top: theme.spacing(4),
      zIndex: 1,
      display: "flex",
      flexDirection: "row",
    },
    navLinkBtn: {
      textTransform: "lowercase",
      color: theme.palette.common.white,
    },
  })
);

export default function TopBar(props: { notificationsCount: number }) {
  const classes = useStyles();
  const { notificationsCount } = props;

  const [currentUser] = useCurrentUser();

  return (
    <>
      <header className={classes.navBar}>
        {currentUser && (
          <Badge
            badgeContent={notificationsCount}
            max={99}
            showZero={false}
            color="secondary"
            style={{ marginRight: notificationsCount > 0 ? 16 : 0 }}
          >
            <Button
              className={classes.navLinkBtn}
              href="/notifications"
              startIcon={<NotificationsActiveIcon />}
            >
              notifications
            </Button>
          </Badge>
        )}

        {currentUser && (
          <Button
            className={classes.navLinkBtn}
            href={`/users/${currentUser.username}`}
            startIcon={<FaceIcon />}
          >
            my profile
          </Button>
        )}

        {!currentUser && (
          <Button
            className={classes.navLinkBtn}
            href={`/login`}
            startIcon={<PersonPinIcon />}
          >
            login or sign up
          </Button>
        )}

        <Button
          className={classes.navLinkBtn}
          href={`/about`}
          startIcon={<HelpIcon />}
        >
          about
        </Button>
      </header>
    </>
  );
}
