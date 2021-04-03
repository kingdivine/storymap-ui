import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import postPinPng from "./post-pin.png";
import clusterPinPng from "./cluster-pin.png";

import dummyData from "./data.json";
import { render } from "react-dom";
import Post from "./Post";

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

const markerImages = [postPinPng, clusterPinPng];

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

    map.on("load", () => {
      // Add an image to use as a custom marker
      Promise.all(
        markerImages.map(
          (img, idx) =>
            new Promise<void>((resolve, reject) => {
              map.loadImage(img, (error, res) => {
                if (error) throw error;
                map.addImage(idx.toString(), res!);
                resolve();
              });
            })
        )
      )
        .then(() => {
          // Add data source
          map.addSource("posts", {
            type: "geojson",
            data: mock,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 100,
          });

          // Add posts symbol layer
          map.addLayer({
            id: "posts",
            type: "symbol",
            source: "posts",
            layout: {
              "icon-image": "0",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 2],
              "text-anchor": "top",
              "text-size": 12,
            },
            paint: {
              "text-color": "white",
            },
          });

          // Add clusters symbol layer
          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "posts",
            filter: ["has", "point_count"],
            layout: {
              "icon-image": "1",
              "text-field": "{point_count_abbreviated} posts",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 16,
              "text-offset": [0, 2],
            },
            paint: {
              "text-color": "#FFE600",
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });

      // Pan to a post onclick and display popup
      map.on("click", "posts", function (e: any) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const placeholder = document.createElement("div");
        render(<Post />, placeholder);
        let openPopup = true;

        map.flyTo({
          center: [
            e.features[0].geometry.coordinates[0],
            e.features[0].geometry.coordinates[1] - 0.2,
          ],
        });

        map.on("moveend", function (e) {
          if (openPopup) {
            new mapboxgl.Popup({ closeOnMove: true, closeButton: false })
              .setMaxWidth("400")
              .setLngLat(coordinates)
              .setDOMContent(placeholder)
              .addTo(map);
            openPopup = false;
          }
        });
      });

      // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
      map.on("mouseenter", "posts", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "posts", () => {
        map.getCanvas().style.cursor = "";
      });
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
