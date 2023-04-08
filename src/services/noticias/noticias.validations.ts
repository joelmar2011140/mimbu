import Joi from "joi";
import { ICriarNoticia } from "./noticias.types";

export const validarRegistoNoticia = Joi.object<ICriarNoticia>({
  tituloDaNoticia: Joi.string().required().empty().messages({
    'any.required': 'Por favor especifique um título para esta notícia',
    'string.base': 'Por favor especifique um título para esta notícia',
    'string.empty': 'Por favor especifique um título para esta notícia',
  }),
  conteudo: Joi.string().required().empty().messages({
    'any.required': 'Por favor dê um conteúdo à esta notícia',
    'string.base': 'Por favor dê um conteúdo à esta notícia',
    'string.empty':'Por favor dê um conteúdo à esta notícia',
  }),
  imagemDaNoticia: Joi.string().required().empty().messages({
    'any.required': 'Por favor indique uma imagem para notícia',
    'string.base': 'Por favor indique uma imagem para notícia',
    'string.empty': 'Por favor indique uma imagem para notícia',
  }),
  dataDaNoticia: Joi.string().required().empty().messages({
    'any.required': 'Por favor indique a data desta edição',
    'string.base': 'Por favor indique a data desta edição',
    'string.empty': 'Por favor indique a data desta edição',
  }),
})

export const validarAtualizarNoticia = Joi.object<ICriarNoticia>({
  tituloDaNoticia: Joi.string().empty().messages({
    'any.required': 'Por favor especifique um título para esta notícia',
    'string.base': 'Por favor especifique um título para esta notícia',
    'string.empty': 'Por favor especifique um título para esta notícia',
  }),
  conteudo: Joi.string().empty().messages({
    'any.required': 'Por favor dê um conteúdo à esta notícia',
    'string.base': 'Por favor dê um conteúdo à esta notícia',
    'string.empty':'Por favor dê um conteúdo à esta notícia',
  }),
  imagemDaNoticia: Joi.string().empty().messages({
    'any.required': 'Por favor indique uma imagem para notícia',
    'string.base': 'Por favor indique uma imagem para notícia',
    'string.empty': 'Por favor indique uma imagem para notícia',
  }),
  dataDaNoticia: Joi.string().empty().messages({
    'any.required': 'Por favor indique a data desta edição',
    'string.base': 'Por favor indique a data desta edição',
    'string.empty': 'Por favor indique a data desta edição',
  }),
})