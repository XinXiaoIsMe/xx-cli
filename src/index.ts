#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';

const program = new Command();

// Template configuration - easily extensible for future templates
interface Template {
  name: string;
  description: string;
  repository: string;
  postCloneInstructions?: string[];
}

const templates: Template[] = [
  {
    name: 'vue-ts',
    description: 'Vue TypeScript project template for daily development',
    repository: 'https://github.com/xx-template/vue-ts.git',
    postCloneInstructions: [
      'npm install',
      'npm run dev'
    ]
  },
  {
    name: 'lib-ts',
    description: 'TypeScript library template for package development',
    repository: 'https://github.com/xx-template/lib-ts.git',
    postCloneInstructions: [
      'npm install',
      'npm run build'
    ]
  }
];

program
  .name('xx-cli')
  .description('CLI tool for scaffolding projects from templates')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new project from template')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (vue-ts, lib-ts)')
  .action(async (projectName?: string, options?: { template?: string }) => {
    try {
      let selectedTemplate: Template;

      // Select template if not provided via option
      if (options?.template) {
        const template = templates.find(t => t.name === options.template);
        if (!template) {
          console.error(chalk.red(`Template "${options.template}" not found.`));
          console.log(chalk.yellow('Available templates:'));
          templates.forEach(t => {
            console.log(chalk.cyan(`  ${t.name}: ${t.description}`));
          });
          process.exit(1);
        }
        selectedTemplate = template;
      } else {
        // Display available templates first
        console.log(chalk.green('Available templates:\n'));
        templates.forEach(template => {
          console.log(chalk.cyan(`📦 ${template.name}`));
          console.log(`   ${template.description}`);
          console.log(chalk.gray(`   Repository: ${template.repository}\n`));
        });

        const templateAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Which template would you like to use?',
            choices: templates.map(template => ({
              name: `${template.name} - ${template.description}`,
              value: template
            }))
          }
        ]);
        selectedTemplate = templateAnswer.template;
      }

      // If project name is not provided, prompt for it
      if (!projectName) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            validate: (input: string) => {
              if (!input) return 'Project name is required';
              if (fs.existsSync(input)) return 'Directory already exists';
              return true;
            },
          },
        ]);
        projectName = answers.projectName;
      }

      if (!projectName) {
        throw new Error('Project name is required');
      }

      // Check if directory already exists
      if (fs.existsSync(projectName)) {
        console.error(chalk.red(`Directory "${projectName}" already exists`));
        process.exit(1);
      }

      const spinner = ora(`Creating ${selectedTemplate.name} project...`).start();
      
      // Clone the template repository
      const git = simpleGit();
      await git.clone(selectedTemplate.repository, projectName);
      
      // Remove .git directory
      const gitPath = path.join(projectName, '.git');
      if (fs.existsSync(gitPath)) {
        fs.rmSync(gitPath, { recursive: true, force: true });
      }
      
      // Update package.json
      const packageJsonPath = path.join(projectName, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        packageJson.name = projectName;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      spinner.succeed(chalk.green(`${selectedTemplate.name} project created successfully!`));
      
      console.log(chalk.green(`\n✨ Created project "${projectName}" using ${selectedTemplate.name} template`));
      console.log('\nNext steps:');
      console.log(chalk.cyan(`  cd ${projectName}`));
      
      if (selectedTemplate.postCloneInstructions) {
        selectedTemplate.postCloneInstructions.forEach(instruction => {
          console.log(chalk.cyan(`  ${instruction}`));
        });
      }
      
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

// Add a command to list available templates
program
  .command('list')
  .description('List all available templates')
  .action(() => {
    console.log(chalk.green('Available templates:\n'));
    templates.forEach(template => {
      console.log(chalk.cyan(`📦 ${template.name}`));
      console.log(`   ${template.description}`);
      console.log(chalk.gray(`   Repository: ${template.repository}\n`));
    });
  });

program.parse(); 