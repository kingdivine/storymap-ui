import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import { Story } from "../types/Story";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl2aW5lYSIsImEiOiJja24wZ2lqbjkwY2J4Mm9scnY3bW1yZW5nIn0.GkVgq5TQlU19vuZLwggtjQ";

const MAP_THEME = "mapbox://styles/mapbox/dark-v10";
const DEFAULT_LONG_LAT: mapboxgl.LngLatLike = [9, 25];
const DEFAULT_ZOOM = 1.5;

const ICON_MAPPING = {
  "boy-01": "0",
  "boy-02": "1",
  "boy-03": "2",
  "boy-04": "3",
  "boy-05": "4",
  "boy-06": "5",
  "boy-07": "6",
  "boy-08": "7",
  "boy-09": "8",
  "boy-10": "9",
  "boy-11": "10",
  "boy-12": "11",
  "boy-13": "12",
  "boy-14": "13",
  "boy-15": "14",
  "boy-16": "15",
  "boy-17": "16",
  "boy-18": "17",
  "boy-19": "18",
  "boy-20": "19",
  "boy-21": "20",
  "boy-22": "21",
  "girl-01": "22",
  "girl-02": "23",
  "girl-03": "24",
  "girl-04": "25",
  "girl-05": "26",
  "girl-06": "27",
  "girl-07": "28",
  "girl-08": "29",
  "girl-09": "30",
  "girl-10": "31",
  "girl-11": "32",
  "girl-12": "33",
  "girl-13": "34",
  "girl-14": "35",
  "girl-15": "36",
  "girl-16": "37",
  "girl-17": "38",
  "girl-18": "39",
  "girl-19": "40",
  "girl-20": "41",
  "girl-21": "42",
  "girl-22": "43",
  "girl-23": "44",
  "girl-24": "45",
  "girl-25": "46",
  "girl-26": "47",
  "cluster-pin": "48",
};
const MARKER_PNGS = Object.keys(ICON_MAPPING).map(
  (name) => require(`../Generic/images/markers/${name}-marker.png`).default
);

const useStyles = makeStyles({
  mapContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export default function Map(props: {
  posts: Story[];
  onPostClick: (storySlug: string) => void;
  onClusterClick: (postIds: string[]) => void;
  flyToLongLat: [number, number] | null;
  onFlyEnd: () => void;
}) {
  const classes = useStyles();
  const { posts, onPostClick, onClusterClick, flyToLongLat, onFlyEnd } = props;
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
        slug: post.slug,
        authorName: post.author_username,
        //@ts-ignore
        avatarIconIndex: ICON_MAPPING[post.author_avatar],
        avatar: post.author_avatar,
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
        MARKER_PNGS.map(
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
              "icon-image": ["get", "avatarIconIndex"],
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
              "icon-image": ICON_MAPPING["cluster-pin"],
              "icon-anchor": "bottom",
              "text-field": "{point_count_abbreviated} Stories",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-anchor": "top",
              "text-size": 12,
            },
            paint: {
              "text-color": "white",
            },
          });
          setIsLoaded(true);
        })
        .catch((e) => {
          console.log(e);
        });

      // Listen for post click
      map.on("click", "posts", function (e: any) {
        onPostClick(e.features[0].properties.slug);
      });

      // Listen for cluster click
      map.on("click", "cluster-count", function (e: any) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["cluster-count"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        const pointCount = features[0]?.properties?.point_count;
        const clusterSource = map.getSource("posts");

        // Get all points under a cluster
        //@ts-ignore
        clusterSource.getClusterLeaves(
          clusterId,
          pointCount,
          0,
          function (err: any, pointFeatures: mapboxgl.MapboxGeoJSONFeature[]) {
            const postIds = pointFeatures.map((pf) => pf.properties?.id);
            onClusterClick(postIds);
          }
        );
      });
    });
    // Change the cursor to a pointer when the it enters a post.
    map.on("mouseenter", "posts", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves a post.
    map.on("mouseleave", "posts", () => {
      map.getCanvas().style.cursor = "";
    });

    // Change the cursor to a pointer when the it enters a cluster.
    map.on("mouseenter", "cluster-count", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves a cluster.
    map.on("mouseleave", "cluster-count", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [map, posts, onPostClick, onClusterClick, isLoaded]);

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
