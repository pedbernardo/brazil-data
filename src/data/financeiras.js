import * as csv from '@fast-csv/parse'
import { Parser } from 'json2csv'

const FINANCEIRAS_FILE_PATH = './src/docs/participantes-str-12-09-2022.csv'

export async function getFinanceirasCsv () {
  const municipios = await getFinanceirasFromDocs()
  const json2csvParser = new Parser()
  const csv = json2csvParser.parse(municipios)

  return csv
}

async function getFinanceirasFromDocs () {
  const financeiras = []

  return new Promise((resolve) => {
    csv.parseFile(FINANCEIRAS_FILE_PATH, { headers: true })
      .on('error', console.error)
      .on('data', row => {
        if (row.Número_Código === 'n/a') return
        financeiras.push(
          parseFinanceiraRow(row)
        )
      })
      .on('end', () => resolve(financeiras))
  })
}

function parseFinanceiraRow (data) {
  return {
    nome_reduzido: data.Nome_Reduzido.trim(),
    nome_extenso: data.Nome_Extenso.trim(),
    codigo_compensacao: data['Número_Código']
  }
}
