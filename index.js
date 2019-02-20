#!/usr/bin/env node
const program = require('commander');
const chalk = require("chalk");
const inquirer = require('inquirer'); // require inquirerjs library

const questions = require('./questions')
// Require logic.js file and extract controller functions using JS destructuring assignment
const { listTDO, listEngines, createTDOWithAsset, createJob, createTDOWithJob, getLogs, createLibraryEntity, login, logout, checkForAuth, ytSearch, ytSearchUploader, whiteListEngine } = require('./logic');
const prompt = inquirer.createPromptModule();



program
  .version('1.0.3')
  .description('Veritone cli tool');


program
  .command('login')
  .alias('l')
  .description('Login to veritone')
  .action(async () => {
    try {
      const answers = await prompt(questions.loginQuestions);
      const res = await login(answers);
      console.log(chalk.green.bold(res));
      //  if(res === 'unpwError'){
      //   console.log(chalk.red.bold(res));
      //  }else{
      //   console.log(chalk.green.bold(res));
      //  }
    } catch (err) {
      //chalk.red.bold(res)
      console.log(chalk.red.bold(err))

    }
  });

  program
    .command('youtube')
    .alias('yt')
    .description('Search for Youtube Videos')
    .action(async (args) => {
      try {
        const answers = await prompt(questions.ytQuestions);

        await ytSearch(answers);
        //console.log(args);
        ///  if(res === 'unpwError'){
        //   console.log(chalk.red.bold(res));
        //  }else{
        //   console.log(chalk.green.bold(res));
        //  }
      } catch (err) {
        //chalk.red.bold(res)
        console.log(chalk.red.bold(err))

      }
    });

    program
    .command('youtubeUploader')
    .alias('ytU')
    .description('Search for Youtube Videos and Upload to CMS')
    .action(async (args) => {
      try {
        const answers = await prompt(questions.ytQuestions);

        await ytSearchUploader(answers);
        //console.log(args);
        ///  if(res === 'unpwError'){
        //   console.log(chalk.red.bold(res));
        //  }else{
        //   console.log(chalk.green.bold(res));
        //  }
      } catch (err) {
        //chalk.red.bold(res)
        console.log(chalk.red.bold(err))

      }
    });

program
  .command('logout')
  .alias('lO')
  .description('Logout of Veritone')
  .action(async () => {
    try {
      await logout();
      console.log(chalk.blue.bold("Byeeeee"))
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  });

program
  .command('listAllTDO')
  .alias('lA')
  .description('List all TDOS Ids')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.ListTDOQuestions);
      listTDO(answers);

    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  });

program
  .command('createTDO')
  .alias('cT')
  .description('Create a TDO from a local file')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.CreateTDOQuestions);
      createTDOWithAsset(answers);

    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  });

program
  .command('createTDOWithJob')
  .alias('cTJ')
  .description('Create a TDO with a job from a local file')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.CreateTDOWithJobQuestions);
      createTDOWithJob(answers);

    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  });

program
  .command('createJob')
  .alias('cJ')
  .description('Create a Job')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.CreateJobQuestions);
      createJob(answers);

    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  });


program
  .command('getLogs')
  .alias('gL')
  .description('Get the logs for a recording')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.GetLogQuestions);
      getLogs(answers);
    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }

  })

program
  .command('listEngines')
  .alias('lE')
  .description('Get a list of engines')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.ListTDOQuestions);
      listEngines(answers);
    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  })

program
  .command('createLibraryEntity')
  .alias('cLE')
  .description('Create a library entity')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.createLibraryEntity);
      createLibraryEntity(answers);
    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login!"));
      }
      console.log(`Error: ${err}`)
    }
  })

  program
  .command('whiteListEngine')
  .alias('white')
  .description('Create a white list')
  .action(async () => {
    try {
      await checkForAuth();
      const answers = await prompt(questions.nListQuestions);
      whiteListEngine(answers);
    } catch (err) {
      if (err === 'UnAuthenticated') {
        console.log(chalk.red("You need to login !"));
      }
      console.log(`Error: ${err}`)
    }
  })




program.parse(process.argv);