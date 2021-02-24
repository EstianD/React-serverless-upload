import React, { useState, useRef } from "react";
import uploadFile from "./services/uploadFile";

function Uploader() {
  const [dragOver, setDragOver] = useState(false);
  const dropArea = useRef();

  const handleDragEnter = (e) => {
    // console.log("dragenter", dropArea);
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag leave");
    dropArea.current.className = "";
  };

  const handleDragOver = (e) => {
    // console.log("DragOver", dropArea);
    dropArea.current.className = "dragover";
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOnDrop = (e) => {
    console.log("onDrop");

    e.preventDefault();
    e.stopPropagation();

    let dt = e.dataTransfer;
    let files = dt.files;
    let filesArray = [];

    // Check if there are files
    if (files.length > 0) {
      // console.log(files);
      const formData = new FormData();

      // Loop through all of the files and append them to formdata
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      console.log(formData.getAll("files"));
      uploadFile(files);
      // handleFileUpload(formData);
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
      <form className="upload-form">
        <input type="file" id="fileElem" multiple accept="image/*" />
        <label id="upload-text" className="upload-button" htmlFor="fileElem">
          Select some files
        </label>
      </form>
    </div>
  );
}

export default Uploader;
