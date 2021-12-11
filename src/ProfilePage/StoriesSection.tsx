import { useEffect, useState } from "react";
import moment from "moment";
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { Story } from "../types/Story";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { User } from "../types/User";
import { useHistory } from "react-router";
import axios from "axios";
import { storymapApiUrl } from "../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

export default function StoriesSection(props: { user: User }) {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const { user } = props;

  let history = useHistory();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
    if (currentUser?.id === user.id) {
      axios
        .get(`${storymapApiUrl}/stories/me`, {
          params: {
            offset: 0,
          },
          headers: {
            authorization: `Bearer ${currentUser.token}`,
          },
        })
        .then((response) => setStories(response.data))
        .catch((e) => {
          setIsError(true);
          console.log(e);
        })
        .finally(() => setIsLoading(false));
    } else {
      axios
        .get(`${storymapApiUrl}/stories`, {
          params: {
            userId: user.id,
            offset: 0,
          },
        })
        .then((response) => setStories(response.data))
        .catch((e) => {
          setIsError(true);
          console.log(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [currentUser, user.id]);

  if (isLoading) {
    return (
      <div style={{ margin: 16, textAlign: "center" }}>
        <CircularProgress size={20} />
      </div>
    );
  }

  if (isError) {
    return (
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
    );
  }

  if (stories.length === 0) {
    return (
      <div className={classes.noDataContainer}>
        <Typography color="secondary">It's quiet in here...</Typography>
        <Typography color="textPrimary">
          {currentUser?.id === user.id
            ? "You haven't posted any Stories yet."
            : `${user.username} hasn't posted any stories yet.`}
        </Typography>
      </div>
    );
  }

  return (
    <>
      {stories.map((story) => (
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
              {moment(story.created_at).fromNow(true)}
            </Typography>
          </div>

          <Typography variant={"body1"} color={"secondary"}>
            {story.place_name}
          </Typography>
        </div>
      ))}
    </>
  );
}
