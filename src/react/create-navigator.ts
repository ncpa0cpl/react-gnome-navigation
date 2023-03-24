import type { HistoryPaths } from "../history/history";
import { NavHistory } from "../history/history";
import { createNavigationProvider } from "./context/create-nav-provider";
import type { RouteProps } from "./route/route";
import { Route } from "./route/route";
import type { SwitchProps } from "./switch/switch";
import { Switch } from "./switch/switch";

type Navigator<P extends HistoryPaths> = {
  history: NavHistory<P>;
  Provider: (props: React.PropsWithChildren) => JSX.Element;
  Switch: (props: SwitchProps) => JSX.Element;
  Route: <PK extends keyof P>(
    props: RouteProps<NavHistory<P>, PK>
  ) => JSX.Element;
};

export function createNavigator<P extends HistoryPaths>(): Navigator<P>;
export function createNavigator<P extends HistoryPaths>(
  initialPath: keyof P,
  params: P[keyof P]
): Navigator<P>;
export function createNavigator<P extends HistoryPaths>(
  initialPath?: keyof P,
  params?: P[keyof P]
): Navigator<P> {
  const history = new NavHistory<P>();
  if (initialPath) history.goTo(initialPath, params!);

  const Provider = createNavigationProvider(history);

  return {
    history,
    Provider,
    Route: Route as any,
    Switch: Switch as any,
  };
}
