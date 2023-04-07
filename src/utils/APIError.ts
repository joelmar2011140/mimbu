export default class ApiError extends Error {
  constructor (public nomeErro: string,public  mensagem: string,public  status: number,public  isOperational: boolean = true) {
    super(nomeErro)
    Error.captureStackTrace(this, ApiError)
    this.nomeErro = this.nomeErro
    this.status = status
    this.mensagem = mensagem
    this.isOperational = isOperational
    this.printErro()
  }

  private printErro () {
    console.error(`Foi encontrado um erro\nNome: ${this.nomeErro}\nCausa: ${this.cause}\nMensagem: ${this.mensagem}\nErro de Programação: ${this.isOperational}\n`, this.stack)
  }
}