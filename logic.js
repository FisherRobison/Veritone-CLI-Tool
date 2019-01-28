require('isomorphic-fetch');

const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
const FormData = require('form-data');
const fs = require('fs');
const request = require('request');
const API_KEY = process.env.API_KEY;

const BASE_URL = 'https://api.veritone.com/v3/graphql';

const download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
     console.log("download");

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};




const createTDOWithAsset = (questions) => {

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
			Authorization: `Bearer ${API_KEY}`		},
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

const listTDO = (questions) =>{
    const query = `{
  temporalDataObjects(limit: ${questions.limit}) {
    count
    records {
      id
    } 
  }
  }
`;

	fetch(BASE_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({ query })
	})
		.then(res => res.json())
		.then(cb => cb.data.temporalDataObjects.records.map(tdo =>  console.log(tdo.id)
    
    ))
		.catch(function(err) {
			console.log('error', err);
		});
}


const createJob = (questions, recordingId=null) =>{
    console.log(recordingId, questions )
    let engineList = []
    questions.engineIds.map((engine)=>{
        switch(engine){
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
    targetId: "${ recordingId  ? recordingId:  questions.recordingId}"
     tasks:[${engineList}  
    ]
  }){
    id
  }
}
`;

	fetch(BASE_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({ query })
	})
		.then(res => res.json())
		.then(cb =>  console.log(cb))
		.catch(function(err) {
			console.log('error', err);
		});
}

const getLogs = (questions) => {
    const query =  `query{
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
      
        console.dir(cb.data.temporalDataObject.tasks, { depth: null }))// `depth: null` ensures unlimited recursion
		.catch(function(err) {
			console.log('error', err);
		});


}

const createTDOWithJob = (questions) => {
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
			Authorization: `Bearer ${API_KEY}`		},
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

const  listEngines = (questions) => {
    const query = `query{
  engines(limit:${questions.limit}){
    records{
      id
      name
    }
  }
}
`;

	fetch(BASE_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({ query })
	})
		.then(res => res.json())
		.then(cb => cb.data.engines.records.map(tdo => console.log(tdo)))
		.catch(function(err) {
			console.log('error', err);
		});
}


const createLibraryEntity = (questions) => {

    const query =  `mutation{
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
		.then(cb =>  console.log(cb))
		.catch(function(err) {
			console.log('error', err);
		});



}





// Export all methods
module.exports = {  createTDOWithAsset, listTDO, createJob, createTDOWithJob, getLogs, listEngines, createLibraryEntity };