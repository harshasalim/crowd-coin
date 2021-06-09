//Instead of calling compile.js - compiling every time - taking up more time - we compile it once, store it in a file, and use the compiled result from there
//Since our Campaign.sol actually contains 2 contracts - the compiler produces two files - one for Campaign and other for CampaignFactory
//Now any time run compile.js - delete entire build folder, then read 'Campaign.sol' from the contracts folder, and compile both contracts and write the output to the build directory

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
//Earlier used fs - file system, part of the node standard library - to give access to file system on local computer 
//Same functions plus additional functions

//Check if the build directory exists - search for its path
//__dirname - current working directory
const buildPath = path.resolve(__dirname, 'build');
//To delete this folder
fs.removeSync(buildPath);

//Get a path to contracts directory
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
//Read contents of file 
const source = fs.readFileSync(campaignPath, 'utf8');
//Compile contents of file
const output = solc.compile(source, 1).contracts;

//Create a new folder - build - if it does not exist
fs.ensureDirSync(buildPath);

//Loop over the output object, get each contract and save in a separate file inside build directory
//Two contracts - as :Campaign and :CampaignFactory keys
//outputJsonSync writes out a json file to some specified location
//output[contract] refers to the data in the contract to be written to the json file 
//replace function to change the names of the files to remove the ':' from them
for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}