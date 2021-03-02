import React from "react";
import axios from "axios";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import useUploadFile from "./useUploadFile";

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

export default async function uploadFile(data, dropArea) {
  const [loaded, setLoaded] = useUploadFile(0);
  console.log("UPLOADING");
  //   console.log(REACT_APP_AWS_URL);
  console.log(data);
  console.log(dropArea);

  //   console.log(params);

  for (let i = 0; i < data.length; i++) {
    let fileExt = data[i].name.split(".").pop();

    const params = {
      Bucket: bucket,
      Key: `${uuidv4()}.${fileExt}`,
      Body: data[i],
      ContentType: data[i].type,
    };

    try {
      const resp = await s3
        .upload(params)
        .on("httpUploadProgress", ({ loaded, total }) => {
          setLoaded(loaded);
          console.log(loaded);
          //  console.log(
          //    "Progress: ",
          //    loaded,
          //    "/",
          //    total,
          //    `${Math.round((100 * loaded) / total)}%`
          //  );
        })
        .promise();
      console.log(resp);
      // await s3
      //   .putObject(params, (err) => {
      //     console.log("doen", err, data);
      //   })
      //   .on("httpUploadProgress", ({ loaded, total }) => {
      //     console.log(
      //       "Progress: ",
      //       loaded,
      //       "/",
      //       total,
      //       `${Math.round((100 * loaded) / total)}%`
      //     );
      //   });
      // console.log(resp);

      console.log("DONE UPLOADING");
    } catch (err) {
      console.log("ERROR UPLOADING");
    }
  }
}
