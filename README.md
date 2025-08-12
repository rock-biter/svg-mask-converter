# SVG Path Normalizer

This Node.js library allows you to read SVG files containing paths and extract the coordinates of the points within those paths. The coordinates are then normalized between 0 and 1 based on the path's dimensions. A JavaScript file is generated containing an object with all the information about the positions of the path points.

## Features

- Extracts coordinates from SVG paths.
- Supports SVG path commands: `M`, `L`, `V`, `H`, `Z`.
- Normalizes the coordinates between 0 and 1 based on the svg sizes.
- Generates JavaScript files containing normalized data, which can be used for animations or other applications.

## Requirements

To run this library, you need to have Node.js installed on your system.

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/rock-biter/svg-mask-converter.git
```

2. **Install the dependencies**:

```bash
npm install
```

## Usage

### 1. Add SVG Files

Place your SVG files in the `svg` folder of the project. Each SVG file should contain paths you want to extract and normalize.

### 2. Run the Script

To generate JavaScript files with the normalized data, run the script by passing the SVG file name you want to process as an argument. You can do this from the command line as follows:

```bash
node script.js filename.svg
```

Where `filename.svg` is the name of the SVG file located in the `svg` folder.

### 3. Output

The script will generate a `.js` file in the `output` folder containing an object with the name of the SVG file and the normalized coordinates of the path points.

Example of the generated content:

```javascript
module.exports = {
	name: 'svg-mask-medium-03',
	polygons: [
		[
			{ x: 0.0, y: 0.0 },
			{ x: 0.18, y: 0.0 },
			{ x: 0.62, y: 1.0 },
			{ x: 0.0, y: 1.0 },
		],
		[
			{ x: 0.18, y: 0.0 },
			{ x: 1.0, y: 0.0 },
			{ x: 0.76, y: 1.0 },
			{ x: 0.62, y: 1.0 },
		],
		[
			{ x: 1.0, y: 0.0 },
			{ x: 1.0, y: 0.43 },
			{ x: 1.0, y: 1.0 },
			{ x: 0.76, y: 1.0 },
		],
	],
}
```

### 4. Folder Structure

- **`svg/`**: Contains the SVG files to be processed.
- **`output/`**: The folder where the `.js` files with the normalized data are generated.

### Supported SVG Commands

The library supports the following SVG path commands:

- **M**: "Move To" – Sets the starting position.
- **L**: "Line To" – Draws a line to the specified point.
- **V**: "Vertical Line To" – Draws a vertical line to the specified `y` coordinate.
- **H**: "Horizontal Line To" – Draws a horizontal line to the specified `x` coordinate.
- **Z**: "Close Path" – Closes the path and returns to the starting point.

## Example Usage

### Example 1: Running the Script with an SVG File

Suppose you have an SVG file named `example.svg` in the `svg` folder.

```bash
node script.js example.svg
```

The output will be a file `example.js` in the `output` folder, containing the normalized path data.

### Example 2: Generated File

The `example.js` file will look like this:

```javascript
module.exports = {
	name: 'example',
	polygons: [
		[
			{ x: 0.0, y: 0.0 },
			{ x: 0.1, y: 0.0 },
			{ x: 0.5, y: 1.0 },
			{ x: 0.0, y: 1.0 },
		],
		[
			{ x: 0.1, y: 0.0 },
			{ x: 1.0, y: 0.0 },
			{ x: 0.8, y: 1.0 },
			{ x: 0.5, y: 1.0 },
		],
	],
}
```

The coordinates are normalized between 0 and 1.

## Contributing

If you'd like to contribute to this library, feel free to fork the repository, create a branch for your changes, and submit a pull request. Please make sure to test your changes thoroughly before submitting them.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

### Customizations

- **Customize Output Format**: If you'd like to change the format of the generated data or add additional functionality, you can modify the `generateJSFile` function.
- **Support for Other SVG Commands**: If you need to support other SVG commands, you can expand the logic inside the `extractPaths` function to handle them.

---

This `README.md` will provide users with all the necessary information to install, use, and contribute to the project. Let me know if you need any further adjustments or modifications!
