#!/usr/bin/env node
const questions = require('./questions')
const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const { listTDO, listEngines, createTDOWithAsset, createJob, createTDOWithJob, getLogs, createLibraryEntity, login, logout, checkForAuth } = require('./logic');
const inquirer = require('inquirer'); // require inquirerjs library
var prompt = inquirer.createPromptModule();
const chalk = require("chalk");



program
  .version('0.0.1')
  .description('Veritone cli tool');


program
  .command('login')
  .alias('l')
  .description('Login to veritone')
  .action(() => {
    prompt(questions.loginQuestions).then(answers =>
      login(answers).then(response =>{
        console.log(chalk.green.bold(response))
      }));
  });
program
  .command('logout')
  .alias('lO')
  .description('Logout of Org')
  .action( async () => {
    try{
      await logout();
      console.log(chalk.blue.bold("Byeeeee"))
    }catch(err){
      console.log(`Error: ${err}`)
    }
  });

program
  .command('listTDO')
  .alias('a')
  .description('List TDOS Ids')
  .action(() => {
    prompt(questions.ListTDOQuestions).then(answers =>
      listTDO(answers));
  });

program
  .command('createTDO')
  .alias('a')
  .description('Create a TDO from a local file')
  .action(() => {
    prompt(questions.CreateTDOQuestions).then(answers =>
      createTDOWithAsset(answers));
  });

program
  .command('createTDOWithJob')
  .alias('a')
  .description('Create a TDO from a local file')
  .action(() => {
    prompt(questions.CreateTDOWithJobQuestions).then(answers =>
      createTDOWithJob(answers));
  });

program
  .command('createJob')
  .alias('r')
  .description('Create a Job')
  .action(() => {
    prompt(questions.CreateJobQuestions).then(answers =>
      createJob(answers));
  });


program
  .command('getLogs')
  .alias('r')
  .description('Get the logs for a recording')
  .action(async () => {
    try{
    await checkForAuth();
    const answers  = prompt(questions.GetLogQuestions);
    getLogs(answers);
  }catch(err){
    if(err === 'UnAuthenticated'){
      console.log(chalk.red("You need to login!"));
    }
    console.log(`Error: ${err}`)
  }

  })

// program
//   .command('getLogs')
//   .alias('r')
//   .description('Get the logs for a recording')
//   .action(async () => {
//     try {
//       await checkForAuth();
//       const answers = prompt(questions.GetLogQuestions);

//     } catch (err) {
//       if (err === 400) {
//         console.log(chalk.blue('Must be Logged In!'));

//       }
//       console.log(err);
//     }

//   })
program
  .command('listEngines')
  .alias('r')
  .description('Get the logs for a recording')
  .action(() => {
    prompt(questions.ListTDOQuestions).then(answers =>
      listEngines(answers));
  })

program
  .command('createLibraryEntity')
  .alias('r')
  .description('Get the logs for a recording')
  .action(() => {
    prompt(questions.createLibraryEntity).then(answers =>
      createLibraryEntity(answers));
  })


// program
//   .command('nestedLog')
//   .alias('nL')
//   .description('Get the logs for a recording')
//   .action(() => {
//     prompt(questions.loginQuestions)
//       .then(answers =>
//         login(answers))
//       .then((answers) => {
//         prompt(questions.GetLogQuestions).then(answers => {
//           getLogs(answers)
//         });

//       })
//   })



program.parse(process.argv);