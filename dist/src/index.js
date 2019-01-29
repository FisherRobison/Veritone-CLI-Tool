#!/usr/bin/env node
'use strict';

var questions = require('./questions');
var program = require('commander');
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

var inquirer = require('inquirer'); // require inquirerjs library
var prompt = inquirer.createPromptModule();
var chalk = require("chalk");

program.version('0.0.1').description('Veritone cli tool');

program.command('login').alias('l').description('Login to veritone').action(function () {
  prompt(questions.loginQuestions).then(function (answers) {
    return login(answers).then(function (response) {
      console.log(chalk.green.bold(response));
    });
  });
});
program.command('logout').alias('lO').description('Logout of Org').action(async function () {
  try {
    await logout();
    console.log(chalk.blue.bold("Byeeeee"));
  } catch (err) {
    console.log('Error: ' + err);
  }
});

program.command('listTDO').alias('a').description('List TDOS Ids').action(function () {
  prompt(questions.ListTDOQuestions).then(function (answers) {
    return listTDO(answers);
  });
});

program.command('createTDO').alias('a').description('Create a TDO from a local file').action(function () {
  prompt(questions.CreateTDOQuestions).then(function (answers) {
    return createTDOWithAsset(answers);
  });
});

program.command('createTDOWithJob').alias('a').description('Create a TDO from a local file').action(function () {
  prompt(questions.CreateTDOWithJobQuestions).then(function (answers) {
    return createTDOWithJob(answers);
  });
});

program.command('createJob').alias('r').description('Create a Job').action(function () {
  prompt(questions.CreateJobQuestions).then(function (answers) {
    return createJob(answers);
  });
});

program.command('getLogs').alias('r').description('Get the logs for a recording').action(async function () {
  try {
    await checkForAuth();
    var answers = prompt(questions.GetLogQuestions);
    getLogs(answers);
  } catch (err) {
    if (err === 'UnAuthenticated') {
      console.log(chalk.red("You need to login!"));
    }
    console.log('Error: ' + err);
  }
});

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
program.command('listEngines').alias('r').description('Get the logs for a recording').action(function () {
  prompt(questions.ListTDOQuestions).then(function (answers) {
    return listEngines(answers);
  });
});

program.command('createLibraryEntity').alias('r').description('Get the logs for a recording').action(function () {
  prompt(questions.createLibraryEntity).then(function (answers) {
    return createLibraryEntity(answers);
  });
});

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