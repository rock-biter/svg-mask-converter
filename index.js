const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

// Funzione per leggere un file SVG e convertirlo in oggetto JSON
const parseSVG = async (svgPath) => {
	const svgData = fs.readFileSync(svgPath, 'utf8')
	const parser = new xml2js.Parser()
	const result = await parser.parseStringPromise(svgData)
	return result
}

// Funzione per estrarre le coordinate dei tracciati dai dati SVG
const extractPaths = (svgObject) => {
	const paths = svgObject.svg.path || []
	const polygons = paths.map((path) => {
		const d = path.$.d
		const points = []

		// Estrazione dei punti dal comando "M" (move to) e "L" (line to) dell'SVG
		const commands = d.match(/[MLC]\s*[^MLC]*/g)
		if (commands) {
			commands.forEach((command) => {
				const coords = command
					.replace(/[A-Za-z]/g, '') // Rimuovi lettere (M, L, C, etc.)
					.trim()
					.split(/\s+/)
					.map((coord) => {
						const [x, y] = coord.split(',').map(parseFloat)
						return { x, y }
					})
				points.push(...coords)
			})
		}

		return points
	})

	return polygons
}

// Funzione per generare il file JavaScript con i dati estratti
const generateJSFile = (fileName, polygons, outputDir) => {
	const jsContent = `module.exports = {
    name: '${fileName}',
    polygons: ${JSON.stringify(polygons, null, 4)},
  };`

	fs.writeFileSync(path.join(outputDir, `${fileName}.js`), jsContent)
	console.log(`File generato per ${fileName}`)
}

// Funzione principale per elaborare i file SVG
const processSVGFiles = async (svgFileName, outputDir) => {
	const svgPath = path.join(__dirname, 'svg', svgFileName)

	if (!fs.existsSync(svgPath)) {
		console.error(`File ${svgFileName} non trovato nella cartella 'svg'`)
		return
	}

	const svgObject = await parseSVG(svgPath)
	const polygons = extractPaths(svgObject)
	generateJSFile(svgFileName.replace('.svg', ''), polygons, outputDir)
}

// Parametri: Nome del file SVG e cartella di output
const svgFileName = process.argv[2] // Prende il nome del file SVG come argomento
const outputDir = path.join(__dirname, 'output')

// Creazione della cartella di output se non esiste
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir)
}

// Avvio del processo
if (svgFileName) {
	processSVGFiles(svgFileName, outputDir)
} else {
	console.log('Per favore, fornisci il nome del file SVG come argomento.')
}
