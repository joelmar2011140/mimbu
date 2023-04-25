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

export async function fetchCategorias() {
  const raw = await fetch('/api/categorias')
  const data = await raw.json()
  return data.data
}


export async function fetchEdicoesParam(pagina: number, porPagina: number, sq?: string) {
  if (sq != null && sq?.length > 0) {
    const raw = await fetch(`/api/edicoes?pagina=${pagina}&porPagina=${porPagina}&sq=${sq}`)
    const data = await raw.json()
    return data
  }
  const raw = await fetch(`/api/edicoes?pagina=${pagina}&porPagina=${porPagina}`)
  const data = await raw.json()
  return data
}

export async function fetchArtistasParam(pagina: number, porPagina: number, sq?: string) {
  if (sq != null && sq?.length > 0) {
    const raw = await fetch(`/api/artistas?pagina=${pagina}&porPagina=${porPagina}&sq=${sq}`)
    const data = await raw.json()
    return data
  }
  const raw = await fetch(`/api/artistas?pagina=${pagina}&porPagina=${porPagina}`)
  const data = await raw.json()
  return data
}

export async function fetchCategoriasParam(pagina: number, porPagina: number, sq?: string) {
  if (sq != null && sq?.length > 0) {
    const raw = await fetch(`/api/categorias?pagina=${pagina}&porPagina=${porPagina}&sq=${sq}`)
    const data = await raw.json()
    return data
  }
  const raw = await fetch(`/api/categorias?pagina=${pagina}&porPagina=${porPagina}`)
  const data = await raw.json()
  return data
}

export async function fetchVotantesParam(pagina: number, porPagina: number, sq?: string) {
  if (sq != null && sq?.length > 0) {
    const raw = await fetch(`/api/votantes?pagina=${pagina}&porPagina=${porPagina}&sq=${sq}`)
    const data = await raw.json()
    return data
  }
  const raw = await fetch(`/api/votantes?pagina=${pagina}&porPagina=${porPagina}`)
  const data = await raw.json()
  return data
}

export async function fetchNoticiasParam(pagina: number, porPagina: number, sq?: string) {
  if (sq != null && sq?.length > 0) {
    const raw = await fetch(`/api/noticias?pagina=${pagina}&porPagina=${porPagina}&sq=${sq}`)
    const data = await raw.json()
    return data
  }
  const raw = await fetch(`/api/noticias?pagina=${pagina}&porPagina=${porPagina}`)
  const data = await raw.json()
  return data
}

export async function fetchEdicao(idEdicao: string) {
  const raw = await fetch(`http://localhost:3000/api/edicoes/${idEdicao}`)
  const data = await raw.json()
  return data.data
}