import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import MainLayout from './MainLayout'

interface AuthedLayoutProps {}

const AuthedLayout: React.FC<AuthedLayoutProps> = ({ children }) => {
  const [session, loading] = useSession()
  const { replace } = useRouter()

  useEffect(() => {
    if (!session && !loading) {
      setTimeout(() => {
        replace('/')
      }, 10000)
    }
  }, [session, loading, replace])

  return <MainLayout>{loading ? null : children}</MainLayout>
}

export default AuthedLayout
