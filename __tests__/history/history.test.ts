import { describe, expect, it } from "@reactgjs/gest";
import { NavHistory } from "../../src/history/history";
import { HistoryEntry } from "../../src/history/history-entry";

type TestPaths = {
  "/": undefined;
  "/page1": {};
  "/page2": { id: number };
  "/page3": string;
  "/page3/subpage1": string[];
  "/page3/subpage2": { id: number; name: string };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default describe("NavHistory", () => {
  describe("goTo()", () => {
    it("should correctly add new entries", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goTo("/page1", {});

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page1",
        param: {},
      });

      history.goTo("/page2", { id: 1 });

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goTo("/page2", { id: 2 });

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 2 },
      });
    });

    it("should cause history listener to trigger", async () => {
      const history = new NavHistory<TestPaths>();

      let lasCalledWith: HistoryEntry | undefined;

      history.onHistoryChanged((current) => {
        lasCalledWith = current;
      });

      expect(lasCalledWith).toBeUndefined();
      lasCalledWith = undefined;

      history.goTo("/", undefined);

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/",
        param: undefined,
      });
      lasCalledWith = undefined;

      history.goTo("/page1", {});

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page1",
        param: {},
      });
      lasCalledWith = undefined;

      history.goTo("/page2", { id: 1 });

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 1 },
      });
      lasCalledWith = undefined;

      history.goTo("/page2", { id: 2 });

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 2 },
      });
    });

    it("should clear the forward history", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page3", "test");

      history.goBack();

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goTo("/page3/subpage1", []);

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: [],
      });

      history.goForward();

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: [],
      });

      history.goBack();

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goForward();

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: [],
      });
    });
  });

  describe("goBack()", () => {
    it("should correctly remove last entry", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page2", { id: 2 });

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 2 },
      });

      history.goBack();

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goBack();

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page1",
        param: {},
      });

      history.goBack();

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goBack();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();
    });

    it("should correctly remove last '2' entries", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page2", { id: 2 });
      history.goTo("/page3", "hello");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goBack(2);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3",
        param: "hello",
      });

      history.goBack(2);

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goBack(2);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goBack(2);

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();
    });

    it("should correctly remove last '3' entries", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page2", { id: 2 });
      history.goTo("/page3", "hello");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goBack(3);

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 2 },
      });

      history.goBack(3);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goBack(3);

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();
    });

    it("should cause history listener to trigger", async () => {
      const history = new NavHistory<TestPaths>();

      let lasCalledWith: HistoryEntry | undefined;

      history.onHistoryChanged((current) => {
        lasCalledWith = current;
      });

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page2", { id: 2 });

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 2 },
      });
      lasCalledWith = undefined;

      history.goBack();

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 1 },
      });
      lasCalledWith = undefined;

      history.goBack();

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page1",
        param: {},
      });
      lasCalledWith = undefined;

      history.goBack();

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/",
        param: undefined,
      });
      lasCalledWith = undefined;

      history.goBack();

      await sleep(0);

      expect(lasCalledWith).toBeUndefined();
    });
  });

  describe("replace()", () => {
    it("should correctly replace last entry", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goTo("/page1", {});

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page1",
        param: {},
      });

      history.replace("/page2", { id: 1 });

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.replace("/page2", { id: 2 });

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 2 },
      });

      history.replace("/", undefined);

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });
    });

    it("should cause history listener to trigger", async () => {
      const history = new NavHistory<TestPaths>();

      let lasCalledWith: HistoryEntry | undefined;

      history.onHistoryChanged((current) => {
        lasCalledWith = current;
      });

      expect(lasCalledWith).toBeUndefined();
      lasCalledWith = undefined;

      history.goTo("/", undefined);

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/",
        param: undefined,
      });
      lasCalledWith = undefined;

      history.goTo("/page1", {});

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page1",
        param: {},
      });
      lasCalledWith = undefined;

      history.replace("/page2", { id: 1 });

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 1 },
      });
      lasCalledWith = undefined;

      history.replace("/page2", { id: 2 });

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/page2",
        param: { id: 2 },
      });
      lasCalledWith = undefined;

      history.replace("/", undefined);

      await sleep(0);

      expect(lasCalledWith).toMatch({
        path: "/",
        param: undefined,
      });
    });

    it("replaced paths should be correctly handled by goBack()", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.replace("/page2", { id: 1 });
      history.goTo("/page2", { id: 2 });
      history.replace("/page3", "hello");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.replace("/page3/subpage2", { id: 1, name: "John" });
      history.goTo("/", undefined);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goBack();

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goBack();

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page3",
        param: "hello",
      });

      history.goBack();

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goBack();

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });
    });
  });

  describe("goForward()", () => {
    it("should correctly go forward", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page3", "hi");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });

      history.goBack(5);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goForward();

      expect(history.stackSize).toBe(2);
      expect(history.current).toMatch({
        path: "/page1",
        param: {},
      });

      history.goForward();

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goForward();

      expect(history.stackSize).toBe(4);
      expect(history.current).toMatch({
        path: "/page3",
        param: "hi",
      });

      history.goForward();
      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world"],
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });
    });

    it("should correctly go forward by '2' entries", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page3", "hi");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });
      history.goTo("/page3", "bye");
      history.goTo("/page2", { id: 32 });

      history.goBack(7);

      expect(history.stackSize).toBe(1);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goForward(2);

      expect(history.stackSize).toBe(3);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 1 },
      });

      history.goForward(2);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world"],
      });

      history.goForward(2);

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3",
        param: "bye",
      });

      history.goForward(2);

      expect(history.stackSize).toBe(8);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 32 },
      });
    });
  });

  describe("goBack() + goForward()", () => {
    it("should correctly go back and forward multiple times", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page3", "hi");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });
      history.goTo("/page3", "bye");
      history.goTo("/page2", { id: 32 });

      history.goBack(3);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world"],
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goForward(2);

      expect(history.stackSize).toBe(8);
      expect(history.current).toMatch({
        path: "/page2",
        param: { id: 32 },
      });

      history.goBack();

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3",
        param: "bye",
      });

      history.goBack();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goBack();

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world"],
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.goForward();

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3",
        param: "bye",
      });
    });
  });

  describe("goBack() + replace() + goForward()", () => {
    it("should be possible to replace entry within history by going back, replacing and going forward", () => {
      const history = new NavHistory<TestPaths>();

      expect(history.stackSize).toBe(0);
      expect(history.current).toBeUndefined();

      history.goTo("/", undefined);
      history.goTo("/page1", {});
      history.goTo("/page2", { id: 1 });
      history.goTo("/page3", "hi");
      history.goTo("/page3/subpage1", ["hello", "world"]);
      history.goTo("/page3/subpage2", { id: 1, name: "John" });
      history.goTo("/page3", "bye");
      history.goTo("/page2", { id: 32 });

      history.goBack(3);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world"],
      });

      history.replace("/page3/subpage1", ["hello", "world", "again"]);

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world", "again"],
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/page3/subpage2",
        param: { id: 1, name: "John" },
      });

      history.replace("/", undefined);

      history.goBack();

      expect(history.stackSize).toBe(5);
      expect(history.current).toMatch({
        path: "/page3/subpage1",
        param: ["hello", "world", "again"],
      });

      history.goForward();

      expect(history.stackSize).toBe(6);
      expect(history.current).toMatch({
        path: "/",
        param: undefined,
      });

      history.goForward();

      expect(history.stackSize).toBe(7);
      expect(history.current).toMatch({
        path: "/page3",
        param: "bye",
      });
    });
  });
});
