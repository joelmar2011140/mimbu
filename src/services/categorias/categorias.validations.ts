import Joi from "joi";

export const validarRegistoCategoria = Joi.object({
  nomeCategoria: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor um nome para esta categoria',
    'string.base': 'Forneça por favor um nome para esta categoria',
    'string.empty': 'Forneça por favor um nome para esta categoria',
  })
})

export const validarAtualizarCategoria = Joi.object({
  nomeCategoria: Joi.string().empty().messages({
    'any.required': 'Forneça por favor um nome para esta categoria',
    'string.base': 'Forneça por favor um nome para esta categoria',
    'string.empty': 'Forneça por favor um nome para esta categoria',
  })
})