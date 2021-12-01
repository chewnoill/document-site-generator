import styled from "@emotion/styled";

const Box = styled.div(({ bg, color, border }) => ({
  background: bg,
  color,
  padding: "15px",
  borderRadius: "5px",
  border,
}));

export default Box;
