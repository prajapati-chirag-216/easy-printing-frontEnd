import { useEffect, useState } from "react";
import File from "../components/files/File";
import classes from "./ShowFiles.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { deleteUserById, getFiles } from "../lib/api";
import { pdfConvertor } from "../lib/functions";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useSelector } from "react-redux";
import { sortFiles } from "../lib/functions";

const ShowFiles = () => {
  let FILES;
  let sortedFiles;

  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.authToken);

  const [loaderData, setLoaderData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [userData, setUserData] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const pageNo = +queryParams.get("skip") || 0;
  const isSortingDescending = queryParams.get("sort") === "desc";
  const isSortingByFiles = queryParams.get("type") === "files";

  // ------------------- for fetching users -----------------------
  useEffect(() => {
    setisLoading(true);
    async function fetchUsers() {
      try {
        const response = await getFiles(pageNo);
        return response;
      } catch (err) {
        throw err;
      }
    }
    fetchUsers()
      .then((response) => {
        setLoaderData(response);
        setIsEmpty(false);
        if (response.len === 0 && pageNo > 0) {
          navigate(
            `${location.pathname}?type=${queryParams.get(
              "type"
            )}&sort=${queryParams.get("sort")}&skip=${pageNo - 1}`
          );
        } else if (response.len === 0 && pageNo === 0) {
          setIsEmpty(true);
        }
        return response;
      })
      .catch((err) => {
        throw err;
      });
    setisLoading(false);
    //eslint-disable-next-line
  }, [pageNo, token, userData]);
  // ---------------------------------------------------------------

  if (loaderData.length !== 0 && !isEmpty) {
    FILES = loaderData.buffer_data.map((fileData) => {
      return {
        name: fileData.name,
        _id: fileData._id,
        files: pdfConvertor(fileData.files),
      };
    });
  }
  if (FILES) {
    sortedFiles = sortFiles(FILES, isSortingDescending, isSortingByFiles);
  }

  const changePageHandler = (forword) => {
    if (forword) {
      navigate(
        `${location.pathname}?type=${
          isSortingByFiles ? "files" : "time"
        }&sort=${isSortingDescending ? "desc" : "asc"}&skip=${pageNo + 1}`
      );
    } else {
      navigate(
        `${location.pathname}?type=${
          isSortingByFiles ? "files" : "time"
        }&sort=${isSortingDescending ? "desc" : "asc"}&skip=${pageNo - 1}`
      );
    }
  };

  const changeTypeHandler = () =>
    navigate(
      `${location.pathname}?type=${isSortingByFiles ? "time" : "files"}&sort=${
        isSortingDescending ? "desc" : "asc"
      }&skip=${pageNo}`
    );
  const changeSortingHandler = () =>
    navigate(
      `${location.pathname}?type=${isSortingByFiles ? "files" : "time"}&sort=${
        isSortingDescending ? "asc" : "desc"
      }&skip=${pageNo}`
    );

  const deleteUserHandler = (data) => {
    setUserData(data);
  };

  // ------------------- for deleting user -----------------------
  useEffect(() => {
    if (userData !== "") {
      setisLoading(true);
      async function removeUser() {
        try {
          const data = { id: userData };
          const response = await deleteUserById(data);
          return response;
        } catch (err) {
          throw err;
        }
      }
      removeUser()
        .then((response) => {
          if (response.success) {
            setUserData("");
          }
        })
        .catch((err) => {
          throw err;
        });
      setisLoading(false);
    }
  }, [userData]);

  return (
    <div className={classes.container}>
      <div className={classes.sorting}>
        <div className={classes.selector}>
          <button onClick={changeTypeHandler}>
            Sort By {isSortingByFiles ? "Time" : "Files"}
          </button>
          <button onClick={changeSortingHandler}>
            Sort {isSortingDescending ? "Ascending" : "Descending"}
          </button>
        </div>
        <div className={classes.indicator}>
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            className={pageNo ? classes["fa-globe"] : classes.disabled}
            onClick={pageNo ? changePageHandler.bind(null, false) : null}
          />
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className={loaderData.ack ? classes["fa-globe"] : classes.disabled}
            onClick={loaderData.ack ? changePageHandler.bind(null, true) : null}
          />
        </div>
      </div>
      {isLoading && (
        <div className={classes.main}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && isEmpty && <p className="centered">No files to print</p>}
      {!isLoading && !isEmpty && sortedFiles && (
        <ul className={classes.main}>
          {sortedFiles.map((file) => (
            <File
              key={file._id}
              name={file.name}
              filesLen={file.files.length}
              files={file.files}
              id={file._id}
              onDeleteUser={deleteUserHandler}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
export default ShowFiles;
