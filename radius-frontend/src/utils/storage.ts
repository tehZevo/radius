
export const get = (key, defaultValue) => JSON.parse(localStorage.getItem(key) ?? defaultValue)
export const set = (key, value) => localStorage.setItem(key, JSON.stringify(value))