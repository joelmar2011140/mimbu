import moment from "moment"

export async function fetchEdicoes() {
  const raw = await fetch('http://localhost:3000/api/edicoes')
  const data = await raw.json()
  return data.data
}

export async function fetchEdicoesUser() {
  const raw = await fetch('http://localhost:3000/api/edicoes')
  const agora = moment()
  const data = await raw.json()
  const toFilter = data.data.filter((evento: any) => (moment(evento.dataTermino, 'YYYY-MM-DD', true).format('YYYY-MM-DD') !== agora.format('YYYY-MM-DD')))
  return toFilter
}


export async function fetchEdicao(idEdicao: string) {
  const raw = await fetch(`http://localhost:3000/api/edicoes/${idEdicao}`)
  const data = await raw.json()
  return data.data
}