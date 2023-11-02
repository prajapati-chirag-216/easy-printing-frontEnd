import File from "../components/files/File";
import classes from "./ShowFiles.module.css";
import {
  Await,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { getFiles } from "../lib/api";
import { Suspense } from "react";
import { pdfConvertor } from "../lib/functions";

const sortFiles = (fileData, descending, sortByFile) => {
  if (sortByFile) {
    return fileData.sort((fileA, fileB) => {
      if (descending) {
        return fileA.files.length < fileB.files.length ? 1 : -1;
      } else {
        return fileA.files.length > fileB.files.length ? 1 : -1;
      }
    });
  }
  return fileData.sort((fileA, fileB) => {
    if (descending) {
      return fileA._id < fileB._id ? 1 : -1;
    } else {
      return fileA._id > fileB._id ? 1 : -1;
    }
  });
};

const ShowFiles = () => {
  const loaderData = useLoaderData();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const pageNo = +queryParams.get("skip") || 0;

  const isSortingDescending = queryParams.get("sort") === "desc";
  const isSortingByFiles = queryParams.get("type") === "files";

  let FILES = loaderData.buffer_data.map((fileData) => {
    return {
      name: fileData.name,
      _id: fileData._id,
      files: pdfConvertor(fileData.files),
    };
  });

  const sortedFiles = sortFiles(FILES, isSortingDescending, isSortingByFiles);

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
      <Suspense>
        <Await
          resolve={loaderData.buffer_data}
          errorElement={<p className="centered">Error while loading QR!</p>}
        >
          {() => (
            <ul className={classes.main}>
              {sortedFiles.map((file) => (
                <File
                  key={file._id}
                  name={file.name}
                  filesLen={file.files.length}
                  files={file.files}
                />
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
};
export async function loader({ request }) {
  let response;
  const query = request.url.split("&").pop().split("=");
  const pageNo = query[0] === "skip" ? +query[1] : 0;
  try {
    response = await getFiles(pageNo);
  } catch (err) {
    throw err;
  }
  return response;
}
export default ShowFiles;
