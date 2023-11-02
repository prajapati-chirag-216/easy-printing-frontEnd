import { jsPDF } from "jspdf";
import qr from "qrcode";
export function qrToPdf(src, title) {
  const doc = new jsPDF("p", "px", "a4");
  const imageWidth = 200;
  const imageheight = 200;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.addImage(
    src,
    "PNG",
    (pageWidth - imageWidth) / 2,
    (pageHeight - imageheight) / 2,
    imageWidth,
    imageheight
  );
  doc.setProperties({ title: title });
  return doc.output("datauristring");
}

export function getQr(data, url) {
  try {
    qr.toDataURL(url, async (err, src) => {
      if (err) throw err;
      const title = `${data.shopName}_QR.pdf`;
      data.buffer_data = qrToPdf(src, title);
    });
  } catch (err) {
    throw err;
  }
}

export function imageToPdf(src, title) {
  const doc = new jsPDF("p", "px", "a4");
  const imageWidth = doc.internal.pageSize.getWidth() - 100;
  const imageheight = doc.internal.pageSize.getHeight() - 100;
  doc.addImage(src, "PNG", 50, 50, imageWidth, imageheight);
  doc.setProperties({ title: `${title}.pdf` });
  return doc.output("datauristring");
}

export function pdfConvertor(files) {
  let userFiles = [];
  files.forEach((file) => {
    if (file.filetype === "pdf") {
      file.fileData.forEach((fileData) => {
        const buffer_data = `data:application/pdf;base64,${fileData.file}`;
        const data = {
          title: fileData.fileName.split(".")[0],
          file: buffer_data,
        };
        userFiles.push(data);
      });
    } else if (file.filetype === "image") {
      file.fileData.forEach((fileData) => {
        const data = {
          title: fileData.fileName.split(".")[0],
          file: "",
        };
        data.file = imageToPdf(fileData.file, data.title);
        userFiles.push(data);
      });
    }
  });
  return userFiles;
}

export function sortFiles(fileData, descending, sortByFile) {
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
}

export function cookieParser() {
  const data = {};
  document.cookie.split(";").map((ele) => {
    return (data[ele.trim().split("=")[0]] = ele.split("=")[1]);
  });
  return data;
}
