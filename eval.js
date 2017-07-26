
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
                var i=0,y=0;
                var fset=false;
                var param=[];
                var t,f,pI=0,lpush=0;
                var ntok=[];
                var nImmuts=[];//useless new immutables 
                var nI=0;// index for useless new immutables
                
                curEnv=env;// added in step 3
                
                console.log("eval: trying to evaluate "+JSON.stringify(tt));  
                   
                t=tt;               

                while(t[y]!==undefined){
                 if(Array.isArray(t[y])){for(var k=lpush;k<i;++k)
                                              {ntok.push(t[k]);
                                              }  
                                           lpush=i;
                                           fset=false;
                                           pI=0;
                                           console.log(" FSET set to false !!!");  
                                           t=t[y];
                                           y=0;
                                          }
                 console.log(" current value to test "+t[y].value);    
                 if(t[y].type=="SYMBOL")  
                  {if(fset) 
                    {if(envFind(t[y].value,env)!="error!")
                      {var pval=environment[env][t[y].value];
                       nImmuts.push(pval);
                       console.log("parameter was "+pval+" and is "+nImmuts[param[pI]]);
                      }
                     else
                      {nImmuts.push(t[y].value);
                       console.log("string pushed as "+nImmuts[param[pI]]);
                      }
                     param[pI]=nI;
                     ++nI; 
                     ++pI; 
                     
                    }
                   if(!fset) 
                    {if(envFind(t[y].value,env)!="error!")
                      {console.log(t[y].value+" exists in env. !");
                       if(isFunction(environment[env][t[y].value])) // if SYMBOL is a function     
                        {fset=true;
                         f=y;//index of SYMBOL
                         pI=0;
                         var ff=environment[env][t[f].value];
                         console.log(t[f].value+" is a function");     
                         rParam=2; // currently all functions have 2 parameters  
                               
                        }
                       else
                        {console.log(t[y].value+" is a value");     
                         var pval=environment[env][t[y].value];
                         ntok.push(pval);
                         console.log(pval+" pushed");
                        } 
                      }
                     else
                      {console.log("unknown SYMBOL detected !!!");
                       return "error!unknown SYMBOL!";  
                      }  
                    }
                   
                  }           
                 if( t[y].type=="INTEGER" )                                      
                  {param[pI]=nI;
                   nImmuts.push(t[y].value)
                   console.log("INTEGER detected and pushed "+nImmuts[param[pI]]);
                   console.log("     y "+y+" t[y].value "+t[y].value);
                   console.log(" nI : "+param[0]+" "+param[1]);
                   ++nI;
                   ++pI;
                   
                  }
                 
                                                               
                 if((rParam==2)&&(pI==2))
                  {var ff=environment[env][t[f].value];
                   console.log("operation "+t[f].value+" "+nImmuts[param[0]]+
                               " "+nImmuts[param[1]]);
                   //console.log("env structure: "+JSON.stringify(environment));
                   var nt={type: "INTEGER", value: ff(nImmuts[param[0]],nImmuts[param[1]])};
                   ntok.push(nt);
                   console.log("nImmuts-debug nI="+nI);
                   nImmuts.map(function(x){console.log(" "+x)});
                  } 
                 ++i;
                 ++y;
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