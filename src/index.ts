#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';

const program = new Command();

program
  .name('xx-cli')
  .description('CLI tool for scaffolding Vue TypeScript projects')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new Vue TypeScript project')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string) => {
    try {
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

      const spinner = ora('Creating project...').start();
      
      // Clone the template repository
      const git = simpleGit();
      await git.clone('https://github.com/XinXiaoIsMe/vue-ts.git', projectName);
      
      // Remove .git directory
      fs.rmSync(path.join(projectName, '.git'), { recursive: true, force: true });
      
      // Update package.json
      const packageJsonPath = path.join(projectName, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageJson.name = projectName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      spinner.succeed(chalk.green('Project created successfully!'));
      
      console.log('\nNext steps:');
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan('  npm install'));
      console.log(chalk.cyan('  npm run dev'));
      
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program.parse(); 