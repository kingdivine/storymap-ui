import { useState, useEffect } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { isMobile } from "../utils";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import RemoveIcon from "@material-ui/icons/Clear";

const smallScreen = isMobile();
const THUMBNAIL_SIZE = smallScreen ? 75 : 100;
const FILE_SIZE_LIMIT = 5000000; //5MB
const MAX_IMAGES = 3;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbnailContainer: {
      display: "flex",
      flexDirection: "row",
    },
    thumbnailAndRemoveBtn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    thumbnail: {
      width: `${THUMBNAIL_SIZE}px`,
      height: `${THUMBNAIL_SIZE}px`,
      margin: "5px 5px 0px 0px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: theme.palette.common.white,
      backgroundPosition: "center center",
      backgroundSize: "cover",
    },
    removeBtn: {
      height: "3px",
      width: "3px",
      marginTop: "3px",
      color: theme.palette.secondary.main,
    },
  })
);

export default function ImageUpload() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageObjectUrls, setImageObjectUrls] = useState<
    { name: string; url: string }[]
  >([]);
  const [errorText, setErrorText] = useState("");

  const classes = useStyles();

  useEffect(() => {
    const urlsToSet = imageFiles.map((image) => ({
      name: image.name,
      url: URL.createObjectURL(image),
    }));
    setImageObjectUrls(urlsToSet);
  }, [imageFiles]);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorText("");
    const files = e.target.files as FileList;
    const fileArr = Array.from(files).map((file) => file);
    const validSizes = fileArr.every((file) => file.size <= FILE_SIZE_LIMIT);
    if (!validSizes) {
      setErrorText(
        "Max file size of 5MB exceed. One or more of your images are too big."
      );
    } else {
      setImageFiles(imageFiles.concat(fileArr));
    }
  };

  const handleRemoveClick = (imageName: string) => {
    const updatedImageFiles = imageFiles.filter(
      (image) => image.name !== imageName
    );
    setImageFiles(updatedImageFiles);
  };

  return (
    <>
      <div>
        <label htmlFor="image-upload-input">
          <Button
            variant="outlined"
            size="small"
            component="span"
            startIcon={<PhotoCamera />}
            disabled={imageFiles.length === MAX_IMAGES}
          >
            Add Images
          </Button>
        </label>
        <input
          id="image-upload-input"
          type="file"
          style={{ display: "none" }}
          multiple
          accept="image/*"
          onChange={onImageUpload}
          disabled={imageFiles.length === MAX_IMAGES}
        />
      </div>

      <div className={classes.thumbnailContainer}>
        {imageObjectUrls.map((image) => (
          <div className={classes.thumbnailAndRemoveBtn}>
            <div
              className={classes.thumbnail}
              style={{
                backgroundImage: `url('${image.url}')`,
              }}
              title={image.url}
            />

            <IconButton
              className={classes.removeBtn}
              onClick={() => handleRemoveClick(image.name)}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        ))}
      </div>
      {errorText && (
        <Typography variant="caption" color="error">
          {errorText}
        </Typography>
      )}

      {!errorText && imageFiles.length === MAX_IMAGES && (
        <Typography variant="caption" color="textPrimary">
          Max of 3 images added.
        </Typography>
      )}
    </>
  );
}
