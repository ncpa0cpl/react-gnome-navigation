import React from "react";
import type { NavHistory } from "../../history/history";
import type { Location } from "../../history/location";

type NavContext = {
  history: NavHistory;
  location: Location | undefined;
};

export const NavContext = React.createContext<NavContext>({
  get history(): NavHistory {
    throw new Error("Navigation context not available.");
  },
  get location(): Location {
    throw new Error("Navigation context not available.");
  },
});
