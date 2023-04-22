import ApiError from './APIError'
import moment from 'moment'

export function verificarDatas (dataInicio: string, dataFim: string): void {
  const hoje = moment()
  const dataInicioNormalizada = moment(dataInicio, 'YYYY-MM-DD', true)
  const dataFimNormalizada = moment(dataFim, 'YYYY-MM-DD', true)
  // Verificar se a data está numdeterminado formato
  if (!dataInicioNormalizada.isValid() || !dataFimNormalizada.isValid()) {
    throw new ApiError('APIERROR', 'Indique por favor uma data válida, a data deve estar neste formato (2023-04-12)', 400)
  }
  // A Data de ínicio não pode estar antes do dia atual
  if (dataInicioNormalizada.isBefore(hoje)) {
    throw new ApiError('APIERROR', 'Indique por favor uma data de ínicio válida, pois a data indicada parece já ter passado', 400)
  }
  // A Data de fim  não pode estar antes do dia atual
  if (dataFimNormalizada.isBefore(hoje)) {
    throw new ApiError('APIERROR', 'Indique por favor uma data de fim válida,pois a data indicada parece já ter passado', 422)
  }
  // A data de início não pode estar depois da data de fim
  if (dataInicioNormalizada.isAfter(dataFimNormalizada)) {
    throw new ApiError('APIERROR', 'A Data de ínicio não pode estar depois da data de fim de evento', 422)
  }
  // A data de fim não pode estar antes da data de início
  if (dataFimNormalizada.isBefore(dataInicioNormalizada)) {
    throw new ApiError('APIERROR', 'A Data de fim não pode estar antes da data de início de evento', 422)
  }
}

export function verificarData (tipo: 'dataInicio' | 'datafim', data: string, dataFromDb?: string): void {
  const hoje = moment()
  const dataNormalizada = moment(data, 'YYYY-MM-DD', true)
  switch (tipo) {
    case 'dataInicio':
      if (!dataNormalizada.isValid()) {
        throw new ApiError('APIERROR', 'Indique por favor uma data de início válida, a data deve estar neste formato (2023-04-12)', 422)
      }
      if (dataNormalizada.isBefore(hoje)) {
        throw new ApiError('APIERROR', 'Indique por favor uma data de ínicio válida, pois a data indicada parece já ter passado', 422)
      }
      if (dataNormalizada.isAfter(dataFromDb)) {
        throw new ApiError('APIERROR', 'A Data de ínicio não pode estar depois da data de fim de evento', 422)
      }
      break
    case 'datafim':
      if (!dataNormalizada.isValid()) {
        throw new ApiError('APIERROR', 'Indique por favor uma data de fim válida, a data deve estar neste formato (2023-04-12)', 422)
      }
      if (dataNormalizada.isBefore(hoje)) {
        throw new ApiError('APIERROR', 'Indique por favor uma data de fim válida, pois a data indicada parece já ter passado', 422)
      }
      if (dataNormalizada.isBefore(dataFromDb)) {
        throw new ApiError('APIERROR', 'A Data de fim não pode estar antes da data de início de evento', 422)
      }
      break
  }
}