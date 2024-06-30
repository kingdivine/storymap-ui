import moment from "moment";

export const storymapApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_APP_STORYMAP_API_URL_PROD!
  : import.meta.env.VITE_APP_STORYMAP_API_URL_DEV!;

export const mapboxApiUrl = import.meta.env.VITE_APP_MAPBOX_API_URL!;
//images ultimately upload to the same bucket but dev
//points to '/image-api' locally to avoid CORS errors
export const imageApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_APP_IMAGE_API_URL_PROD!
  : import.meta.env.VITE_APP_IMAGE_API_URL_DEV!;

export const isValidEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isMobile = () => window.innerWidth < 768;

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "now",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dmo",
    y: "a year",
    yy: "%dy",
  },
});
