import axios from 'axios'
import { Parser } from 'json2csv'

const CNAE_IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v2/cnae/subclasses'

export async function getCnaeCsv () {
  const cnaes = await getDataFromIbge()
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(cnaes)

  return csv
}

async function getDataFromIbge () {
  const { data } = await axios.get(CNAE_IBGE_API_URL)
  const cnaes = parseIbgeResponse(data)

  return cnaes
}

function parseIbgeResponse (data) {
  const subclassesByAtividade = data
    .map(({ id, descricao }) => ({ id, descricao }))

  return [
    ...new Map(subclassesByAtividade
      .map(cnae => [cnae.id, cnae]))
      .values()
  ]
}
