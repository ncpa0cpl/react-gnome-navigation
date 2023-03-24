export class Location {
  constructor(
    public readonly path: string,
    public readonly param: Record<any, any>
  ) {
    Object.freeze(this);
  }
}
