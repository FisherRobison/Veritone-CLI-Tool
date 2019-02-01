#!/usr/bin/env node
'use strict';

var program = require('commander');
var chalk = require("chalk");
var inquirer = require('inquirer'); // require inquirerjs library

var questions = require('./questions');
// Require logic.js file and extract controller functions using JS destructuring assignment

var _require = require('./logic'),
    listTDO = _require.listTDO,
    listEngines = _require.listEngines,
    createTDOWithAsset = _require.createTDOWithAsset,
    createJob = _require.createJob,
    createTDOWithJob = _require.createTDOWithJob,
    getLogs = _require.getLogs,
    createLibraryEntity = _require.createLibraryEntity,
    login = _require.login,
    logout = _require.logout,
    checkForAuth = _require.checkForAuth;

var prompt = inquirer.createPromptModule();

program.version('0.0.1').description('Veritone cli tool');

program.command('login').alias('l').description('Login to veritone').action(async function () {
  try {
    var answers = await prompt(questions.loginQuestions);
    var res = await login(answers);
    console.log(chalk.green.bold(res));
    //  if(res === 'unpwError'){
    //   console.log(chalk.red.bold(res));
    //  }else{
    //   console.log(chalk.green.bold(res));
    //  }
  } catch (err) {
    //chalk.red.bold(res)
    console.log(chalk.red.bold(err));
  }
});
program.command('logout').alias('lO').description('Logout of Veritone').action(async function () {
  try {
    await logout();
    console.log(chalk.blue.bold("Byeeeee"));
  } catch (err) {
    console.log('Error: ' + err);
  }
});

program.command('listAllTDO').alias('lA').description('List all TDOS Ids').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.ListTDOQuestions);
    listTDO(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('createTDO').alias('cT').description('Create a TDO from a local file').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.CreateTDOQuestions);
    createTDOWithAsset(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('createTDOWithJob').alias('cTJ').description('Create a TDO with a job from a local file').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.CreateTDOWithJobQuestions);
    createTDOWithJob(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('createJob').alias('cJ').description('Create a Job').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.CreateJobQuestions);
    createJob(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('getLogs').alias('gL').description('Get the logs for a recording').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.GetLogQuestions);
    getLogs(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('listEngines').alias('lE').description('Get a list of engines').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.ListTDOQuestions);
    listEngines(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.command('createLibraryEntity').alias('cLE').description('Create a library entity').action(async function () {
  try {
    await checkForAuth();
    var answers = await prompt(questions.createLibraryEntity);
    createLibraryEntity(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

program.parse(process.argv);