import Joi from 'joi'

export const validarLogin = Joi.object({
  email: Joi.string().email().required().empty().messages({
    'any.required': 'Informe por favor o seu email',
    'string.base': 'Informe por favor um email válido',
    'string.empty': 'Informe o seu email por favor',
    'string.email': 'Informa por favor o seu email'
  }),
  senha: Joi.string().required().empty().messages({
    'any.required': 'Informe por favor a sua senha',
    'string.base': 'Informe por favor a sua senha',
    'string.empty': 'Informe por favor a sua senha',
  }),
  enderecoBlockchain: Joi.string()
})