import { __is_client__ } from '#src/constants'
import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = __is_client__ ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
