
var repl = require('repl');
var reader = require("./reader")


//probably this will contain the whole repl loop 
repl.start({
     prompt: "code>" ,
     eval: function(cmd, context, filename, callback){
                     console.log("to be processed "+cmd);
                     var token=reader.tokenize(cmd);
                     console.log("tokenized "+token);
                     //reader.parenOrAtom(token);
                     reader.toRead.tok=token; // initialization of toRead in module reader
                     reader.toRead.i=0; // index must be set too
                     var p=reader.readForm();
                     console.log(JSON.stringify(p));
                     callback(null); // 2b changed
           } 
});