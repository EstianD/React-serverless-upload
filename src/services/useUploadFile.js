import { useState } from "react";

export default function useUploadFile(initialValue) {
  const [value, setValue] = useState(initialValue);

  //   setValue((prevValue) => (prevValue += 1));

  return [value, setValue];
}
