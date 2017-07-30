
var repl = require('repl');
var eval = require("./eval");
var reader = require("./reader")



//probably this will contain the whole repl loop 
repl.start({
     prompt: "code>" ,
     eval: function(cmd, context, filename, callback){
                     console.log("to be processed "+cmd);
                     var p=reader.readString(cmd);
                     //reader.printString();
                     console.log("from REPL : "+JSON.stringify(p)); 
                     callback(null); // 2b changed
           } 
});