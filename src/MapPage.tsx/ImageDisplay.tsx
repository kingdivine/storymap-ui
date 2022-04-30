import { imageApiUrl } from "../utils";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function ImageDisplay(props: { imageIds: string[] }) {
  const { imageIds } = props;

  return (
    <div>
      <Carousel
        autoPlay={false}
        showStatus={false}
        showThumbs={false}
        showIndicators={imageIds.length > 1}
      >
        {props.imageIds.map((imageId, idx) => (
          <div>
            {/* TODO: image on load start and image on error 
              https://dev.to/elisabethleonhardt/configure-fallback-images-in-react-and-nextjs-54ej*/}
            <img src={`${imageApiUrl}/${imageId}`} alt={imageId} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
