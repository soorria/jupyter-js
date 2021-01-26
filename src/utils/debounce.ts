const debounce = (fn: () => void | Promise<void>, delay: number) => {
  let timer: ReturnType<typeof setTimeout>

  return () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

export default debounce
