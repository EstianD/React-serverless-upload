import React, { useState, useRef, useEffect } from "react";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const {
  REACT_APP_AWS_URL,
  REACT_APP_AWS_ID,
  REACT_APP_AWS_SECRET,
} = process.env;

// Create AWS S3 instance
const s3 = new AWS.S3({
  accessKeyId: REACT_APP_AWS_ID,
  secretAccessKey: REACT_APP_AWS_SECRET,
});

const bucket = "js-uploader-storage";

function Uploader() {
  const [dragOver, setDragOver] = useState(false);

  const dropArea = useRef();
  const innerArea = useRef();
  const [status, setStatus] = useState("Select files to upload");

  //   Upload function
  async function uploadFile(data, dropArea) {
    let totalSize = 0;
    let totalProgress = 0;

    for (let i = 0; i < data.length; i++) {
      //  Get file extension
      let fileExt = data[i].name.split(".").pop();

      // S3 config
      const params = {
        Bucket: bucket,
        Key: `${uuidv4()}.${fileExt}`,
        Body: data[i],
        ContentType: data[i].type,
      };

      try {
        // Upload file
        await s3.putObject(params).promise();
      } catch (err) {
        console.log("ERROR UPLOADING: ", err);
        // return if error
        return false;
      }
    }
    // return true if upload succeeded
    return true;
  }

  // Handle drag enter
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.current.className = "";
  };

  const handleDragOver = (e) => {
    dropArea.current.className = "dragover";
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    innerArea.current.className = "dropped";

    let dt = e.dataTransfer;
    let files = dt.files;
    let filesArray = [];

    // Check if there are files
    if (files.length > 0) {
      const formData = new FormData();

      // Loop through all of the files and append them to formdata
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      setStatus("Uploading");

      // Ticker variable to create uploading... effect
      // Set ticker for the times the interval has looped through the array
      let ticker = 0;
      let uploadLoader = setInterval(() => {
        let uploadArray = ["Uploading.", "Uploading..", "Uploading..."];
        // Reset ticker if it is > 3
        if (ticker < 3) {
          setStatus(uploadArray[ticker]);
        } else {
          ticker = 0;
          setStatus(uploadArray[0]);
        }
        //   Increment ticker after each interval
        ticker++;
      }, 500);

      // Call upload function
      const uploadPromise = uploadFile(files, dropArea);
      uploadPromise.then((res) => {
        if (res) {
          //  Done uploading
          //  Clear interval
          clearInterval(uploadLoader);
          //  Set status to complete
          setStatus("Upload Complete");
          //  Clear message after 3sec
          setTimeout(() => {
            setStatus("Select files to upload");
          }, 3000);
        }
      });
    }
  };

  return (
    <div
      id="file-drop-area"
      ref={dropArea}
      className={dragOver ? "dragover" : null}
      // onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
    >
      <div id="inner-div" ref={innerArea}></div>
      <form className="upload-form">
        <input type="file" id="fileElem" multiple accept="image/*" />
        <label id="upload-text" className="upload-button" htmlFor="fileElem">
          {/* Select some files */}
          {status && <span>{status}</span>}
        </label>
      </form>
    </div>
  );
}

export default Uploader;
