'use strict';

require('isomorphic-fetch');
require('dotenv').config();

var assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
var FormData = require('form-data');
var fs = require('fs');
var request = require('request');
var keytar = require('keytar');

// const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');
var BASE_URL = 'https://api.veritone.com/v3/graphql';

var download = function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("download");

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var login = async function login(answers) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var query = 'mutation userLogin{\n  userLogin(input:{\n    userName:"' + answers.userName + '"\n\t\tpassword:"' + answers.password + '"\n  }){\n    token\n  }\n}';

  try {

    var res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    });
    //data: { userLogin: { token } },

    var _ref = await res.json(),
        data = _ref.data,
        errors = _ref.errors;

    if (errors) {
      throw "UserName/Password do not match";
    }
    var token = data.userLogin.token;
    // const data = await res.json();
    // console.log(data)

    keytar.setPassword('veritoneCLI', 'Login', token);
    return "Succesfully Authenticated";
  } catch (err) {
    console.log(err);
  }
};

// const checkForAuth = async () => {
//   const password = await keytar.getPassword('veritoneCLI','Login') ? true : false;
//   if(password){
//     return
//   }else{
//     throw 400;

//   }
// }
var checkForAuth = async function checkForAuth() {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var password = (await API_KEY) ? true : false;
  if (!password) {
    throw 'UnAuthenticated';
  }
  return password;
};

var logout = async function logout() {

  try {

    var res = await keytar.deletePassword('veritoneCLI', 'Login');
    return res;
  } catch (err) {
    console.log(err);
  }
};

var createTDOWithAsset = async function createTDOWithAsset(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var CreateTDO = 'mutation {\n  createTDOWithAsset(\n    input: {\n      startDateTime: 1507128535\n      stopDateTime: 1507128542\n      contentType: "video/mp4"\n      assetType: "media"\n    } ) {\n    id\n    status\n    assets{\n      records {\n        id\n        type\n        signedUri\n        contentType\n      }\n    }    \n  }\n}';

  var formData = new FormData();

  formData.append("file", fs.createReadStream('./' + questions.file));
  formData.append("filename", 'testing');
  formData.append("query", CreateTDO);

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY
    },
    body: formData
  }).then(function (res) {
    return res.json();
  }).then(function (cb) {
    console.log(cb);
  }).catch(function (err) {
    console.log('error', err);
  });
};

var listTDO = async function listTDO(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var query = '{\n  temporalDataObjects(limit: ' + questions.limit + ') {\n    count\n    records {\n      id\n    } \n  }\n  }\n';

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  }).then(function (res) {
    return res.json();
  }).then(function (cb) {
    return cb.data.temporalDataObjects.records.map(function (tdo) {
      return console.log(tdo.id);
    });
  }).catch(function (err) {
    console.log('error', err);
  });
};

var createJob = function createJob(questions) {
  var recordingId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  console.log(recordingId, questions);
  var engineList = [];
  questions.engineIds.map(function (engine) {
    switch (engine) {
      case 'Transcription':
        engineList.push('{engineId: "transcribe-speechmatics-container-en-us"},');
      case 'OCR':
        engineList.push('{engineId: "imagedetection-ocr-google"},');
      case 'Object':
        engineList.push('{engineId: "imagedetection-objectrecognition-clarifai"},');

    }
    return engineList;
  });

  var query = 'mutation{\n  createJob(input:{\n    targetId: "' + (recordingId ? recordingId : questions.recordingId) + '"\n     tasks:[' + engineList + '  \n    ]\n  }){\n    id\n  }\n}\n';

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  }).then(function (res) {
    return res.json();
  }).then(function (cb) {
    return console.log(cb);
  }).catch(function (err) {
    console.log('error', err);
  });
};

var getLogs = async function getLogs(questions) {
  try {

    console.log(questions);
    var query = 'query{\n  temporalDataObject(id:"' + questions.recordingId + '"){\n    tasks{\n      records{\n        id\n        engine{\n          id\n          name\n        }\n        status\n        log{\n          uri\n        }\n      }\n    }\n  }\n}';

    fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ query: query })
    }).then(function (res) {
      return res.json();
    }).then(function (cb) {
      return (
        // console.log(cb))
        console.dir(cb.data.temporalDataObject.tasks, { depth: null })
      );
    }) // `depth: null` ensures unlimited recursion
    .catch(function (err) {
      console.log('error', err);
    });
  } catch (err) {
    console.log(err);
  }
};

var createTDOWithJob = function createTDOWithJob(questions) {
  var CreateTDO = 'mutation {\n  createTDOWithAsset(\n    input: {\n      startDateTime: 1507128535\n      stopDateTime: 1507128542\n      contentType: "video/mp4"\n      assetType: "media"\n    } ) {\n    id\n    status\n    assets{\n      records {\n        id\n        type\n        signedUri\n        contentType\n      }\n    }    \n  }\n}';

  var formData = new FormData();

  formData.append("file", fs.createReadStream('./' + questions.file));
  formData.append("filename", 'testing');
  formData.append("query", CreateTDO);

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY
    },
    body: formData
  }).then(function (res) {
    return res.json();
  }).then(function (cb) {
    createJob(questions, cb.data.createTDOWithAsset.id);
  }).catch(function (err) {
    console.log('error', err);
  });
};

var listEngines = async function listEngines(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var query = 'query{\n  engines(limit:' + questions.limit + '){\n    records{\n      id\n      name\n    }\n  }\n}\n';

  var res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  });

  var _ref2 = await res.json(),
      records = _ref2.data.engines.records;

  records.map(function (engine) {
    return console.table(engine);
  });
  //     .then(res => res.json())
  //     .then(cb => cb.data.engines.records.map(tdo => console.log(tdo)))
  //     .catch(function (err) {
  //       console.log('error', err);
  //     });
  // }
};

var createLibraryEntity = function createLibraryEntity(questions) {

  var query = 'mutation{\n  createEntity(input:{\n    name:"' + questions.entityName + '",\n    libraryId:"d6e89f3a-4674-46f4-bfe9-9c8534a55d8d"\n  })\n  {\n    jsondata\n  }\n}';

  console.log(query);
  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  }).then(function (res) {
    return res.json();
  }).then(function (cb) {
    return console.log(cb);
  }).catch(function (err) {
    console.log('error', err);
  });
};

// Export all methods
module.exports = { createTDOWithAsset: createTDOWithAsset, listTDO: listTDO, createJob: createJob, createTDOWithJob: createTDOWithJob, getLogs: getLogs, listEngines: listEngines, createLibraryEntity: createLibraryEntity, login: login, logout: logout, checkForAuth: checkForAuth };