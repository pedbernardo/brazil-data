import axios from 'axios'
import { Parser } from 'json2csv'

const MUNICIPIOS_IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado'

export async function getMunicipiosCsv () {
  const municipios = await getDataFromIbge()
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(municipios)

  return csv
}

async function getDataFromIbge () {
  const { data } = await axios.get(MUNICIPIOS_IBGE_API_URL)
  const municipios = parseIbgeResponse(data)

  return municipios
}

function parseIbgeResponse (data) {
  return data.map(entry => ({
    estadoSigla: entry['UF-sigla'],
    municipio: entry['municipio-nome']
  }))
}
