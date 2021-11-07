import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import useSWR from 'swr'
import { UserRole } from '#src/types/User'
import { loadStripe } from '@stripe/stripe-js'

const BillingTab: React.FC = () => {
  const { data } = useSWR<{ plan: UserRole }>('/api/plan', { revalidateOnMount: true })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)

  const handleBillingPortal = async () => {
    setBillingLoading(true)
    try {
      const { data } = await axios.post('/api/payments/portal')
      window.location.href = data.url
    } catch (err) {
      console.log(err)
      setBillingLoading(false)
    }
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const { data } = await axios.post<{ sessionId: string }>('/api/payments/checkout')
      const { sessionId } = data

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

      await stripe?.redirectToCheckout({ sessionId })
    } finally {
      setCheckoutLoading(false)
    }
  }
  return (
    <Box>
      <Heading mb={8}>You&apos;re currently on the {data?.plan} plan.</Heading>
      <Stack spacing={4}>
        <Text>Go to billing portal to update payment information and cancel your plan.</Text>
        <HStack spacing={4}>
          {data?.plan === 'basic' && (
            <Button as="a" variant="solid" onClick={handleCheckout} isLoading={checkoutLoading}>
              Upgrade to Premium
            </Button>
          )}
          <Button onClick={handleBillingPortal} variant="solid" isLoading={billingLoading}>
            Billing Portal
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}

export default BillingTab
