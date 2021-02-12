import { useToast as _useToast, UseToastOptions } from '@chakra-ui/react'

export const DEFAULT_TOAST_OPTIONS: UseToastOptions = {
  position: 'bottom',
  duration: 3000,
  isClosable: true,
  variant: 'solid',
}

export const extendDefaultToastOptions = (options?: UseToastOptions): UseToastOptions => ({
  ...DEFAULT_TOAST_OPTIONS,
  ...options,
})

const useStyledToast = (): ReturnType<typeof _useToast> => _useToast(DEFAULT_TOAST_OPTIONS)

export default useStyledToast
