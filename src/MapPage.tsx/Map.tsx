import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import dummyData from "./data.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl2aW5lYSIsImEiOiJja24wZ2lqbjkwY2J4Mm9scnY3bW1yZW5nIn0.GkVgq5TQlU19vuZLwggtjQ";
const MAP_THEME = "mapbox://styles/mapbox/dark-v10";

const mock: any = dummyData;

const useStyles = makeStyles({
  mapContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  infoBar: {
    backgroundColor: "rgba(35, 55, 75, 0.9)",
    color: "#ffffff",
    padding: "6px 12px",
    font: "15px/24px monospace",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    margin: "12px",
    borderRadius: "4px",
  },
});

export default function Map() {
  const classes = useStyles();
  const mapContainer = useRef(null);
  const [long, setLong] = useState(70.048828125);
  const [lat, setLat] = useState(44.809121700077355);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: MAP_THEME,
      center: [long, lat],
      zoom: zoom,
    });
    map.on("move", () => {
      const newLong = parseFloat(map.getCenter().lng.toFixed(4));
      const newLat = parseFloat(map.getCenter().lat.toFixed(4));
      const newZoom = parseFloat(map.getCenter().lat.toFixed(2));
      setLong(newLong);
      setLat(newLat);
      setZoom(newZoom);
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image!);
          // Add a GeoJSON source
          map.addSource("posts", {
            type: "geojson",
            data: mock,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          // Add a symbol layer
          map.addLayer({
            id: "posts",
            type: "symbol",
            source: "posts",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
              "text-size": 12,
            },
            paint: {
              "text-color": "white",
            },
          });
        }
      );
    });
    return () => map.remove();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className={classes.infoBar}>
        Longitude: {long} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className={classes.mapContainer} ref={mapContainer} />
    </div>
  );
}
