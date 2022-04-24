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

export default function ImageUpload(props: {
  imageSizeLimit: number;
  imageCountLimit: number;
  imageFiles: File[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImageClick: (fileName: string) => void;
}) {
  const classes = useStyles();

  return (
    <>
      <div>
        <label htmlFor="image-upload-input">
          <Button
            variant="outlined"
            size="small"
            component="span"
            startIcon={<PhotoCamera />}
            disabled={props.imageFiles.length >= props.imageCountLimit}
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
          onChange={(e) => props.handleImageUpload(e)}
          disabled={props.imageFiles.length >= props.imageCountLimit}
        />
      </div>

      <div className={classes.thumbnailContainer}>
        {props.imageFiles
          .map((image) => ({
            name: image.name,
            url: URL.createObjectURL(image),
          }))
          .map((image) => (
            <div key={image.url} className={classes.thumbnailAndRemoveBtn}>
              <div
                className={classes.thumbnail}
                style={{
                  backgroundImage: `url('${image.url}')`,
                }}
                title={image.url}
              />

              <IconButton
                className={classes.removeBtn}
                onClick={() => props.handleRemoveImageClick(image.name)}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          ))}
      </div>
      {props.imageFiles.some((file) => file.size > props.imageSizeLimit) && (
        <Typography variant="caption" color="error">
          Max file size of 5MB exceed. One or more of your images are too big.
        </Typography>
      )}
      {props.imageFiles.length > props.imageCountLimit && (
        <Typography variant="caption" color="error">
          Too many images. Add 3 or less.
        </Typography>
      )}

      {props.imageFiles.length === props.imageCountLimit && (
        <Typography variant="caption" color="textPrimary">
          Max of 3 images added.
        </Typography>
      )}
    </>
  );
}
