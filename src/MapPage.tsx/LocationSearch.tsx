import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { mapboxApiUrl } from "../utils";

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
  placeHolderText: string;
  textFieldWidth: number;
  onLocationSelect: (longLat: [number, number], placeName: string) => void;
  darken?: boolean;
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
          url: `${mapboxApiUrl}/geocoding/v5/mapbox.places/${searchString}.json`,
          params: {
            access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!,
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
        style={{
          width: props.textFieldWidth,
          background: props.darken ? "rgba(0,0,0,0.5)" : undefined,
        }}
        size={"small"}
        getOptionLabel={(option) => option.place_name}
        options={options}
        autoComplete
        onChange={(event: any, newValue: MapboxGeocodeLocation | null) => {
          const coords = newValue?.geometry.coordinates as [number, number];
          if (coords) {
            props.onLocationSelect(coords, newValue?.place_name ?? "Unknown");
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
          <TextField
            {...params}
            label={props.placeHolderText}
            variant="outlined"
          />
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
