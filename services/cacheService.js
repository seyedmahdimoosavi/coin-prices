/**
 * Simple in-memory cache using Map
 * Implements Stale-While-Revalidate pattern
 */
const cache = new Map();

function get(key) {
  return cache.get(key) || null;
}

function set(key, value) {
  cache.set(key, value);
}

function has(key) {
  return cache.has(key);
}

function getAll() {
  return Array.from(cache.values());
}

module.exports = { get, set, has, getAll };