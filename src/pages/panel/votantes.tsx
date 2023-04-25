import { TableVotantes } from '@/components/Tables/Tabela'
import useBlockChain from '@/hooks/useBlockchain'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useStoreActions } from 'easy-peasy'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function VotantesPage() {
  const { blockChain } = useBlockChain()
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const roteador = useRouter()

  useEffect(() => {
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain])

  return (
    <DashboardLayout>
      <TableVotantes />
    </DashboardLayout>
  )
}
