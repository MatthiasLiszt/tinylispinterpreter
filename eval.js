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

<<<<<<< HEAD
// after days of disappointment I finally decided to somehow copy the reader functions
var evaluate = function (t,env){
                 
                                 
                 function evalForm(t,env,i){
                  
                  if(t[i]!==undefined)
                   {if(Array.isArray(t[i]))
                     {console.log("evalList started ");
                      return evalList(t[i],env);} 
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
=======
function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]';
}


// complete rewrite after looking at Paul Graham's Evaluator and reading Norvig's interpreter
var evaluate = function (tt,env){
                var nt=[];
               
               function evaluu(tt,env,y,vl){ // wrapping the function   
                var t=tt;
                var el=t[y];
                

                if(el===undefined)
                 {console.log("current el is undefined");
                  return vl; 
                 } 
                if(Array.isArray(el))
                  {console.log(" list detected");
                   console.log(JSON.stringify(el));
                   var vnl=[];  
                   var oT=t,oY=y,oVl=vl; //saving old values
                   t=el;el=t[0];y=0;  
                   vl=vnl; //starting a new list                         
                  }
                if(isAtom(el)) 
                 {if(el.type=="INTEGER")
                   {console.log(el.value+" added to vl");
                    vl.push(el);
                    ++y; //index for adding atom elements   
                     evaluu(t,env,y,vl);
                    
                   }
                  if((el.type=="SYMBOL")&&(envFind(el.value,env)!="error!"))
                   {var pval=environment[env][el.value];
                    console.log("function found "+el.value)
                    if(isExecutable(t))
                     {console.log("executable");
                      printList(t);
                      ++y; //index for adding atom elements   
                      if(t.length==3)  // to be changed ; for 2 arguments only
                       {console.log(pval(t[1].value,t[2].value));
                        var nxp={type: "INTEGER", value: pval(t[1].value,t[2].value)};
                        oVl.push(nxp); 
                        return evaluu(oT,env,++oY,oVl); // virtually goes up the tree again
>>>>>>> b18ede7f78f269dd1ef2795932cfbb9c7c0bab77
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
<<<<<<< HEAD
=======
                    else
                     {console.log(" nested -- next list : ");
                      vl.push(el);
                      ++y; //index for adding atom elements  
                      vl.push(evaluu(t,env,y,vl));
                      console.log("logical end");
                      printList(vl);
                      return vl;
                     } 
                     
>>>>>>> b18ede7f78f269dd1ef2795932cfbb9c7c0bab77
                   }
                  console.log("nterm created "+JSON.stringify(nterm));
                  return nterm;
                 }
<<<<<<< HEAD

                 return evalList(t,env);   
=======
                }
                nt=evaluu(tt,env,0,nt);
                console.log("evaluate finished ");
                console.log(JSON.stringify(nt));
                return nt;
>>>>>>> b18ede7f78f269dd1ef2795932cfbb9c7c0bab77
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