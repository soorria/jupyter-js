import { useState, useEffect } from 'react'

const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default useMounted
