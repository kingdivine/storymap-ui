import { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import axios from "axios";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1, 3, 0, 3),
    },
    secondLineContainer: { padding: theme.spacing(1, 3, 2, 3) },
    userNameAndPicContainer: {
      display: "flex",
      alignItems: "center",
    },
    dateAndCloseBtn: {
      display: "flex",
      alignItems: "center",
    },
    tagsContainer: {
      display: "flex",
      "&>*": {
        marginRight: theme.spacing(1),
      },
    },
  })
);

export default function ViewPostDialog(props: {
  storyId: string;
  closePost: () => void;
}) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [story, setStory] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/storymap-api/stories/${props.storyId}`
        );
        setStory(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [props.storyId]);

  return (
    <>
      {isLoading && <CircularProgress color="secondary" />}
      {isError && <div>Oops!</div>}
      {story && (
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={true}
          onClose={props.closePost}
          style={{ border: "1px solid" }}
        >
          <div>
            <div className={classes.topLineContainer}>
              <div className={classes.userNameAndPicContainer}>
                <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
                <Typography style={{ margin: 8 }}>
                  {story.author_name}
                </Typography>
              </div>
              <div className={classes.dateAndCloseBtn}>
                <Typography color={"textSecondary"}>
                  {moment(story.created_at).fromNow()}
                </Typography>
                <IconButton style={{ marginLeft: 8 }} onClick={props.closePost}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <div className={classes.secondLineContainer}>
            <Typography variant="h6" color={"secondary"}>
              {story.title}
            </Typography>
            <Typography variant="caption" color={"primary"}>
              Null Island Theme Park{/* {story.locationName} */}
            </Typography>
          </div>

          <DialogContent>
            <DialogContentText color="textPrimary">
              {story.content}
            </DialogContentText>
            <div className={classes.tagsContainer}>
              {story.tags.map((tag: string) => (
                <Typography color="primary">#{tag}</Typography>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
