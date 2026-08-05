import { resolveActiveTab } from "./tab-precedence";

console.log("=== TAB PRECEDENCE TEST SUITE ===");

// Test 1: URL param present ('active'), LocalStorage has different value ('completed') -> URL wins
const res1 = resolveActiveTab({
  urlParam: "active",
  savedStorageTab: "completed",
  defaultTab: "upcoming",
  validTabIds: ["upcoming", "active", "completed"],
});
console.log(`Test 1 (URL present + LocalStorage present): Expected 'active', Got '${res1}' -> ${res1 === 'active' ? 'PASS' : 'FAIL'}`);

// Test 2: URL param absent (null), LocalStorage has value ('completed') -> LocalStorage wins
const res2 = resolveActiveTab({
  urlParam: null,
  savedStorageTab: "completed",
  defaultTab: "upcoming",
  validTabIds: ["upcoming", "active", "completed"],
});
console.log(`Test 2 (URL absent + LocalStorage present): Expected 'completed', Got '${res2}' -> ${res2 === 'completed' ? 'PASS' : 'FAIL'}`);

// Test 3: URL param absent (null), LocalStorage absent (null) -> Default tab wins
const res3 = resolveActiveTab({
  urlParam: null,
  savedStorageTab: null,
  defaultTab: "upcoming",
  validTabIds: ["upcoming", "active", "completed"],
});
console.log(`Test 3 (URL absent + LocalStorage absent): Expected 'upcoming', Got '${res3}' -> ${res3 === 'upcoming' ? 'PASS' : 'FAIL'}`);

// Test 4: URL param invalid ('invalid_tab'), LocalStorage valid ('completed') -> LocalStorage wins
const res4 = resolveActiveTab({
  urlParam: "invalid_tab",
  savedStorageTab: "completed",
  defaultTab: "upcoming",
  validTabIds: ["upcoming", "active", "completed"],
});
console.log(`Test 4 (URL invalid + LocalStorage valid): Expected 'completed', Got '${res4}' -> ${res4 === 'completed' ? 'PASS' : 'FAIL'}`);
