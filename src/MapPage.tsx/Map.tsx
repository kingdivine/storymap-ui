import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl2aW5lYSIsImEiOiJja24wZ2lqbjkwY2J4Mm9scnY3bW1yZW5nIn0.GkVgq5TQlU19vuZLwggtjQ";
const MAP_THEME = "mapbox://styles/mapbox/dark-v10";

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
  const [long, setLong] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
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
