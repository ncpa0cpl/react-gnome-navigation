import React from "react";
import type { NavHistory } from "../../history/history";
import { useCurrentLocation } from "../hooks/use-current-location";
import { NavContext } from "./nav-context";

export const createNavigationProvider = <H extends NavHistory>(history: H) => {
  function NavContextProvider(props: React.PropsWithChildren) {
    const location = useCurrentLocation(history);

    return (
      <NavContext.Provider
        value={{
          history,
          location,
        }}
      >
        {props.children}
      </NavContext.Provider>
    );
  }

  return NavContextProvider;
};
