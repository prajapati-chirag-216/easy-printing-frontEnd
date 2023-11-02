import React, { Fragment, useEffect, useRef, useState } from "react";
import { Form, useActionData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getPlaces } from "../lib/api";
import Map from "../components/Map/Map";
import classes from "./MapContainer.module.css";
import Notification from "../components/UI/Notification";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";

const MapContainer = () => {
  const [destinations, setDestinations] = useState([]);
  const { showNotification } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData && actionData.status === 502) {
      dispatch(uiActions.showNotification(true));
      setTimeout(() => {
        dispatch(uiActions.showNotification(false));
      }, 4000);
      inputRef.current.focus();
    } else if (actionData && actionData.status === 200) {
      setDestinations(actionData.places);
    }
  }, [actionData]);
  return (
    <Fragment>
      {showNotification && (
        <Notification message="There is no such shops in this radius." />
      )}
      <div className={classes["map-container"]}>
        <Form className={classes["map-bar"]} method="post" action="/user/map">
          <fieldset>
            <input
              className={classes["distance-inp"]}
              placeholder="Enter Radius (meter)"
              name="radius"
              type="number"
              step={0.5}
              ref={inputRef}
            />
          </fieldset>
          <button className={classes.search} type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </Form>
      </div>
      <Map destinations={destinations} />
    </Fragment>
  );
};
export async function action({ request }) {
  let response;
  const formData = await request.formData();
  const radius = formData.get("radius");
  try {
    response = await getPlaces({ loc: [-122.46149, 37.77192], radius });
  } catch (err) {
    if (err.response && err.response.status === 502) {
      return err;
    }
    throw err;
  }
  return response;
}
export default MapContainer;
