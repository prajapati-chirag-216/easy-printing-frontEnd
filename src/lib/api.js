import axios from "axios";
import qr from "qrcode";
import { pdfConvertor, getQr } from "./functions";

const BACKAND_DOMAIN = "http://localhost:8000";
const FRONTEND_DOMAIN = "http://localhost:3000";

export async function getFiles(pageNo) {
  const response = await axios.post(
    `${BACKAND_DOMAIN}/showFiles?skip=${pageNo}`,
    {},
    {
      withCredentials: true,
    }
  );
  const data = response.data;
  if (response.statusText !== "OK") {
    throw new Error({ message: data.message || "Could not fetch admins." });
  }
  return data;
}

export async function addNewAdmin(userData) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/new-admin`,
      {
        ...userData,
      },
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Could not add admin." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function signinAdmin(userData) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/signin`,
      {
        ...userData,
      },
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to Login." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function logoutAdmin() {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to Logout." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function forgotPassword(userData) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/forgotPassword`,
      {
        ...userData,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Somthing went wrong." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function resetPassword(userData) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/resetPassword/${userData.token}`,
      {
        password: userData.newPassword,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to reset password." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function myQr() {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/myQr`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    const url = `${FRONTEND_DOMAIN}/user/${data.qr_id}`;
    console.log({ url });
    await qr.toDataURL(url);
    await getQr(data, url);
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to load QR." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function uploadFiles(userData) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/user/files/${userData.id}`,
      {
        ...userData,
      },
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to Upload." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function userFiles() {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/userFiles`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    const filesData = pdfConvertor(data.files);
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "somthing went wrong." });
    }
    return filesData;
  } catch (err) {
    throw err;
  }
}

export async function deleteUserById(userData) {
  try {
    const response = await axios.delete(
      `${BACKAND_DOMAIN}/deleteUser/${userData.id}`
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to deleteUser." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getAccountInfo() {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/accountInfo`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    console.log("data -> ", data);
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "somthing went wrong." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function updateImage(image) {
  try {
    const response = await axios.post(
      `${BACKAND_DOMAIN}/admin/updateImage`,
      {
        image,
      },
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    const data = response.data;
    console.log(data);
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to Login." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
export async function getPlaces({ loc, radius }) {
  try {
    const response = await axios.post(`${BACKAND_DOMAIN}/user/getPlaces`, {
      loc,
      radius,
    });
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to Login." });
    }
    return { places: data, status: response.status };
  } catch (err) {
    throw err;
  }
}
export async function deleteUser() {
  try {
    const response = await axios.delete(
      `${BACKAND_DOMAIN}/deleteUser`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error({ message: data.message || "Unable to deleteUser." });
    }
    return data;
  } catch (err) {
    throw err;
  }
}
