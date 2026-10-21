import assert from "node:assert/strict";
import test from "node:test";
import { categoryWithDescendants, rootCategories } from "../src/lib/category-tree.ts";

const cats = [
  { id: 4, parentId: null, name: "Electronics" },
  { id: 5, parentId: 4, name: "Smartphones" },
  { id: 6, parentId: 4, name: "Laptops" },
  { id: 7, parentId: 5, name: "Cases" },
  { id: 9, parentId: null, name: "Vehicles", isActive: false },
];

test("parent filter includes all descendants", () => {
  assert.deepEqual([...categoryWithDescendants(cats, 4)].sort(), ["4", "5", "6", "7"]);
  assert.deepEqual([...categoryWithDescendants(cats, "6")], ["6"]);
});

test("root categories exclude children and inactive ones", () => {
  assert.deepEqual(rootCategories(cats).map((c) => c.id), [4]);
});
