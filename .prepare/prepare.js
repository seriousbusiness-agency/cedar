import chalk from 'chalk';
import { stringify } from "comment-json";
import figlet from 'figlet';
import fs from 'fs';
import { glob } from 'glob';
import inquirer from 'inquirer';
import os from 'os';
import { join, resolve } from 'path';
import shell from 'shelljs';

import nodemon from '../nodemon.json' with { type: 'json' };
import pkg from '../package.json' with { type: 'json' };

const getCommand = props => `cross-env ${props.env} webpack ${props.dev ? 'serve' : ''} --config ./config/webpack.config.js`

let baseCommand
let nvmCommand = ''

switch (os.type()) {
	case 'Linux':
	case 'Darwin':
		baseCommand = `reset && source $HOME/.nvm/nvm.sh; nvm use;`
		break
	case 'Windows_NT':
		{
			nvmCommand = `nvm use ${fs.readFileSync('.nvmrc', 'utf8').replace('v', '')}`
			baseCommand = `cls &&`
		}
		break
	default:
}

const devCommand = `${baseCommand} ${getCommand({env: 'DEBUG=1 NODE_ENV=development NODE_NO_WARNINGS=1', dev: true})}`
const buildCommand = `${baseCommand} ${getCommand({env: 'NODE_ENV=production'})}`
const buildDebugCommand = `${baseCommand} ${getCommand({env: 'DEBUG=1 NODE_ENV=production'})}`

fs.writeFileSync(`./nodemon.json`, stringify({ ...nodemon, exec: devCommand }, null, 3), 'utf8')
fs.writeFileSync(`./package.json`, stringify({ ...pkg, scripts: {...pkg.scripts, build: buildCommand, 'build:debug': buildDebugCommand, use: nvmCommand} }, null, 3), 'utf8')

//-----
const PREPARE_DIR = resolve(`.prepare`);
const VENDORS_DIR = join(PREPARE_DIR, 'vendors');
const INSTALL_DIR = join(PREPARE_DIR, 'install');
const PUBLIC_DIR = resolve(`./${join('src', 'public')}`);

const listDirectories = (path) => {
   return fs.readdirSync(path, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
}

// clear();

console.log(
   chalk.red(
      figlet.textSync('BOILERPLATE', { horizontalLayout: 'full' })
   )
)

//prepare files
if (fs.existsSync(VENDORS_DIR)) {
   const questions = [
      {
         name: 'type',
         type: 'list',
         message: 'Select the project type:',
         choices: listDirectories(VENDORS_DIR),
         default: 'wordpress',
      },
   ];

   const answers = await inquirer.prompt(questions)
   const vendorDir = join(VENDORS_DIR, answers.type)

   const vendorFiles = glob.sync(`${vendorDir}/**/{,.}*`.replace(/\\/g, '/'))
   vendorFiles.forEach(file => fs.cpSync(file, join(INSTALL_DIR, file.replace(vendorDir, '')), { recursive: true }));
   fs.rmSync(VENDORS_DIR, { recursive: true, force: true });
   fs.writeFileSync(`${PREPARE_DIR}/config.json`, JSON.stringify(answers), 'utf8');
}

//install
const config = JSON.parse(fs.readFileSync(`${PREPARE_DIR}/config.json`));
const install = async () =>{
   const publicInstallDir = join(INSTALL_DIR, 'public');
   const publicFiles = glob.sync(`${publicInstallDir}/**/{,.}*`.replace(/\\/g, '/'))

	 if (fs.existsSync(publicInstallDir)) {
		 publicFiles.forEach(file => fs.cpSync(file, join(PUBLIC_DIR, file.replace(publicInstallDir, '')), { recursive: true }));
		 fs.rmSync(publicInstallDir, { recursive: true, force: true });
	 }

	 if (!fs.existsSync(`./.env`)) fs.cpSync(`${INSTALL_DIR}/.env`, `./.env`);

   const composerPath = `${INSTALL_DIR}/composer.json`;
   if (fs.existsSync(composerPath) && process.env.CI !== 'true') {
      const answer = await inquirer.prompt({
         name: 'install',
         type: 'list',
         message: `How do you want to install ${config.type}?`,
         choices: [
            {
               name: 'Manual',
               value: 0,
            },
            {
               name: 'Composer',
               value: 1,
            }
         ],
         default: 1,
      })

      if (answer.install) {
         shell.exec(`COMPOSER=${INSTALL_DIR}/composer.json php ${PREPARE_DIR}/composer install`);
         fs.rmSync('./vendor', { recursive: true, force: true });
      }
   }else fs.rmSync(`${PREPARE_DIR}/composer`, { force: true });
}

if(fs.existsSync('./.env')){
   const answer = await inquirer.prompt({
      name: 'reinstall',
      type: 'list',
      message: `Your ${config.type} project is already installed, would you like to reinstall?`,
      choices: [
         {
            name: 'No',
            value: 0,
         },
         {
            name: 'Yes',
            value: 1,
         }
      ],
      default: 0,
   })

   if(answer.reinstall) install();
   else process.kill(0);
}else install();
