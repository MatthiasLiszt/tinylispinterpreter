
var environment=[];
var curEnv; //index of current Environment

var replEnv = {};

replEnv['+'] = function(a,b){return a+b;};
replEnv['-'] = function(a,b){return a-b;};
replEnv['*'] = function(a,b){return a*b;};
replEnv['/'] = function(a,b){return a/b;};

replEnv["def!"]=function(a,b){console.log("def ! executed with "+a+" "+b);
                              envSet(a,b,curEnv);};

environment.push(replEnv);

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
                                                   
                 if(pI==2)
                  {var ff=environment[env][t[f].value];
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