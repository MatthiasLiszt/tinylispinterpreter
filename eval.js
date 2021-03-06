var environment=[];
var curEnv; //index of current Environment

var replEnv = {};

replEnv['+'] = function(a,b){return {type: "INTEGER", value: a+b};};
replEnv['-'] = function(a,b){return {type: "INTEGER", value: a-b};};
replEnv['*'] = function(a,b){return {type: "INTEGER", value: a*b};};
replEnv['/'] = 
 function(a,b){return {type: "INTEGER", value: Math.floor(a/b)};};//it's not floating point division
replEnv['%'] = function(a,b){return {type: "INTEGER", value: a%b};};
replEnv['mod'] = function(a,b){return {type: "INTEGER", value: a%b};};

replEnv['>'] = function(a,b){return {type: "BOOLEAN", value: (a>b)};};
replEnv['<'] = function(a,b){return {type: "BOOLEAN", value: (a<b)};};
replEnv['='] = function(a,b){return {type: "BOOLEAN", value: (a==b)};};
replEnv['>='] = function(a,b){return {type: "BOOLEAN", value: (a>=b)};};

replEnv['and'] = function(a,b){return {type: "BOOLEAN", value: (a&&b)};};
replEnv['or'] = function(a,b){return {type: "BOOLEAN", value: (a||b)};};
replEnv['not'] = function(a){return {type: "BOOLEAN", value: (!a)};};


replEnv["def!"]=function(a,b){console.log("def ! executed with "+a+" "+b);
                              return envSet(a,b,curEnv);};

replEnv['t']=function(){return {type: "BOOLEAN", value: true};}
replEnv['f']=function(){return {type: "BOOLEAN", value: false};}
replEnv['nil']=function(){return {type: "BOOLEAN", value: false};}

//replEnv['quote']=function(){return 0;};// not to be executed 

environment.push(replEnv);

