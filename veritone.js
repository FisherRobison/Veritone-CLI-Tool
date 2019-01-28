#!/usr/bin/env node
const questions = require('./questions')
const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const { listTDO,listEngines, createTDOWithAsset, createJob, createTDOWithJob, getLogs, createLibraryEntity } = require('./logic');
const { prompt } = require('inquirer'); // require inquirerjs library


program
  .version('0.0.1')
  .description('Veritone cli tool');

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
  .action(() => {
    prompt(questions.GetLogQuestions).then(answers =>
      getLogs(answers));
  })

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

program.parse(process.argv);