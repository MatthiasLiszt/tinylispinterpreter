
var I; // global Index ... required for the functions readForm,readAtom,readList

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

// read_str in the MAL guide 
var readString = function (input){       
               var p=tokenize(input);
               I=0; //initialize global Index
               return readForm(p); 
              }

// pr_str in the MAL guide 
var printString = function (data){
                 console.log(JSON.stringify(data));
               }

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


var readList = function (input){
                 var nnode=[];  
                 var r;                 
 
                 console.log("executing readList "); 
                  
                 ++I;
  
                 if(input[I-1]!='('){console.log("error! missing token (");}
                      
                                   
                 while( (input[I]!=')') && (input[I]!==undefined) ) 
                   {//console.log("while loop entered");
                    r=readForm(input);
                    ++I; //increases global index (index of array input)    
                    if( (r.value!=')') && (r.value!='(') ){nnode.push(r);}
                                                           
                   }
                 if(input[I]===undefined){console.log("error! no closing parenthesis");} 
                 console.log("readList: "+JSON.stringify(nnode));
                 return nnode;   
               }

var readAtom = function (input){
                var number=/^-?[0-9]+$/;
                var symbol=/^\D+$/;
                var nil="nil";

                //console.log("executing readAtom "); 
                              
                if(input[I]==nil)
                 {//console.log("readAtom: NIL "+input[I]);
                  var r={type: "BOOLEAN", value: "false" };
                  return r;
                 }  
                if(input[I]=="t")
                 {//console.log("readAtom: TRUE ");
                  var r={type: "BOOLEAN", value: true };
                  return r;
                 }   
                if(input[I]=="f")
                 {//console.log("readAtom: FALSE ");
                  var r={type: "BOOLEAN", value: false };
                  return r;
                 }   
                if(number.test(input[I]))
                 {//console.log("readAtom: INTEGER "+input[I]);
                  var r={type: "INTEGER", value: parseInt(input[I]) };
                  return r;
                 }  
                if(symbol.test(input[I]))
                 {//console.log("readAtom: SYMBOL "+input[I]);
                  var r={type: "SYMBOL", value: input[I]};
                  return r;
                 } 
                //console.log("readAtom: unknown type "+input[I]);
                return {type: "UNKNOWN",value: input[I]}; 
               }

var readForm = function (input){
                //console.log("executing readForm ");
                                
                if(input[I]!==undefined) 
                  {if(input[I]=='(')
                     {//console.log("readForm: parenthesis detected");
                      return readList(input);
                                        
                     }                   
                   else
                     {//console.log("readForm: ready to read atom");
                      return readAtom(input);
                     }

                  
                  }             
                };

var normalize = function (a){ // gets rid of those ,null in an array 
                  var r=[],i=0;
                  while((a[i]!==undefined)&&(a[i]!==null))
                   {r.push(a[i]);++i;} 
                  return r;
                };

module.exports = ({tokenize: tokenize,parenOrAtom: parenOrAtom,
                   readList: readList, readForm: readForm, readAtom: readAtom,
                   normalize: normalize, readString: readString });





