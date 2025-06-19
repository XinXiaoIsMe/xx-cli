# XX-CLI

A versatile CLI tool for scaffolding projects from various templates. Support for Vue TypeScript projects and TypeScript library development, with an extensible architecture for future templates.

## Installation

```bash
npm install -g @bestwu/xx-cli
```

## Usage

### Create a new project

Interactive mode (recommended):
```bash
xx-cli create
```

Create a project with specific name:
```bash
xx-cli create my-project
```

Create a project with specific template:
```bash
xx-cli create my-project --template vue-ts
xx-cli create my-lib --template lib-ts
```

### List available templates

```bash
xx-cli list
```

## Available Templates

### `vue-ts`
- **Description**: Vue TypeScript project template for daily development
- **Repository**: https://github.com/xx-template/vue-ts.git
- **Use case**: Web applications, SPAs, Vue projects

### `lib-ts`
- **Description**: TypeScript library template for package development
- **Repository**: https://github.com/xx-template/lib-ts.git
- **Use case**: NPM packages, TypeScript libraries, reusable components

## Features

- 🎯 **Template Selection**: Choose from multiple project templates
- 🚀 **Interactive CLI**: User-friendly prompts for template and project name selection
- 📦 **Automatic Setup**: Package.json updates and clean git history
- 🔧 **Command Line Options**: Direct template specification for automation
- 📋 **Template Listing**: View all available templates and their descriptions
- 🎨 **Extensible**: Easy to add new templates in the future

## CLI Commands

| Command | Description | Options |
|---------|-------------|---------|
| `create [project-name]` | Create a new project | `-t, --template <template>` |
| `list` | List all available templates | - |

## Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Link the package globally:
   ```bash
   npm link
   ```

## Adding New Templates

To add a new template, update the `templates` array in `src/index.ts`:

```typescript
{
  name: 'template-name',
  description: 'Template description',
  repository: 'https://github.com/xx-template/template-repo.git',
  postCloneInstructions: [
    'npm install',
    'npm run start'
  ]
}
```

## License

MIT 