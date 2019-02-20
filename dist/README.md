# Veritone-CLI-Tool


> A Node.js CLI tool that exposes common veritone API workflows 

## Installation
```bash
$ npm i veritone-cli -g
```

## Usage
```
$ veritone --help

  Usage: veritone [options] [command]

  Veritone cli tool

  Options:

    -V, --version            output the version number
    -h, --help               output usage information

  Commands:

    login|l                  Login to veritone
    logout|lO                Logout of Veritone
    listAllTDO|lA            List all TDOS Ids
    createTDO|cT             Create a TDO from a local file
    createTDOWithJob|cTJ     Create a TDO with a job from a local file
    createJob|cJ             Create a Job
    getLogs|gL               Get the logs for a recording
    listEngines|lE           Get a list of engines
    createLibraryEntity|cLE  Create a library enti

```

## License
MIT