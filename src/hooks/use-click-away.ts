// Simplified version of https://github.com/streamich/react-use/blob/master/src/useClickAway.ts
import { RefObject, useEffect, useRef } from 'react'

const EVENTS = ['mousedown', 'touchstart']

const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: Event) => void
): void => {
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    const handler = (event: Event) => {
      const { current: el } = ref
      el && !el.contains(event.target as Node) && savedCallback.current(event)
    }

    for (const eventName of EVENTS) {
      document.addEventListener(eventName, handler)
    }

    return () => {
      for (const eventName of EVENTS) {
        document.removeEventListener(eventName, handler)
      }
    }
  }, [ref])
}

export default useClickAway
