import { SignaledArray } from "../utils/signaled-array";
import { Location } from "./location";

export interface HistoryPaths {
  [key: string]: Record<any, any>;
}

export type PathsOf<H extends NavHistory> = H extends NavHistory<infer P>
  ? keyof P
  : never;

export type ParamsOf<
  H extends NavHistory,
  K extends PathsOf<H>
> = H extends NavHistory<infer P> ? P[K] : never;

export class NavHistory<P extends HistoryPaths = Record<string, any>> {
  private stack = new SignaledArray<Location>();
  private forwardStack: Location[] = [];

  get stackSize() {
    return this.stack.length;
  }

  get current() {
    return this.stack.last();
  }

  goTo<K extends keyof P>(path: K, param: P[K]) {
    const entry = new Location(path as any, param);

    this.forwardStack = [];
    this.stack.push(entry);
  }

  replace<K extends keyof P>(path: K, param: P[K]) {
    const entry = new Location(path as any, param);

    this.stack.replace(this.stack.length - 1, entry);
  }

  goBack(by = 1) {
    this.forwardStack = this.stack.pop(by).concat(this.forwardStack);
  }

  goForward(by = 1) {
    const forwardElems = this.forwardStack.splice(0, by);

    this.stack.push(...forwardElems);
  }

  onHistoryChanged(callback: (current: Location) => void) {
    const handler = (event: { array: Location[] }) => {
      callback(event.array[event.array.length - 1]!);
    };

    this.stack.emitter.add("changed", handler);

    return () => this.stack.emitter.remove("changed", handler);
  }
}
