import React from "react";
import type { HistoryPaths, NavHistory } from "../../history/history";
import { NavContext } from "../context/nav-context";

export const useHistory = <P extends HistoryPaths>() => {
  const { history } = React.useContext(NavContext);

  return history as NavHistory<P>;
};
