import { useCallback, useEffect, useState } from 'react';
import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { loadContrato } from '@/lib/load.contrato.';


const useBlockChain = () => {
  const [blockChain, setBlockchain] = useState({ web3: null, contrato: null })
  const startBlockChain = useCallback(async () => {
    const provider = await detectEthereumProvider()
    if (provider == null) {
      toast('Certifique-se por favor que tem instalado no seu browser uma carteira digital (ex: metamask, coinbase)')
      return
    }
    const web3: any = new Web3(provider as any)
    const contrato = await loadContrato(web3.currentProvider)
    setBlockchain({ web3, contrato })
  }, [])

  useEffect(() => {
  	startBlockChain()
  }, [startBlockChain]);

  return { blockChain }
};

export default useBlockChain
