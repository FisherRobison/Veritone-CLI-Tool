// Craft questions to present to users
const loginQuestions = [
  {
    type: 'list',
    name: 'loginChoice',
    message: "How would you like to login?",
    choices: ['API', 'Basic Authentication']
  },{
    type: 'input',
    name: 'apiKey',
    message: 'Input your API Key',
    when: function(answers) {
      console.log("Anything")
      return answers.loginChoice === "API";
    }
  },
  {
    type: 'input',
    name: 'userName',
    message: 'Input your Username',
    when: function(answers) {
      return answers.loginChoice === "Basic Authentication";
    }
  },
  {
    type: 'password',
    name: 'password',
    message: 'Input your Password',
    when: function(answers) {
      return answers.userName;
    }
  }
];
// Craft questions to present to users
 const ListTDOQuestions = [
  {
    type : 'input',
    name : 'limit',
    message : 'Enter limit ...'
  }
];






// Craft questions to present to users
 const CreateTDOQuestions = [
  {
    type : 'input',
    name : 'API_KEY',
    message : 'Enter APIKEY ...'
  },{
    type : 'input',
    name : 'file',
    message : 'Enter file uri ...'
  }
];

// Craft questions to present to users
 const CreateJobQuestions = [
  {
    type : 'input',
    name : 'recordingId',
    message : 'Enter recording Id ...'
  },{
    type : 'checkbox',
    name : 'engineIds',
     choices: [
    'Transcription',
    'OCR',
    'Object',
    'Face'
  ],
    message : 'Enter engineIds...'
  }
];


// Craft questions to present to users
 const CreateTDOWithJobQuestions = [
  {
    type : 'input',
    name : 'file',
    message : 'Enter file uri ...'
  },{
    type : 'checkbox',
    name : 'engineIds',
     choices: [
    'Transcription',
    'OCR',
    'Object',
    'Face'
  ],
    message : 'Enter engineIds...'
  }
];

const GetLogQuestions = [
 {
    type : 'input',
    name : 'recordingId',
    message : 'Enter recordingId  ...'
  }
];

// Craft questions to present to users
 const createLibraryEntity = [
  {
    type : 'input',
    name : 'entityName',
    message : 'Enter Name of Entity ...'
  },{
    type : 'input',
    name : 'libraryId',
    message : 'Enter ID of Library ...'
  }
];



module.exports = {
  loginQuestions,
    ListTDOQuestions,
    CreateTDOQuestions,
    CreateJobQuestions,
    CreateTDOWithJobQuestions,
    GetLogQuestions,
    createLibraryEntity,
    
}