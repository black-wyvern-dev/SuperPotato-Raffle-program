import '../styles/style.scss'
import Wallet from '../components/wallet/Wallet'
import { ToastContainer } from 'react-toastify'
import PageLoading from '../components/PageLoading'
import { useState } from 'react'

function RaffleApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  return (
    <Wallet>
      <Component
        {...pageProps}
        pageLoading={loading}
        startLoading={() => setLoading(true)}
        closeLoading={() => setLoading(false)}
      />
      <ToastContainer
        style={{ fontSize: 15 }}
        pauseOnFocusLoss={false}
      />
      {/* <PageLoading loading={loading} /> */}
    </Wallet>
  )
}

export default RaffleApp
