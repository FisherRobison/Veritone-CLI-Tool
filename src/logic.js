require('isomorphic-fetch');
require('dotenv').config();

const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
const FormData = require('form-data');
const fs = require('fs');
const request = require('request');
const keytar = require('keytar')

// const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');
const BASE_URL = 'https://api.veritone.com/v3/graphql';

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("download");

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



const login = async (answers) => {

  console.log("Hey the login choice is");
  console.log(answers.loginChoice);

  if(answers.loginChoice === 'Basic Authentication'){
  const query = `mutation userLogin{
  userLogin(input:{
    userName:"${answers.userName}"
		password:"${answers.password}"
  }){
    token
  }
}`;


    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })
    const { data, errors } = await res.json();
    if (errors) {
      throw "Username/Password do not match"
    }
    let token = data.userLogin.token;
    // const data = await res.json();
    // console.log(data)

    keytar.setPassword('veritoneCLI', 'Login', token);
  }
    else{
      keytar.setPassword('veritoneCLI', 'Login', answers.apiKey);

    }
    return "Succesfully Authenticated"
  
  
};

// const checkForAuth = async () => {
//   const password = await keytar.getPassword('veritoneCLI','Login') ? true : false;
//   if(password){
//     return
//   }else{
//     throw 400;

//   }
// }
const checkForAuth = async () => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const password = await API_KEY ? true : false;
  if (!password) {
    throw 'UnAuthenticated';
  }
  return password;
}

const logout = async () => {



  try {

    const res = await keytar.deletePassword('veritoneCLI', 'Login');
    return res;



  } catch (err) {
    console.log(err);
  }
};



const createTDOWithAsset = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const CreateTDO = `mutation {
  createTDOWithAsset(
    input: {
      startDateTime: 1507128535
      stopDateTime: 1507128542
      contentType: "video/mp4"
      assetType: "media"
    } ) {
    id
    status
    assets{
      records {
        id
        type
        signedUri
        contentType
      }
    }    
  }
}`


  const formData = new FormData();

  formData.append("file", fs.createReadStream(`./${questions.file}`));
  formData.append("filename", 'testing')
  formData.append("query", CreateTDO)


  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`
    },
    body: formData
  })
    .then((res) => res.json())
    .then((cb) => {
      console.log(cb);
    })
    .catch(function (err) {
      console.log('error', err);

    });

}

const listTDO = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const query = `{
  temporalDataObjects(limit: ${questions.limit}) {
    count
    records {
      id
    } 
  }
  }
`;

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  })

    const cb = await res.json();
    //console.log(cb);
    cb.data.temporalDataObjects.records.map(tdo => console.log(tdo.id));

}


const createJob = async (questions, recordingId = null) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  console.log(recordingId, questions)
  let engineList = []
  questions.engineIds.map((engine) => {
    switch (engine) {
      case 'Transcription':
        engineList.push(`{engineId: "transcribe-speechmatics-container-en-us"},`);
      case 'OCR':
        engineList.push(`{engineId: "imagedetection-ocr-google"},`);
      case 'Object':
        engineList.push(`{engineId: "imagedetection-objectrecognition-clarifai"},`);

    }
    return engineList
  })

  const query = `mutation{
  createJob(input:{
    targetId: "${ recordingId ? recordingId : questions.recordingId}"
     tasks:[${engineList}  
    ]
  }){
    id
  }
}
`;

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const cb = await res.json();
  console.log(cb);
    // .then(res => res.json())
    // .then(cb => console.log(cb))
    // .catch(function (err) {
    //   console.log('error', err);
    // });
}

const getLogs = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  try {
    const query = `query{
  temporalDataObject(id:"${questions.recordingId}"){
    tasks{
      records{
        id
        engine{
          id
          name
        }
        status
        log{
          uri
        }
      }
    }
  }
}`;

    fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(cb =>
        // console.log(cb))
        console.dir(cb.data.temporalDataObject.tasks, { depth: null }))// `depth: null` ensures unlimited recursion
      .catch(function (err) {
        console.log('error', err);
      });

  } catch (err) {
    console.log(err);
  }
}

const createTDOWithJob = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const CreateTDO = `mutation {
  createTDOWithAsset(
    input: {
      startDateTime: 1507128535
      stopDateTime: 1507128542
      contentType: "video/mp4"
      assetType: "media"
    } ) {
    id
    status
    assets{
      records {
        id
        type
        signedUri
        contentType
      }
    }    
  }
}`


  const formData = new FormData();

  formData.append("file", fs.createReadStream(`${questions.file}`));
  formData.append("filename", 'testing')
  formData.append("query", CreateTDO)
console.log("Questions");
console.log(questions);
  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`
    },
    body: formData
  })
    .then((res) => res.json())
    .then((cb) => {
      createJob(questions, cb.data.createTDOWithAsset.id);
    })
    .catch(function (err) {
      console.log('error', err);

    });
}

const listEngines =  async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const query = `query{
  engines(limit:${questions.limit}){
    records{
      id
      name
    }
  }
}
`;

const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const { data: { engines: {records }}} = await res.json();
  records.map(engine => console.table(engine));
//     .then(res => res.json())
//     .then(cb => cb.data.engines.records.map(tdo => console.log(tdo)))
//     .catch(function (err) {
//       console.log('error', err);
//     });
// }
}


const createLibraryEntity = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const query = `mutation{
  createEntity(input:{
    name:"${questions.entityName}",
    libraryId:"d6e89f3a-4674-46f4-bfe9-9c8534a55d8d"
  })
  {
    jsondata
  }
}`;

  console.log(query);
  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(cb => console.log(cb))
    .catch(function (err) {
      console.log('error', err);
    });



}





// Export all methods
module.exports = { createTDOWithAsset, listTDO, createJob, createTDOWithJob, getLogs, listEngines, createLibraryEntity, login, logout, checkForAuth };