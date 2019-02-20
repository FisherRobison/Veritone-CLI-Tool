'use strict';

require('isomorphic-fetch');
require('dotenv').config();

var assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
var FormData = require('form-data');
var fs = require('fs');
var request = require('request');
var keytar = require('keytar');
var search = require('youtube-search');
var youtubedl = require('youtube-dl');
var rimraf = require('rimraf');
var path = require('path');
var readdir = require('fs-readdir-promise');

// const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');
var BASE_URL = 'https://api.veritone.com/v3/graphql';

var download = function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("download");

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var ytSearch = function ytSearch(answers) {
  var opts = {
    maxResults: answers.limit,
    key: process.env.YT_KEY
  };
  search(answers.query, opts, function (err, results) {
    if (err) return console.log(err);

    console.dir(results);
  });
};

var ytSearchUploader = async function ytSearchUploader(answers) {
  var opts = {
    maxResults: answers.limit,
    key: process.env.YT_KEY,
    type: 'video'
  };
  search(answers.query, opts, async function (err, results) {
    console.log("url");
    console.log(results);

    if (err) return console.log(err);
    var url = results[0].link;
    console.log("url");

    console.log(results);
    //     //var options = ['-F'];
    var requests = results.map(function (link) {
      return new Promise(function (resolve, reject) {
        var video = youtubedl(link.link,
        // Optional arguments passed to youtube-dl.
        ['--format=18']
        // Additional options can be given for calling `child_process.execFile()`.
        );

        // Will be called when the download starts.
        video.on('info', function (info) {
          console.log('Download started');
          console.log('filename: ' + info._filename);
          console.log('size: ' + info.size);
          var output = path.join(__dirname + '/tmp/', info._filename);
          var uploader = video.pipe(fs.createWriteStream(output));
          uploader.on("finish", resolve);
        });

        //video.pipe(fs.createWriteStream(`${link.title}.mp4`));
      });
    });

    await Promise.all(requests);
    var files = await readdir(__dirname + '/tmp/');
    veritoneList = files.filter(function (filename) {
      return !/^\..*/.test(filename);
    });
    console.log(veritoneList);

    await veritoneList.map(function (file) {
      return createTDOYoutube(answers, file);
    });
    //rimraf(__dirname + '/tmp/*', function () { console.log('done'); });


    // youtubedl.getInfo(url, function(err, info) {
    //   if (err) throw err;
    //   let video = youtubedl(url,
    //   // Optional arguments passed to youtube-dl.
    //   ['--format=22'],
    //   // Additional options can be given for calling `child_process.execFile()`.
    //   { cwd: __dirname });
    //   console.log('id:', info.id);
    //   console.log('title:', info.title);
    //   console.log('url:', info.url);
    //   console.log('thumbnail:', info.thumbnail);
    //   console.log('description:', info.description);
    //   console.log('filename:', info._filename);
    //   console.log('format id:', info.format_id);
    //   video.pipe(fs.createWriteStream(`${info._filename}`));
  });

  // video.pipe(fs.createWriteStream('myvideo.mp4'));

  // });
};

var login = async function login(answers) {

  console.log("Hey the login choice is");
  console.log(answers.loginChoice);

  if (answers.loginChoice === 'Basic Authentication') {
    var query = 'mutation userLogin{\n  userLogin(input:{\n    userName:"' + answers.userName + '"\n\t\tpassword:"' + answers.password + '"\n  }){\n    token\n  }\n}';

    var res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    });

    var _ref = await res.json(),
        data = _ref.data,
        errors = _ref.errors;

    if (errors) {
      throw "Username/Password do not match";
    }
    var token = data.userLogin.token;
    // const data = await res.json();
    // console.log(data)

    keytar.setPassword('veritoneCLI', 'Login', token);
  } else {
    keytar.setPassword('veritoneCLI', 'Login', answers.apiKey);
  }
  return "Succesfully Authenticated";
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
var createTDOYoutube = async function createTDOYoutube(answers, file) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var CreateTDO = 'mutation {\n  createTDOWithAsset(\n    input: {\n      startDateTime: 1507128535\n      updateStopDateTimeFromAsset:true\n      contentType: "video/mp4"\n      assetType: "media"\n\n    } ) {\n    id\n    status\n    assets{\n      records {\n        id\n        type\n        signedUri\n        contentType\n      }\n    }    \n  }\n}';

  var formData = new FormData();

  formData.append("file", fs.createReadStream('' + (__dirname + '/tmp/') + file));
  formData.append("filename", file);
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
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++Callback");
    console.log(cb);

    createJob(answers, cb.data.createTDOWithAsset.id);
    fs.unlinkSync('' + (__dirname + '/tmp/') + file);
  }).catch(function (err) {
    console.log('error', err);
  });
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

