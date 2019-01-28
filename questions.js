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
    ListTDOQuestions,
    CreateTDOQuestions,
    CreateJobQuestions,
    CreateTDOWithJobQuestions,
    GetLogQuestions,
    createLibraryEntity,
    
}