// after days of disappointment I finally decided to somehow copy the reader functions
var evaluate = function (t,env){
               var qDetected=false;
               var deQuote=false; // deQuote switch 
                                                                 
                 function evalForm(t,env,i){
                  
                  if(t[i]!==undefined)
                   {if(Array.isArray(t[i]))
                     {if( (t[i][0].type=="INTEGER") && (t[i][1]===undefined) )
                       {console.log("singleton detected and replaced");
                        return t[i][0];}
                      if( (t[i][0].type=="BOOLEAN") && (t[i][1]===undefined) )
                       {console.log("singleton detected and replaced");
                        return t[i][0];} 
                      console.log("evalList started ");
                      return evalList(t[i],env);
                       
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
                     if(el.type=="BOOLEAN")   
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
                     
                    if(el.value=='quote'){qDetected=true;
                                          console.log(" quote found !!!");
                                         }
                    
                    if((el.type=="SYMBOL")&&(envFind(el.value,env)!="error!"))
                     {var pval=environment[env][el.value];
                      console.log("function found "+el.value)
                      if(isExecutable(t,qDetected))
                       {console.log("executable");
                        printList(t);
                        if(t.length==1) // parameterless function or variable
                         {var aa=environment[env][t[0].value];
                          var nxp=aa;
                          nterm.push(nxp);
                          console.log("variable detected");                 
                          console.log("nxp "+JSON.stringify(nxp));
                          return nterm;
                         }   
                        if(t.length==2) // single parameter functions
                         {var a;
                          if(t[1].type=="SYMBOL"){a=environment[env][t[1].value];
                                                  a=a.value;}
                          if(t[1].type=="INTEGER"){a=t[1].value;}      
                          if(t[1].type=="BOOLEAN"){a=t[1].value;}      
                          
                          var nxp;
                          nxp=pval(a,b);
                          nterm.push(nxp);
                          console.log("nxp "+JSON.stringify(nxp));
                          i+=2;
                         } 
                        
                        if(t.length==3)  // to be changed ; for 2 arguments only
                         {var a,b;
                          if(t[1].type=="SYMBOL"){a=environment[env][t[1].value];
                                                  a=a.value;}
                          if(t[2].type=="SYMBOL"){b=environment[env][t[2].value];
                                                  b=b.value;}   
                          if(t[1].type=="INTEGER"){a=t[1].value;}      
                          if(t[2].type=="INTEGER"){b=t[2].value;} 
                          if(t[1].type=="BOOLEAN"){a=t[1].value;}      
                          if(t[2].type=="BOOLEAN"){b=t[2].value;}   

                          var nxp;
                          nxp=pval(a,b);
                          nterm.push(nxp);
                          console.log("nxp "+JSON.stringify(nxp));
                          i+=3;
                         }
                        if(t.length>3)
                         {console.log("currently 2 arguments only");
                          throw "too many arguments";
                         }        
                       }
                      else 
                       {atom=evalForm(t,env,i);
                        ++i;
                        nterm.push(atom);
                       } 
                     }  
                    else 
                     {if((el.value=="quote")&&deQuote)
                       {console.log("deQuote mode on ... quote detected");
                        nterm.push(t[1]);
                        deQuote=false;
                        i=i+2;
                        console.log("nterm "+JSON.stringify(nterm));
                        return nterm;
                       }
                      if(el.value=="define")
                       {console.log("define detected");
                        if(Array.isArray(t[2]))
                         {var tC=t[2];
                          if(tC[0].value=="quote")
                           {var tS=tC[1];
                            console.log("parameter deQuoted !!! "); 
                           } 
                          else
                           {var tS=t[2];}
                          console.log("!!! t[2] is an array");
                          console.log("!!! content "+JSON.stringify(tS));
                          console.log("!!! type "+tS.type);
                          console.log("!!! value "+tS.value);
                          if(Array.isArray(tS))
                           {envSet(t[1].value,tS,env);}
                          else
                           {envSet(t[1].value,tS.value,env);}
                         }   
                        else
                         {envSet(t[1].value,t[2].value,env);}
                        nterm.push(t[2]);
                        i+=3;
                        return nterm;
                       } 
                      if(el.value=="car")
                       {console.log("car detected --- param "+t[1].value);
                        var carExecute=false;  
                        if(Array.isArray(t[1]))
                         {//console.log("car not yet executable");
                          var check=t[1];
                          if(check[0].type!="SYMBOL")
                           {console.log("car probably executable");
                            carExecute=true;
                            var car=t[1]; 
                           } 
                         }
                        else
                         {var car=environment[env][t[1].value];
                          carExecute=true;
                         }
                        if(carExecute)   
                         {console.log("possible return: "+JSON.stringify(car));
                          i=i+2;
                          var ccar=car[0];
                          console.log("ccar "+JSON.stringify(ccar));
                          nterm.push(ccar);
                          return nterm;
                         }  
                        else
                          {console.log("car not yet executed");} 
                       }
                      if(el.value=="cdr")
                       {console.log("cdr detected --- param "+t[1].value);
                        var cdrExecute=false;
                        if(Array.isArray(t[1]))
                         {var check=t[1];
                          if(check[0].type!="SYMBOL")
                           {console.log("cdr probably executable");
                            cdrExecute=true;
                            var cdr=t[1]; 
                           } 
                         }  
                        else
                         {var cdr=environment[env][t[1].value];
                          cdrExecute=true;
                         }
                        if(cdrExecute)
                         {i=i+2;
                          var prrr=[];
                          for(var j=1;j<cdr.length;++j)
                           {prrr.push(cdr[j]);
                            nterm.push(cdr[j]);}
                          console.log("possible return: "+JSON.stringify(prrr));
                          return nterm;
                         } 
                        else
                         {console.log("cdr not yet executed");}
                       }
                      if(el.value=="cons")
                       {console.log("cons detected ");
                        var consExecute=0;
                        if(checkCons(t[1])){++consExecute;cons1=t[1];}
                        if(checkCons(t[2])){++consExecute;cons2=t[2];}
                        if(!Array.isArray(t[1]))
                         {++consExecute;environment[env][t[1].value];}
                        if(!Array.isArray(t[2]))
                         {++consExecute;environment[env][t[2].value];} 
                        if(consExecute==2)                        
                         {var prrr=[];
                          prrr.push(cons1);
                          prrr.push(cons2);
                          nterm.push(prrr);
                          console.log("possible return: "+JSON.stringify(prrr));
                          return nterm;
                         }
                        function checkCons(x)
                         {if(Array.isArray(x))
                           {var check=x;
                            if(check[0].type!="SYMBOL"){return true;}
                           } 
                          return false;
                         }
                        
                       }
                      if (el.value=="if")
                       {console.log("define if");
                        if(t[1].value===undefined)
                         {console.log("if is not yet executable ");}
                        else
                         {if(t[1].type=="BOOLEAN")
                            { console.log("if is probably executable");
                               console.log("simplified if condition "+t[1].value);
                               if(t[1].value==false)
                                 {console.log("if condition is FALSE");
                                   nterm.push(t[3]);
                                   return nterm;
                                 }
                              else
                                {console.log("if condition is TRUE");
                                  nterm.push(t[2]);
                                  return nterm;
                                }
                            }
                            else
                              {console.log("probably variable not replaced by value");
                                var rp=environment[env][t[1].value];
                                
                                console.log("variable in >>if<< replaced by "+rp);
                                if(rp==false)
                                 {console.log("if condition is FALSE");
                                   nterm.push(t[3]);
                                   return nterm;
                                 }
                               else
                                {console.log("if condition is TRUE");
                                  nterm.push(t[2]);
                                  return nterm;
                                }
                              }
                         }      
                       }
                      console.log(t[i].type) ;
                      atom=evalForm(t,env,i);
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
                                       
                deQuote=true;  
                return evalList(old,env);                
                
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


function isExecutable(x,q){ // checks if there are no more "nested" parameters 
  var i=0;
  var qDetected=q;
 
  console.log("executing isExecutable x.length "+x.length); 

  if(qDetected)
   {qDetected=false;
    console.log("! ! ! quote detected ! ! !");
    return false;
   }  
 
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


function envSet(s,m,e){var number=/^-?[0-9]+$/;
                       if(number.test(m))
                        {var xp={type: "INTEGER", value: m};
                         environment[e][s]=xp;
                         return xp;
                        }
                       if(isBoolean(m))
                        {var xp={type: "BOOLEAN", value: m};
                         environment[e][s]=xp;
                         return xp;
                        }
                       if(Array.isArray(m))
                        {environment[e][s]=m; //already in the right format 
                         return m;
                        }  
                       console.log("type not supported!");   
                       return "error!";
                      }

function envFind(s,e){for(var x in environment[e])
                                {if(x==s)
                                  {return e;}
                                }
                               console.log(s+" not found! error!"); 
                               return "error!";
                             }

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
                            }

function isAtom(x){
         if(x.type=="INTEGER"){return true;} 
         if(x.type=="SYMBOL"){return true;}   
         if(x.type=="BOOLEAN"){return true;}   
         return false;
  }

function isBoolean(val) {
   return (val === false || val === true);
}



module.exports = ({evaluate: evaluate});