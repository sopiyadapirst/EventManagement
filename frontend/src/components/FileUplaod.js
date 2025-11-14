import React from "react";
export default function FileUploadInput({ onFile }) {
  return <input type="file" onChange={(e) => onFile(e.target.files?.[0])} />;
}
