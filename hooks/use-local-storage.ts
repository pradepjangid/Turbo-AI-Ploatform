"use client"

import { useState, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      }
      return initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        // Save state
        setStoredValue(valueToStore)
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error)
      }
    },
    [key, storedValue],
  )

  // The initial value is now loaded in the useState initializer

  return [storedValue, setValue] as const
}
