const debounce = (fn: () => void | Promise<void>, delay: number): (() => void | Promise<void>) => {
  let timer: ReturnType<typeof setTimeout>

  return () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

export default debounce
