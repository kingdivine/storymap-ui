import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

type Bbox = [number, number, number, number];

export interface MapboxGeocodeLocation extends GeoJSON.Feature<GeoJSON.Point> {
  bbox: Bbox;
  center: [number, number];
  place_name: string;
  place_type: string[];
  relevance: number;
  text: string;
}

export default function LocationSearch(props: {
  onLocationSelect: (longLat: [number, number]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<MapboxGeocodeLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setOptions([]);
      return;
    }
    const timeoutID = setTimeout(() => {
      fetchData(searchTerm.trim());
    }, 500);

    const fetchData = async (searchString: string) => {
      setIsLoading(true);
      try {
        const response = await axios({
          url: `/mapbox-api/geocoding/v5/mapbox.places/${searchString}.json`,
          params: {
            access_token:
              "pk.eyJ1IjoiZGl2aW5lYSIsImEiOiJja24wZ2lqbjkwY2J4Mm9scnY3bW1yZW5nIn0.GkVgq5TQlU19vuZLwggtjQ",
          },
        });
        setOptions(response.data.features);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchTerm]);

  return (
    <>
      <Autocomplete
        style={{ width: 150 }}
        size={"small"}
        getOptionLabel={(option) => option.place_name}
        options={options}
        autoComplete
        onChange={(event: any, newValue: MapboxGeocodeLocation | null) => {
          const coords = newValue?.geometry.coordinates as [number, number];
          if (coords) {
            props.onLocationSelect(coords);
          }
        }}
        getOptionSelected={(option, value) => option.id === value.id}
        onInputChange={(event, newSearchTerm) => {
          setSearchTerm(newSearchTerm);
        }}
        popupIcon={null}
        noOptionsText={"No locations found."}
        loading={isLoading}
        renderInput={(params) => (
          <TextField {...params} label="Fly to..." variant="outlined" />
        )}
        renderOption={(option) => (
          <div>
            <Typography variant="body1">{option.text}</Typography>
            <Typography variant="body2" color="textSecondary">
              {option.place_name}
            </Typography>
          </div>
        )}
      />
    </>
  );
}
