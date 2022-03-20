import { useState, useEffect } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
} from "@material-ui/core";
import { isMobile } from "../utils";
import { PhotoCamera } from "@material-ui/icons";

const smallScreen = isMobile();
const THUMBNAIL_SIZE = smallScreen ? 75 : 100;
const FILE_SIZE_LIMIT = 5000000; //5MB

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbnailContainer: {
      display: "flex",
      flexDirection: "row",
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
  })
);

export default function ImageUpload() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageObjectUrls, setImageObjectUrls] = useState([""]);
  const [errorText, setErrorText] = useState("");

  const classes = useStyles();

  useEffect(() => {
    const urlsToSet = imageFiles.map((image) => URL.createObjectURL(image));
    setImageObjectUrls(urlsToSet);
  }, [imageFiles]);

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      <div>
        <label htmlFor="image-upload-input">
          <Button
            variant="outlined"
            size="small"
            component="span"
            startIcon={<PhotoCamera />}
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
          onChange={onImagesChange}
        />
      </div>

      <div className={classes.thumbnailContainer}>
        {imageObjectUrls.map((url) => (
          <div
            className={classes.thumbnail}
            style={{
              backgroundImage: `url('${url}')`,
            }}
            title={url}
          ></div>
        ))}
      </div>
      <Typography variant="caption" color="error">
        {errorText}
      </Typography>
    </>
  );
}
