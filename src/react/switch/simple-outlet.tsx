import React from "react";
import type { Location } from "../../history/location";
import type { Route } from "./switch";

export type SimpleOutletProps = {
  routes: Route[];
  location: Location | undefined;
};

export const SimpleOutlet = (props: SimpleOutletProps) => {
  const { routes, location } = props;

  const matchingRoute = React.useMemo(() => {
    if (location) {
      return routes.find((route) => route.path === location.path);
    }
  }, [routes, location]);

  if (matchingRoute) {
    return <matchingRoute.Component {...(location!.param ?? {})} />;
  }

  return <></>;
};
