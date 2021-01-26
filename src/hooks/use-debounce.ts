import { useCallback, useEffect, useRef } from 'react'

const useDebounce = (fn: () => void | Promise<void>, delay: number) => {
  const fnRef = useRef(fn)
  const timerRef = useRef<number>()

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const debounced = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      fnRef.current()
    }, delay)
  }, [delay])

  return debounced
}

export default useDebounce
