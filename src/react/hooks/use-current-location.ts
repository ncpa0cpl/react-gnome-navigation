import React from "react";
import type { NavHistory } from "../../history/history";

export const useCurrentLocation = (history: NavHistory) => {
  const [location, setLocation] = React.useState(() => history.current);

  React.useEffect(
    () =>
      history.onHistoryChanged(() => {
        setLocation(history.current);
      }),
    []
  );

  return location;
};
