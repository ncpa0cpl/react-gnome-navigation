import React from "react";
import type { NavHistory, ParamsOf, PathsOf } from "../../history/history";
import { SwitchContext } from "../context/switch-context";

export type RouteProps<H extends NavHistory, P extends PathsOf<H>> = {
  path: P;
  component: React.ComponentType<ParamsOf<H, P>>;
};

export const Route = <H extends NavHistory, P extends PathsOf<H>>(
  props: RouteProps<H, P>
) => {
  const { registerRoute } = React.useContext(SwitchContext);

  React.useEffect(() => {
    return registerRoute(props.path, props.component);
  }, [props.path, props.component]);

  return <></>;
};
