var environment=[];
var curEnv; //index of current Environment

var replEnv = {};

replEnv['+'] = function(a,b){return a+b;};
replEnv['-'] = function(a,b){return a-b;};
replEnv['*'] = function(a,b){return a*b;};
replEnv['/'] = function(a,b){return a/b;};


replEnv["def!"]=function(a,b){console.log("def ! executed with "+a+" "+b);
                              return envSet(a,b,curEnv);};

replEnv['t']=function(){return true;}
replEnv['f']=function(){return false;}
replEnv['nil']=function(){return false;}


environment.push(replEnv);

// after days of disappointment I finally decided to somehow copy the reader functions
var evaluate = function (t,env){
                 
                                                  
                 function evalForm(t,env,i){
                  
                  if(t[i]!==undefined)
                   {if(Array.isArray(t[i]))
                     {if( (t[i][0].type=="INTEGER") && (t[i][1]===undefined) )
                       {console.log("singleton detected and replaced");
                        return t[i][0];}
                      else 
                       {console.log("evalList started ");
                        return evalList(t[i],env);
                       } 
                     } 
                    else
                     {return evalAtom(t,env,i);}
                   }     
                 }     

                 function evalAtom(t,env,i){
                   var el=t[i];
                   if(isAtom(el))
                    {if(el.type=="INTEGER")
                      {return el;}
                     if(el.type=="SYMBOL")   
                      {return el;}
                    }    
                   else
                    {console.log("error! unknown character !");}     
                 }
                 
                 function evalList(t,env){
                   var nterm=[];
                   var atom;
                   var i=0,el;
                   
                  while(t[i]!==undefined)  
                   {el=t[i];
                    if((el.type=="SYMBOL")&&(envFind(el.value,env)!="error!"))
                     {var pval=environment[env][el.value];
                      console.log("function found "+el.value)
                      if(isExecutable(t))
                       {console.log("executable");
                        printList(t);
                        if(t.length==3)  // to be changed ; for 2 arguments only
                         {console.log(pval(t[i+1].value,t[i+2].value));
                          var nxp={type: "INTEGER", value: pval(t[1].value,t[2].value)};
                          nterm.push(nxp);
                          i+=3;
                         }
                        else
                         {console.log("currently 2 arguments only");}        
                       }
                      else 
                       {atom=evalForm(t,env,i);
                        ++i;
                        nterm.push(atom);
                       } 
                     }  
                    else 
                     {atom=evalForm(t,env,i);
                      ++i;
                      nterm.push(atom);
                     }
                   }
                  console.log("nterm created "+JSON.stringify(nterm));
                  return nterm;
                 }

                var nevv=t;
                
                for(var i=0;i<t.length;++i) 
                 {var old=evalList(nevv,env);
                  var nevv=evalList(old,env);
                 }  
                                               
                //console.log("no further simplifications possible");
                return old;                 
               };


function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]';
}

function getNextList(x){
 var i;
 for(i=0;i<x.length;++i) 
  {if(Array.isArray(x[i]))
    {return i;} 
  }
 return undefined; // returns undefined when there is no other list
}


function isExecutable(x){ // checks if there are no more "nested" parameters 
  var i=0;
 
  console.log("executing isExecutable x.length "+x.length); 
 
  for(i=0;i<x.length;++i)
   {if(Array.isArray(x[i])){return false;}
   }
  return true;
}

function printList(x){
 var i=0;
 var p=[];

 for(i=0;i<x.length;++i){p.push(x[i]);}
 console.log(JSON.stringify(p));
}


function envSet(s,m,e){environment[e][s]=m;
                              return m;};
function envFind(s,e){for(var x in environment[e])
                                {if(x==s)
                                  {return e;}
                                }
                               console.log(s+" not found! error!"); 
                               return "error!";
                             };

function envGet(s,e){var en;
                             en=envFind(s,e);
                             if(en!="error!")
                              {var nev=environment[en];
                               for(var x in nev)
                                {if(x==s)
                                  {return environment[en][x];}  
                                }    
                              }
                             else
                              {return en;}
                            };

function isAtom(x){
         if(x.type=="INTEGER"){return true;} 
         if(x.type=="SYMBOL"){return true;}   
         return false;
  }

module.exports = ({evaluate: evaluate});