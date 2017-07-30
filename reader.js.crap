
var toRead={tok: [] , i: 0};


var tokenize = function(input) {
    return input.split('"')
                .map(function(x, i) {
                   if (i % 2 === 0) { // not in string
                     return x.replace(/\(/g, ' ( ')
                             .replace(/\)/g, ' ) ');
                   } else { // in string
                     return x.replace(/ /g, "!whitespace!");
                   }
                 })
                .join('"')
                .trim()
                .split(/\s+/)
                .map(function(x) {
                  return x.replace(/!whitespace!/g, " ");
                });
  };

var parenOrAtom = function (input){
                    var i=0;
                    var nnode=[];
                    while(input[i]!==undefined)
                     {if(input[i]=='(')
                        {console.log("new node "+nnode);
                         nnode.length=0; // a way to delete array
                        }
                      else
                        {nnode.push(input[i]);}
                      ++i; 
                     }  
                    console.log("new node "+nnode);
                  };


var readList = function (){
                 var input=toRead.tok; 
                 var i=toRead.i;  
                 var nnode=[];
                 console.log("executing readList "); 
                 while( (input[i]!=')') && (input[i]!==undefined) ) 
                   {if(input[i+1]!=')')
                     {++i;++toRead.i;
                      nnode.push(readForm());}
                    else{++i;++toRead.i;++toRead.i;}
                   }
                 if(input[i]===undefined){return "error! no closing parenthesis";} 
                 console.log("readList: "+JSON.stringify(nnode));
                 //++toRead.i;
                 return nnode;   
               }

var readAtom = function (input,i){
                var number=/^-?[0-9]+$/;
                var symbol=/^\D+$/;
                console.log("executing readAtom "); 
                if(number.test(input[i]))
                 {console.log("readAtom: INTEGER "+input[i]);
                  var r={type: "INTEGER", value: parseInt(input[i]) };
                  return r;
                 }  
                if(symbol.test(input[i]))
                 {console.log("readAtom: SYMBOL "+input[i]);
                  var r={type: "SYMBOL", value: input[i]};
                  return r;
                 } 
                console.log("readAtom: unknown type "+input[i]);
                return {type: "UNKNOWN",value: input[i]}; 
               }

var readForm = function (){
                console.log("executing readForm ");
                var input=toRead.tok; 
                var i=toRead.i; 
                
                if(input[i]!==undefined) 
                  {if(input[i]=='(')
                     {console.log("readForm: parenthesis detected");
                      return readList();
                                        
                     }                   
                   else
                     {console.log("readForm: ready to read atom");
                      return readAtom(input,i);
                     }

                  
                  } 
                //console.log("readForm: "+JSON.stringify(nodes)); 
                
               };

var normalize = function (a){ // gets rid of those ,null in an array 
                  var r=[],i=0;
                  while((a[i]!==undefined)&&(a[i]!==null))
                   {r.push(a[i]);++i;} 
                  return r;
                };

module.exports = ({tokenize: tokenize,parenOrAtom: parenOrAtom,
                   readList: readList, readForm: readForm, readAtom: readAtom,
                   toRead: toRead, normalize: normalize });





