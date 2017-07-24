
var environment=[];
var curEnv; //index of current Environment

var rParam=2; // required parameters of a Function (not yet fully implemented)

var replEnv = {};

replEnv['+'] = function(a,b){return a+b;};
replEnv['-'] = function(a,b){return a-b;};
replEnv['*'] = function(a,b){return a*b;};
replEnv['/'] = function(a,b){return a/b;};

replEnv["def!"]=function(a,b){console.log("def ! executed with "+a+" "+b);
                              return envSet(a,b,curEnv);};

environment.push(replEnv);

function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]';
}

var evaluate = function (tt,env){
                var i=0;
                var fset=false;
                var param=[];
                var t,f,pI=0,lpush=0;
                var ntok=[];
                
                curEnv=env;// added in step 3
         
                while(tt[i]!==undefined){
                 t=tt; 
                 if(Array.isArray(t[i])){for(var k=lpush;k<i;++k)
                                              {ntok.push(t[k]);
                                              }  
                                           lpush=i;
                                           t=tt[i];}
                 if(t[i].type=="SYMBOL")  
                  {if(fset) 
                    {param[pI]=i;
                     ++pI;
                    }
                   if(!fset) 
                    {if(envFind(t[i].value,env)!="error!")
                      {console.log(t[i].value+" exists in env. !");
                       fset=true;
                       f=i;//index of SYMBOL
                       pI=0; 
                      }
                     else
                      {console.log("unknown SYMBOL detected !!!");
                       return "error!unknown SYMBOL!";  
                      }  
                    }
                   
                  }           
                 if( t[i].type=="INTEGER" )                                      
                  {param[pI]=i;
                   ++pI;}
                          
                 if(isFunction(environment[env][t[f].value])) // if SYMBOL is a function        
                  {var ff=environment[env][t[f].value];
                   console.log(t[f].value+" is a function");     
                   rParam=2; // currently all functions have 2 parameters 
                  }      
                 else
                  {console.log(t[f].value+" is a value");     
                   rParam=0;}// to be changed ... currently only SYMBOLS without func. 
                     
                 if((rParam==0)&&(pI==0))            
                  {var pval=environment[env][t[f].value];
                   var nt={type: "INTEGER", value: pval};   
                   console.log("value "+t[f].value+" "+pval);
                   ntok.push(nt);
                  }
                 if((rParam==2)&&(pI==2))
                  {//var ff=environment[env][t[f].value];
                   console.log("operation "+t[f].value+" "+t[param[0]].value+
                               " "+t[param[1]].value);
                   //console.log("env structure: "+JSON.stringify(environment));
                   var nt={type: "INTEGER", value: ff(t[param[0]].value,t[param[1]].value)};
                   ntok.push(nt);
                  } 
                 ++i;
                }  
                return ntok;
               };

// addition for step 3


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


module.exports = ({evaluate: evaluate,replEnv: replEnv});