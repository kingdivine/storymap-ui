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
import { imageApiUrl, isMobile, storymapApiUrl } from "../utils";
import ImageUpload from "./ImageUpload";

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
const IMAGE_SIZE_LIMIT = 5000000; //5MB
const IMAGE_COUNT_LIMIT = 3;

interface PresignedPostUrlResponse {
  url: string;
  fields: {
    key: string;
    acl: string;
    bucket: string;
  };
  filePath: string;
}

export default function CreatePostForm(props: { closeForm: () => void }) {
  const classes = useStyles();
  let history = useHistory();

  const [currentUser] = useCurrentUser();

  //form state
  const [title, setTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [location, setLocation] = useState<[number, number]>();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  //image state
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  //submission state
  const [isLoading, setIsLoading] = useState(false);
  const [postError, setPostError] = useState("");

  //tag handlers
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

  //image handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const fileArr = Array.from(files).map((file) => file);
    setImageFiles(imageFiles.concat(fileArr));
  };

  const handleRemoveImageClick = (fileName: string) => {
    const updatedImageFiles = imageFiles.filter(
      (imageFile) => imageFile.name !== fileName
    );
    setImageFiles(updatedImageFiles);
  };

  //form posting
  const canPost = () =>
    content.length > 0 &&
    content.length <= STORY_CONTENT_CHAR_LIMIT &&
    title.length > 0 &&
    title.length <= STORY_TITLE_CHAR_LIMIT &&
    placeName &&
    tags.length <= TAGS_COUNT_LIMIT &&
    tags.every((tag) => tag.length > 0 && tag.length <= TAG_CHAR_LIMIT) &&
    imageFiles.every((file) => file.size <= IMAGE_SIZE_LIMIT) &&
    imageFiles.length <= IMAGE_COUNT_LIMIT &&
    location;

  const handlePostSubmit = async () => {
    setIsLoading(true);
    setPostError("");

    try {
      let imageIds: string[] = [];
      //fetch presigned urls
      if (imageFiles.length > 0) {
        const { data: presignedPostUrls } = await axios.get<
          PresignedPostUrlResponse[]
        >(
          `${storymapApiUrl}/images/presign?count=${imageFiles.length}&isPrivate=${isPrivate}`,
          {
            headers: {
              authorization: `Bearer ${currentUser!.token}`,
            },
          }
        );

        let formDatum: FormData[] = [];
        presignedPostUrls.forEach((url, i) => {
          const formData = new FormData();
          formData.append("Content-Type", "multipart/form-data");
          Object.entries(url.fields).forEach(([k, v]) => {
            formData.append(k, v);
          });
          formData.append("file", imageFiles[i]);
          formDatum.push(formData);
          imageIds.push(url.fields.key);
        });

        await Promise.all(
          formDatum.map((data, i) =>
            axios({
              method: "post",
              url: imageApiUrl,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data,
            })
          )
        );
      }

      const newPost = await axios.post(
        `${storymapApiUrl}/stories`,
        {
          title,
          content,
          placeName,
          isPrivate,
          tags,
          location: `${location![1]},${location![0]}`,
          imageIds,
        },
        {
          headers: {
            authorization: `Bearer ${currentUser?.token}`, //TODO: replace with !
          },
        }
      );
      history.push(`/story/${newPost.data.slug}`);
      props.closeForm();
    } catch (e) {
      console.log(e);
      setPostError("Oops! Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        fullScreen={isMobile()}
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        onClose={props.closeForm}
      >
        <DialogTitle>
          <div className={classes.topLineContainer}>
            <Typography variant="h6">Create Story</Typography>
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
              textFieldWidth={isMobile() ? 200 : 400}
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
              minRows={8}
              maxRows={8}
              helperText={
                content.length > STORY_CONTENT_CHAR_LIMIT * 0.75
                  ? `${content.length}/${STORY_CONTENT_CHAR_LIMIT} characters.`
                  : null
              }
            />
            <div style={{ marginTop: 8 }}>
              <ImageUpload
                imageSizeLimit={IMAGE_SIZE_LIMIT}
                imageCountLimit={IMAGE_COUNT_LIMIT}
                imageFiles={imageFiles}
                handleImageUpload={handleImageUpload}
                handleRemoveImageClick={handleRemoveImageClick}
              />
            </div>
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
