import axios from 'axios'
import { JSDOM } from 'jsdom'
import { pipe } from 'ramda'
import { Parser } from 'json2csv'

const CONCLA_PAGE_URL = 'https://concla.ibge.gov.br/estrutura/natjur-estrutura/natureza-juridica-2021.html'
const NATUREZA_JURDICA_REGEX = /\d{3}[-]?\d{1}/

const stripeCodigoNaturezaJuridica = naturezaJuridica => {
  const codigo = (naturezaJuridica ?? '').substring(0, 5)
  if (!isCodigoNaturezaJuridica(codigo)) return
  return codigo
}

const isCodigoNaturezaJuridica = codigo => NATUREZA_JURDICA_REGEX.test(codigo)

export async function getNaturezaJuridicaCsv () {
  const naturezasJuridicas = await getDataFromConcla()
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(naturezasJuridicas)

  return csv
}

async function getDataFromConcla () {
  const { data } = await axios.get(CONCLA_PAGE_URL)
  const naturezasJuridicas = parseConclaPage(data)

  return naturezasJuridicas
}

function parseConclaPage (html) {
  const dom = new JSDOM(html)
  const items = [
    ...dom.window.document.querySelectorAll('#conteudo_centro [itemprop=articleBody] a')
  ]
    .map(item => (item.textContent ?? '').trim())
    .filter(item => pipe(stripeCodigoNaturezaJuridica, isCodigoNaturezaJuridica)(item))
    .map(item => ({ natureza_juridica: item }))

  return items
}
