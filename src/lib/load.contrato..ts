import Contract from '@truffle/contract';

export async function loadContrato (provider: any): Promise<any> {
  const fromApi = await fetch('/contratos/Votacao.json')
  const ContratoBruto = await fromApi.json()
  const contrato = Contract(ContratoBruto)
  contrato.setProvider(provider);
  const contratoDeployed = await contrato.deployed()
  return Object.keys(contratoDeployed).length > 0 ? contratoDeployed : null
}