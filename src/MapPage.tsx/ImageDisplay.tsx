import { imageApiUrl } from "../utils";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import fallBackStoryImage from "../Generic/images/broken-image.png";
import { isMobile } from "../utils";

const smallScreen = isMobile();

const IMAGE_HEIGHT = smallScreen ? 300 : 400;

export default function ImageDisplay(props: { imageIds: string[] }) {
  const { imageIds } = props;

  return (
    <div style={{ marginBottom: 16 }}>
      <Carousel
        autoPlay={false}
        showStatus={false}
        showThumbs={false}
        showIndicators={imageIds.length > 1}
      >
        {props.imageIds.map((imageId, idx) => (
          <div
            key={imageId}
            style={{
              height: IMAGE_HEIGHT,
            }}
          >
            <img
              src={`${imageApiUrl}/${imageId}`}
              alt={imageId}
              style={{ height: "100%", width: "auto" }}
              onError={(e) => (e.currentTarget.src = fallBackStoryImage)}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