var whiteListEngine = async function whiteListEngine(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var query = 'mutation whitelist{\n    addToEngineWhitelist(toAdd:{\n      organizationId:"' + questions.organizationID + '"\n      engineIds:[' + questions.engineID + ']\n    }){\n      engines{\n        name\n        id\n      }\n    }\n  }\n';

  var res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  });

  var cb = await res.json();
  console.log(cb);
  // cb.data.temporalDataObjects.records.map(tdo => console.log(tdo.id));
};

var listTDO = async function listTDO(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var query = '{\n  temporalDataObjects(limit: ' + questions.limit + ') {\n    count\n    records {\n      id\n    } \n  }\n  }\n';

  var res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  });

  var cb = await res.json();
  //console.log(cb);
  cb.data.temporalDataObjects.records.map(function (tdo) {
    return console.log(tdo.id);
  });
};

var createJob = async function createJob(questions) {
  var recordingId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  console.log(recordingId, questions);
  var engineList = [];
  engineList.push('{engineId: "insert-into-index"}');

  questions.engineIds.map(function (engine) {
    switch (engine) {
      case 'Transcription':
        console.log("Hey Transcription");
        engineList.push('{engineId: "54525249-da68-4dbf-b6fe-aea9a1aefd4d"},');
        break;
      case 'OCR':
        engineList.push('{engineId: "0667bd96-7117-4c69-b428-5a8231e1f450"},');
        break;
      case 'Object':
        engineList.push('{engineId: "imagedetection-objectrecognition-clarifai"},');
        break;
      default:
    }
  });

  var query = 'mutation{\n  createJob(input:{\n    targetId: "' + (recordingId ? recordingId : questions.recordingId) + '",\n     tasks:[' + engineList + '  \n    ]\n    isReprocessJob:true\n\n  }){\n    id\n  }\n}\n';

  var res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: query })
  });

  var cb = await res.json();
  console.log(cb);
  // .then(res => res.json())
  // .then(cb => console.log(cb))
  // .catch(function (err) {
  //   console.log('error', err);
  // });
};

var getLogs = async function getLogs(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  try {
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

var createTDOWithJob = async function createTDOWithJob(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  var CreateTDO = 'mutation {\n  createTDOWithAsset(\n    input: {\n      startDateTime: 1507128535\n      stopDateTime: 1507128542\n      contentType: "video/mp4"\n      assetType: "media"\n    } ) {\n    id\n    status\n    assets{\n      records {\n        id\n        type\n        signedUri\n        contentType\n      }\n    }    \n  }\n}';

  var formData = new FormData();

  formData.append("file", fs.createReadStream('' + questions.file));
  formData.append("filename", 'testing');
  formData.append("query", CreateTDO);
  console.log("Questions");
  console.log(questions);
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

  var query = 'query{\n  engines(limit:' + questions.limit + '){\n    records{\n      id\n      name\n      runtimeType\n    }\n  }\n}\n';

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

var createLibraryEntity = async function createLibraryEntity(questions) {
  var API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

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
module.exports = { createTDOWithAsset: createTDOWithAsset, listTDO: listTDO, createJob: createJob, createTDOWithJob: createTDOWithJob, getLogs: getLogs, listEngines: listEngines, createLibraryEntity: createLibraryEntity, login: login, logout: logout, checkForAuth: checkForAuth, ytSearch: ytSearch, ytSearchUploader: ytSearchUploader, whiteListEngine: whiteListEngine };