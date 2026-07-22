import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";

import SessionCard from "./SessionCard";

describe("SessionCard", () => {
   it("renders the session duration", () => {
      render(
         <SessionCard
            session={{ id: 1 }}
            durationMs={120000}
            timeframe="14:00 - 14:02"
         />
      )

      expect(screen.getByText('2min')).toBeInTheDocument();
   })

   it("renders the session timeframe", () => {
      render(
         <SessionCard
            session={{ id: 1 }}
            durationMs={120000}
            timeframe="14:00 - 14:02"
         />
      )

      expect(screen.getByText('14:00 - 14:02')).toBeInTheDocument();
   })
})