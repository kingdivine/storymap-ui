import { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Switch,
  FormControlLabel,
  DialogActions,
  Button,
  Chip,
  OutlinedInput,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import LocationSearch from "./LocationSearch";
import axios from "axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    form: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    },
  })
);

const STORY_CONTENT_CHAR_LIMIT = 10000;
const STORY_TITLE_CHAR_LIMIT = 80;
const TAG_CHAR_LIMIT = 30;
const TAGS_COUNT_LIMIT = 3;

export default function CreatePostForm(props: { closeForm: () => void }) {
  const classes = useStyles();
  let history = useHistory();

  const [currentUser] = useCurrentUser();

  //form values
  const [title, setTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [location, setLocation] = useState<[number, number]>();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  //submission state
  const [isLoading, setIsLoading] = useState(false);
  const [postError, setPostError] = useState("");

  const handleTagInputKeyUp = (event: any) => {
    if (event.key === "Enter" || event.key === " ") {
      let newTag = "";
      if (event.target.value.startsWith("#")) {
        newTag = event.target.value.split("#")[1]?.trim();
      } else {
        newTag = event.target.value.trim();
      }

      if (
        newTag?.length > 0 &&
        !tags.includes(newTag) &&
        tags.length < TAGS_COUNT_LIMIT
      ) {
        setTags([...tags, newTag]);
      }
      event.target.value = null;
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const canPost = () =>
    content.length > 0 &&
    content.length <= STORY_CONTENT_CHAR_LIMIT &&
    title.length > 0 &&
    title.length <= STORY_TITLE_CHAR_LIMIT &&
    placeName &&
    tags.length <= TAGS_COUNT_LIMIT &&
    tags.every((tag) => tag.length > 0 && tag.length <= TAG_CHAR_LIMIT) &&
    location;

  const handlePostSubmit = () => {
    setIsLoading(true);
    setPostError("");
    axios
      .post(
        "/storymap-api/stories",
        {
          title,
          content,
          placeName,
          isPrivate,
          tags,
          location: `${location![1]},${location![0]}`,
        },
        {
          headers: {
            authorization: `Bearer ${currentUser?.token}`, //TODO: replace with !
          },
        }
      )
      .then((result) => {
        history.push(`/story/${result.data.slug}`);
        props.closeForm();
      })
      .catch((e) => {
        setPostError("Oops! Something went wrong.");
        setIsLoading(false);
      });
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        onClose={props.closeForm}
      >
        <DialogTitle>
          <div className={classes.topLineContainer}>
            <Typography variant="h6">Create Post</Typography>
            <IconButton onClick={props.closeForm}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          <div className={classes.form}>
            <TextField
              placeholder="Title"
              value={title}
              onChange={(e) =>
                e.target.value.length <= STORY_TITLE_CHAR_LIMIT &&
                setTitle(e.target.value)
              }
              style={{ marginBottom: 16 }}
            />
            <LocationSearch
              placeHolderText={"Enter location..."}
              textFieldWidth={400}
              onLocationSelect={(coords, place) => {
                setLocation(coords);
                setPlaceName(place);
              }}
            />
            <TextField
              value={content}
              onChange={(e) =>
                e.target.value.length <= STORY_CONTENT_CHAR_LIMIT &&
                setContent(e.target.value)
              }
              style={{ marginTop: 8 }}
              multiline
              placeholder={"Tell your story..."}
              variant="outlined"
              rows={8}
              rowsMax={8}
              helperText={
                content.length > STORY_CONTENT_CHAR_LIMIT * 0.75
                  ? `${content.length}/${STORY_CONTENT_CHAR_LIMIT} characters.`
                  : null
              }
            />
            <OutlinedInput
              onKeyUp={handleTagInputKeyUp}
              inputProps={{ maxLength: TAG_CHAR_LIMIT }}
              style={{ maxWidth: "100%", marginTop: 8 }}
              disabled={tags.length === TAGS_COUNT_LIMIT}
              startAdornment={tags.map((tag, index) => (
                <Chip
                  key={index}
                  style={{ margin: 2 }}
                  variant="outlined"
                  label={tag.startsWith("#") ? tag : `#${tag}`}
                  size="small"
                  onDelete={() => handleTagDelete(tag)}
                />
              ))}
              placeholder={tags.length === 0 ? "#tags #go #here" : undefined}
            />

            <FormControlLabel
              style={{ marginTop: 8, width: "fit-content" }}
              control={
                <Switch
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  color="primary"
                />
              }
              label="Private (only you can see this Story)"
            />
          </div>
          <Typography style={{ margin: 16 }} color={"error"}>
            {postError}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            variant={"contained"}
            color={"primary"}
            style={{ margin: 8 }}
            disabled={!canPost() || isLoading}
            onClick={() => handlePostSubmit()}
          >
            {isLoading ? <CircularProgress size={20} /> : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
