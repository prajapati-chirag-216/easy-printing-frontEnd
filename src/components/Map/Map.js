import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Fragment } from "react";
import Notification from "../UI/Notification";

let source;
const containerStyle = {
  with: "100%",
  height: "93vh",
};

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(showPosition);
// } else {
//   console.log("Geolocation is not supported by this browser.");
// }

// function showPosition(position) {
//   source = { lat: position.coords.latitude, lng: position.coords.longitude };
// }
source = { lat: 37.77192, lng: -122.46149 };

const Map = (props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAO4ltho_uX2XIsWk65JHlEjWOz-OMaElY",
    id: "google-map-script",
  });
  if (!isLoaded) return <p>trying to load...</p>;

  return (
    <Fragment>
      {!source && (
        <Notification message="Geolocation is not supported by this browser." />
      )}
      <GoogleMap
        zoom={10}
        center={source}
        mapContainerStyle={containerStyle}
        options={{ fullscreenControl: false, zoomControl: false }}
      >
        <Marker position={source}></Marker>
        {props.destinations.map((place) => (
          <Marker
            key={place._id}
            position={{
              lat: place.location.coordinates[1],
              lng: place.location.coordinates[0],
            }}
          ></Marker>
        ))}
      </GoogleMap>
    </Fragment>
  );
};
export default Map;
