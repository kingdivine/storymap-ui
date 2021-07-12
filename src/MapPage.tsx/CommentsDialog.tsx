import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Comment } from "../types/Comment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8,
    },
  })
);

export default function CommentsDialog(props: {
  storyId: string;
  onClose: () => void;
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/storymap-api/stories/${props.storyId}/comments`
        );
        setComments(response.data);
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
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={true}
      onClose={props.onClose}
      style={{ border: "1px solid" }}
    >
      <div className={classes.topLineContainer}>
        <IconButton onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {isLoading && (
        <CircularProgress
          className={classes.loadingIndicator}
          color="secondary"
        />
      )}
      {isError && <div>Oops!</div>}
      {!isError && !isLoading && (
        <>
          <Typography>{comments.length} comments </Typography>
        </>
      )}
    </Dialog>
  );
}
