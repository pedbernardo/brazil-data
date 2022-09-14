import { rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { getNaturezaJuridicaCsv } from './data/natureza-juridica.js'
import { getCnaeCsv } from './data/cnae.js'
import { getEstadosCsv } from './data/uf.js'
import { getMunicipiosCsv } from './data/municipios.js'
import { getFinanceirasCsv } from './data/financeiras.js'

const OUTPUT_FOLDER = './dist'

function generateFiles (files) {
  rmSync(OUTPUT_FOLDER, { recursive: true, force: true })
  mkdirSync(OUTPUT_FOLDER)

  files.forEach(({ data, filename }) =>
    writeFileSync(`${OUTPUT_FOLDER}/${filename}`, data)
  )
}

async function start () {
  const [
    estadosCSV,
    MunicipiosCSV,
    NaturezasJuridicasCSV,
    CNAEsCSV,
    financeirasCSV
  ] = await Promise.all([
    getEstadosCsv(),
    getMunicipiosCsv(),
    getNaturezaJuridicaCsv(),
    getCnaeCsv(),
    getFinanceirasCsv()
  ])

  const timestamp = new Date()
    .toISOString()
    .replace(/T.*/, '')
    .split('-')
    .reverse()
    .join('-')

  const files = [{
    data: estadosCSV,
    filename: `estados-${timestamp}.csv`
  }, {
    data: MunicipiosCSV,
    filename: `municipios-${timestamp}.csv`
  }, {
    data: NaturezasJuridicasCSV,
    filename: `naturezas-juridicas-${timestamp}.csv`
  }, {
    data: CNAEsCSV,
    filename: `cnaes-${timestamp}.csv`
  }, {
    data: financeirasCSV,
    filename: `financeiras-${timestamp}.csv`
  }]

  generateFiles(files)
}

start()
