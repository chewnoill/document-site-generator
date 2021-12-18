import { StlViewer } from "react-stl-viewer";

export default function Stl({ url, size = 500 }) {
  return (
    <StlViewer
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      orbitControls
      shadows
      url={url}
    />
  );
}
