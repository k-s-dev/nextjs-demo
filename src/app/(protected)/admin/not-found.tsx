import { Blockquote, Container } from "@mantine/core";

export default function NotFound() {
  return (
    <Container>
      <Blockquote color="orange">
        <b>Page</b> or <b>Resource</b> you were looking for, was <b>not found</b>.
      </Blockquote>
    </Container>
  );
}
