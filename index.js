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
	let allPoints = []

	const { width, height } = svgObject.svg.$
	console.log('svg', width, height)
	console.log('paths', paths)

	const polygons = paths.map((path) => {
		const d = path.$.d
		const points = []

		// Suddividi la stringa in comandi, rimuovendo spazi e lettere
		const commands = d.match(/[A-Za-z][^A-Za-z]*/g)
		let currentX = 0
		let currentY = 0

		if (commands) {
			commands.forEach((command) => {
				const type = command[0] // Tipo di comando (M, L, V, H, Z)
				const coords = command.slice(1).trim().split(/\s+/).map(parseFloat)

				switch (type) {
					case 'M': // "Move To" - Imposta il punto iniziale
						currentX = coords[0]
						currentY = coords[1]
						points.push({ x: currentX, y: currentY })
						break
					case 'L': // "Line To" - Disegna una linea fino al punto specificato
						currentX = coords[0]
						currentY = coords[1]
						points.push({ x: currentX, y: currentY })
						break
					case 'V': // "Vertical Line To" - Disegna una linea verticale (solo y)
						currentY = coords[0]
						points.push({ x: currentX, y: currentY })
						break
					case 'H': // "Horizontal Line To" - Disegna una linea orizzontale (solo x)
						currentX = coords[0]
						points.push({ x: currentX, y: currentY })
						break
					case 'Z': // "Close Path" - Torna al punto iniziale
						// points.push({ x: points[0].x, y: points[0].y })
						break
					default:
						break
				}
			})
		}

		const first = points[0]
		const last = points.pop()
		console.log(first, last)
		if (first.x != last.x || first.y != last.y) {
			points.push(last)
		}

		// Aggiungi i punti al array allPoints per il calcolo delle coordinate normalizzate
		allPoints = allPoints.concat(points)

		return points
	})

	// Funzione di normalizzazione
	const normalize = (x, y) => ({
		x: x / width,
		y: y / height,
	})

	const round = (x, y, n = 2) => {
		const scale = 10 ** n
		return {
			x: Math.round(x * scale) / scale,
			y: Math.round(y * scale) / scale,
		}
	}

	// Normalizza i punti
	const normalizedPolygons = polygons.map(
		(polygon) => polygon.map((point) => normalize(point.x, point.y))
		// .map((point) => round(point.x, point.y, 2))
	)

	return normalizedPolygons
}

// Funzione per generare il file JavaScript con i dati estratti
const generateJSFile = (fileName, polygons, outputDir) => {
	const jsContent = `module.exports = {
    name: '${fileName}',
    polygons: [
      ${polygons.map((poligon) => {
				return `  [
          ${poligon.map((point) => {
						return `{ x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)}}`
					}).join(`,
          `)}
        ]`
			}).join(`,
      `)}
    ],
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
