require('isomorphic-fetch');
require('dotenv').config();

const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
const FormData = require('form-data');
const fs = require('fs');
const request = require('request');
const keytar = require('keytar')
<<<<<<< HEAD
const search = require('youtube-search');
const youtubedl = require('youtube-dl');
const rimraf = require('rimraf');
var path = require('path');
var readdir = require('fs-readdir-promise');

=======
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe

// const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');
const BASE_URL = 'https://api.veritone.com/v3/graphql';

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("download");

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


<<<<<<< HEAD
 

 const ytSearch = (answers) =>{
  var opts = {
    maxResults: answers.limit,
    key: process.env.YT_KEY
  };
  search(answers.query, opts, function(err, results) {
    if(err) return console.log(err);
   
    console.dir(results);
  });
 }



 const ytSearchUploader = async (answers) =>{
  var opts = {
    maxResults: answers.limit,
    key: process.env.YT_KEY,
    type: 'video'
  };
  search(answers.query, opts, async (err, results) => {
    console.log("url");
    console.log(results);

    if(err) return console.log(err);
    let url = results[0].link
    console.log("url");

    console.log(results);
//     //var options = ['-F'];
let requests = results.map(link => new Promise((resolve, reject) =>{
  let video = youtubedl(link.link,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
);
   
  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    let output = path.join(__dirname + '/tmp/', info._filename);
    let uploader = video.pipe(fs.createWriteStream(output));
    uploader.on("finish", resolve);

  });
   
  //video.pipe(fs.createWriteStream(`${link.title}.mp4`));
}));

await Promise.all(requests);
const files = await readdir(__dirname + '/tmp/');
veritoneList = files.filter(filename => ! /^\..*/.test(filename));
console.log(veritoneList);

await veritoneList.map(file => createTDOYoutube(answers, file));
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
 }

=======
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe

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
<<<<<<< HEAD
const createTDOYoutube = async (answers, file) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const CreateTDO = `mutation {
  createTDOWithAsset(
    input: {
      startDateTime: 1507128535
      updateStopDateTimeFromAsset:true
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

  formData.append("file", fs.createReadStream(`${__dirname + '/tmp/'}${file}`));
  formData.append("filename", file)
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
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++Callback");
      console.log(cb);

      createJob(answers, cb.data.createTDOWithAsset.id);
      fs.unlinkSync(`${__dirname + '/tmp/'}${file}`);

    })
    .catch(function (err) {
      console.log('error', err);

    });

}
=======

>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe


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

<<<<<<< HEAD














const whiteListEngine = async (questions) => {
  const API_KEY = await keytar.getPassword('veritoneCLI', 'Login');

  const query = `mutation whitelist{
    addToEngineWhitelist(toAdd:{
      organizationId:"${questions.organizationID}"
      engineIds:[${questions.engineID}]
    }){
      engines{
        name
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
    console.log(cb);
    // cb.data.temporalDataObjects.records.map(tdo => console.log(tdo.id));

}





=======
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe
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
<<<<<<< HEAD
  let engineList = [];
  engineList.push(`{engineId: "insert-into-index"}`);

  questions.engineIds.map((engine) => {
    switch (engine) {
      case 'Transcription':
      console.log("Hey Transcription");
       engineList.push(`{engineId: "54525249-da68-4dbf-b6fe-aea9a1aefd4d"},`);
       break;
      case 'OCR':
        engineList.push(`{engineId: "0667bd96-7117-4c69-b428-5a8231e1f450"},`);
        break;
      case 'Object':
        engineList.push(`{engineId: "imagedetection-objectrecognition-clarifai"},`);
        break;
      default:
    }
=======
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
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe
  })

  const query = `mutation{
  createJob(input:{
<<<<<<< HEAD
    targetId: "${ recordingId ? recordingId : questions.recordingId}",
     tasks:[${engineList}  
    ]
    isReprocessJob:true

=======
    targetId: "${ recordingId ? recordingId : questions.recordingId}"
     tasks:[${engineList}  
    ]
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe
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
<<<<<<< HEAD
      runtimeType
=======
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe
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
<<<<<<< HEAD
module.exports = { createTDOWithAsset, listTDO, createJob, createTDOWithJob, getLogs, listEngines, createLibraryEntity, login, logout, checkForAuth, ytSearch, ytSearchUploader, whiteListEngine };
=======
module.exports = { createTDOWithAsset, listTDO, createJob, createTDOWithJob, getLogs, listEngines, createLibraryEntity, login, logout, checkForAuth };
>>>>>>> 16bf2e161ad35a23dd891c4180162af486568bbe
