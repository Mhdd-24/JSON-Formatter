# JSON Formatter

**JSON Formatter** is a simple tool that helps format and beautify your JSON data for better readability and debugging. It allows you to paste or upload raw JSON, and it will format it into a well-structured and easy-to-read format.

## Features

- **Automatic JSON Formatting**: Paste raw JSON, and the tool automatically formats it.
- **Supports Minified JSON**: Handles both pretty-printed and minified JSON.
- **Color-coded Syntax**: Highlights different JSON elements (keys, values, etc.) for easy identification.
- **Validation**: Automatically checks if the input is valid JSON and shows error messages if there are issues.
- **Collapsible Structure**: Organize JSON data into a collapsible tree for easy navigation.
- **Download Option**: Option to download the formatted JSON as a `.json` file.

## How to Use

1. **Paste JSON**: Paste your raw JSON data in the input box.
2. **Format**: Click the "Format" button to format your JSON data. If your input is invalid, the tool will notify you of errors.
3. **Download**: After formatting, you can download the prettified JSON by clicking the "Download" button.
4. **Copy**: You can also directly copy the formatted JSON by clicking the "Copy" button.

## Example

### Input (Raw JSON)
```json
{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York"}}
```

### Output (Formatted JSON)
```json
{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
```

## Installation

To install the **JSON Formatter**, clone the repository:

```bash
git clone https://github.com/Mhdd-24/JSON-Formatter.git
```

Navigate to the project directory:

```bash
cd json-formatter
```

Install dependencies (if applicable):

```bash
npm install
```

Run the application:

```bash
npm start
```

## Contributing

We welcome contributions to improve this project. To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and test.
4. Create a pull request with a description of your changes.

## License

This project is licensed under the MIT License.
