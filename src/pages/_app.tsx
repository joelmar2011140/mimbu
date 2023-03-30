import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RootProvider } from '@/providers/RootProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  )
}
