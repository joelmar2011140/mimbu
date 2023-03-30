import 'react-toastify/dist/ReactToastify.css';
import { StoreProvider } from 'easy-peasy'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '@/lib/react-query.instance';
import { store } from '@/features/store';
import { IProvider } from "@/global.types";

export function RootProvider({ children }: IProvider) {
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <ToastContainer closeButton={true} position='bottom-right' theme='light' />
    </StoreProvider>
  )
}