import styled from "@emotion/styled";
import { StlViewer } from "react-stl-viewer";

const Wrapper = styled.p(
  ({ size }) => `
  height:${size}px;
  width:${size}px;
`);

export default function Stl({ url, size = 500 }) {
  return (
    <Wrapper size={size}>
      <StlViewer
        orbitControls
        shadows
        url={url}
      />
    </Wrapper>
  );
}
