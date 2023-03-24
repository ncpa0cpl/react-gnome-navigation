import React from "react";
import type { Location } from "../../history/location";
import type { Route } from "./switch";

export type StackOutletProps = {
  routes: Route[];
  location: Location | undefined;
};

export const StackOutlet = (props: StackOutletProps) => {
  return <></>;
};
