import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import postPinPng from "./images/post-pin.png";
import clusterPinPng from "./images/cluster-pin.png";


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
});

const markerImages = [postPinPng, clusterPinPng];
const DEFAULT_LONG_LAT: mapboxgl.LngLatLike = [9, 25];
const DEFAULT_ZOOM = 1.5;

export default function Map(props: {
  posts: any[];
  openPost: (storySlug:string) => void;
  flyToLongLat: [number, number] | null;
  onFlyEnd: () => void;
}) {
  const classes = useStyles();
  const { posts, openPost, flyToLongLat, onFlyEnd } = props;
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initialMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: MAP_THEME,
      center: DEFAULT_LONG_LAT,
      zoom: DEFAULT_ZOOM,
    });

    setMap(initialMap);

    return () => initialMap.remove();
  }, []);

  useEffect(() => {
    const features = posts.map((post) => ({
      type: "Feature",
      properties: {
        title: post.title,
        id: post.id,
        slug: post.slug
      },
      geometry: JSON.parse(post.geo_json),
    }));
    const featureCollection = {
      type: "FeatureCollection",
      features: [...features],
    };
    if (!map) return;

    if (isLoaded) {
      const source: any = map.getSource("posts");
      source.setData(featureCollection as any);
      map.flyTo({
        center: DEFAULT_LONG_LAT,
      });
      return;
    }

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
            data: featureCollection as any,
            cluster: true,
            clusterMaxZoom: 22,
            clusterRadius: 50,
          });

          // Add posts symbol layer
          map.addLayer({
            id: "posts",
            type: "symbol",
            source: "posts",
            layout: {
              "icon-image": "0",
              "icon-anchor": "bottom",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
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
              "icon-anchor": "bottom",
              "text-field": "{point_count_abbreviated} posts",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-anchor": "top",
              "text-size": 12,
            },
            paint: {
              "text-color": "#FFE600",
            },
          });
          setIsLoaded(true);
        })
        .catch((e) => {
          console.log(e);
        });

      // Display dialog
      map.on("click", "posts", function (e: any) {
        openPost(e.features[0].properties.slug);
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
  }, [map, posts, openPost, isLoaded]);

  useEffect(() => {
    if (flyToLongLat && map) {
      map.flyTo({
        center: flyToLongLat,
        zoom: 9,
        speed: 0.7,
        essential: true,
      });
      onFlyEnd();
    }
  }, [flyToLongLat, map, onFlyEnd]);

  return (
    <div>
      <div className={classes.mapContainer} ref={mapContainer} />
    </div>
  );
}
