import React from "react";

type SwitchContext = {
  registerRoute: (
    path: string,
    component: React.ComponentType<any>
  ) => () => void;
};

export const SwitchContext = React.createContext<SwitchContext>({
  registerRoute: () => {
    throw new Error("Switch context not available.");
  },
});
