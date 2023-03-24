import React from "react";
import { NavContext } from "../context/nav-context";
import { SwitchContext } from "../context/switch-context";
import { SimpleOutlet } from "./simple-outlet";
import { StackOutlet } from "./stack-outlet";

export type Route = {
  path: string;
  Component: React.ComponentType<any>;
  lastKnownParam?: Record<string, string>;
};

export type SwitchProps = React.PropsWithChildren<{ stack?: boolean }>;

export const Switch = React.memo((props: SwitchProps) => {
  const { stack = true } = props;

  const { location } = React.useContext(NavContext);

  const [routes, setRoutes] = React.useState<Route[]>([]);
  const isMounted = React.useRef(true);

  const registerRoute = React.useCallback(
    (path: string, Component: React.ComponentType<any>) => {
      const newRoute: Route = { path, Component };

      setRoutes((routes) => {
        if (routes.some((route) => route.path === path)) {
          throw new Error(`Route with path "${path}" already exists`);
        }

        return [...routes, newRoute];
      });

      return () => {
        if (isMounted.current) {
          setRoutes((routes) => routes.filter((r) => r !== newRoute));
        }
      };
    },
    []
  );

  React.useEffect(() => {
    if (location) {
      const route = routes.find((route) => route.path === location.path);

      if (route) {
        route.lastKnownParam = location.param;
      }
    }
  }, [location?.param]);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <SwitchContext.Provider value={{ registerRoute }}>
      {props.children}
      {/* Outlet: */}
      {stack ? (
        <StackOutlet routes={routes} location={location} />
      ) : (
        <SimpleOutlet routes={routes} location={location} />
      )}
    </SwitchContext.Provider>
  );
});
