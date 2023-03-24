import type { EventListener } from "./event-emitter";
import { Event, EventEmitter } from "./event-emitter";

export class SignaledArray<T> {
  private arr: Array<T> = [];
  public emitter = new EventEmitter<
    "changed",
    Event<{ array: Array<T> }>,
    EventListener<{ array: Array<T> }>
  >();

  get length() {
    return this.arr.length;
  }

  at(index: number) {
    return this.arr[index];
  }

  last() {
    return this.arr[this.arr.length - 1];
  }

  push(...item: T[]) {
    this.arr.push(...item);
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
  }

  pop(times = 1) {
    const popped: T[] = [];
    for (let i = 0; i < times; i++) {
      popped.push(this.arr.pop()!);
    }
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
    return popped.reverse();
  }

  unshift(...item: T[]) {
    this.arr.unshift(...item);
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
  }

  shift(times = 1) {
    const shifted: T[] = [];
    for (let i = 0; i < times; i++) {
      shifted.push(this.arr.shift()!);
    }
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
    return shifted;
  }

  remove(index: number) {
    this.arr.splice(index, 1);
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
  }

  replace(index: number, item: T) {
    this.arr[index] = item;
    this.emitter.emit("changed", Event.create({ array: this.arr.slice() }));
  }

  findIndex(predicate: (value: T, index: number) => unknown) {
    return this.arr.findIndex(predicate);
  }

  find(predicate: (value: T, index: number) => unknown) {
    return this.arr.find(predicate);
  }

  forEach(callback: (value: T, index: number) => void) {
    this.arr.forEach(callback);
  }

  map<U>(callback: (value: T, index: number) => U) {
    return this.arr.map(callback);
  }

  filter(callback: (value: T, index: number) => unknown) {
    return this.arr.filter(callback);
  }

  reduce<U>(
    callback: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U
  ): U {
    return this.arr.reduce(callback, initialValue);
  }

  values() {
    return this.arr.values();
  }

  keys() {
    return this.arr.keys();
  }

  entries() {
    return this.arr.entries();
  }

  [Symbol.iterator]() {
    return this.arr[Symbol.iterator]();
  }
}
