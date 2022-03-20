import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import { isMobile } from "../utils";

const smallScreen = isMobile();
const THUMBNAIL_SIZE = smallScreen ? 50 : 100;

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
  const [images, setImages] = useState<File[]>([]);
  const [imageObjectUrls, setImageObjectUrls] = useState([""]);

  const classes = useStyles();

  useEffect(() => {
    const urlsToSet = images.map((image) => URL.createObjectURL(image));
    setImageObjectUrls(urlsToSet);
  }, [images]);

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const imagesToSet = Array.from(files).map((file) => file);
    setImages(images.concat(imagesToSet));
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
    </div>
  );
}
