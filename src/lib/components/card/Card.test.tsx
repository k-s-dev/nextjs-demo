import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";

import { Card } from "@/lib/components/card";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Card>A simple card</Card>);

    const text = screen.getByText("A simple card");

    expect(text).toBeInTheDocument();
  });
});

