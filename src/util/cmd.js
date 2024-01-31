/*
Code from StackOverflow
https://stackoverflow.com/questions/12941083/execute-and-get-the-output-of-a-shell-command-in-node-js
Answer: Renato Gama
*/

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

exports.execute = execute