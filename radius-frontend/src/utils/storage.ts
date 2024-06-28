
export const get = (key, defaultValue:any=undefined) => JSON.parse(localStorage.getItem(key)) ?? defaultValue
export const set = (key, value) => localStorage.setItem(key, JSON.stringify(value))