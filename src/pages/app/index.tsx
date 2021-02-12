import { GetServerSideProps } from 'next'

const AppIndex: React.FC = () => null
export default AppIndex

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/app/dashboard',
      permanent: true,
    },
  }
}
