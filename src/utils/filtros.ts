import Fuse from 'fuse.js'

export function pesquisar (conteudo: any, sq: string, keys: string[]): any {
  let data = []
  const fuse = new Fuse(conteudo, { keys,  includeMatches: true })
  if (sq.length > 0) {
    data = fuse.search(sq).map((itemData: any) => ({ ...itemData.item }))
  }
  return data
}
