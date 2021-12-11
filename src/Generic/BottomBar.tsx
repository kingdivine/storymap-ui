import { useCurrentUser } from "../hooks/useCurrentUser";
import { createStyles, Theme, Badge, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import MapIcon from "@material-ui/icons/Map";
import HelpIcon from "@material-ui/icons/Help";
import { useHistory } from "react-router";

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
      justifyContent: "space-around",
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
  const history = useHistory();
  const page = history.location.pathname.split("/")[1];

  const [currentUser] = useCurrentUser();

  return (
    <div className={classes.navBar}>
      {currentUser && (
        <>
          <IconButton
            className={classes.navLinkBtn}
            href={`/users/${currentUser.username}`}
          >
            <FaceIcon
              color={page === "users" ? "secondary" : "inherit"}
              fontSize={"large"}
            />
          </IconButton>
        </>
      )}
      {!currentUser && (
        <>
          <IconButton className={classes.navLinkBtn} href={"/login"}>
            <PersonPinIcon fontSize={"large"} />
          </IconButton>
        </>
      )}
      <IconButton className={classes.navLinkBtn} href="/">
        <MapIcon
          color={page === "" ? "secondary" : "inherit"}
          fontSize={"large"}
        />
      </IconButton>

      {currentUser ? (
        <>
          <Badge
            badgeContent={notificationsCount}
            max={99}
            showZero={false}
            color="secondary"
          >
            <IconButton className={classes.navLinkBtn} href="/notifications">
              <NotificationsActiveIcon
                color={page === "notifications" ? "secondary" : "inherit"}
                fontSize={"large"}
              />
            </IconButton>
          </Badge>
        </>
      ) : (
        <IconButton className={classes.navLinkBtn} href="/about">
          <HelpIcon
            color={page === "about" ? "secondary" : "inherit"}
            fontSize={"large"}
          />
        </IconButton>
      )}
    </div>
  );
}
