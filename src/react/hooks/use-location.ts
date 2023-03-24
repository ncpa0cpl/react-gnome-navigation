import React from "react";
import { NavContext } from "../context/nav-context";

export const useLocation = () => {
  const { location } = React.useContext(NavContext);

  return location;
};
