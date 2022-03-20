import { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles, Typography } from "@material-ui/core";
import { isMobile } from "../utils";

const smallScreen = isMobile();
const THUMBNAIL_SIZE = smallScreen ? 50 : 100;
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
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: theme.palette.secondary.main,
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
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onImagesChange}
        title=""
      />
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
    </div>
  );
}
