import axios from 'axios'
import { Parser } from 'json2csv'

const ESTADOS_IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

export async function getEstadosCsv () {
  const estados = await getDataFromIbge()
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(estados)

  return csv
}

async function getDataFromIbge () {
  const { data } = await axios.get(ESTADOS_IBGE_API_URL)
  const estados = parseIbgeResponse(data)

  return estados
}

function parseIbgeResponse (data) {
  return data.map(({ sigla, nome }) => ({ sigla, nome }))
}
