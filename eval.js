

var replEnv = {};

replEnv['+'] = function(a,b){return a+b;};
replEnv['-'] = function(a,b){return a-b;};
replEnv['*'] = function(a,b){return a*b;};
replEnv['/'] = function(a,b){return a/b;};

var evaluate = function (tt,env){
                var i=0;
                var fset=false;
                //var param=new Array(7);
                var param=[];
                var t,f,pI=0,lpush=0;
                var ntok=[];
                
                while(tt[i]!==undefined){
                 t=tt; 
                 if(Array.isArray(t[i])){for(var k=lpush;k<i;++k)
                                              {ntok.push(t[k]);
                                              }  
                                           lpush=i;
                                           t=tt[i];}
                 if(t[i].type=="SYMBOL")  
                  {f=i;//index of SYMBOL
                   fset=true;
                   //param.fill(0);
                   param[0]=-1;
                   param[1]=-1;
                   pI=0;
                  }           
                 if( (t[i].type=="INTEGER") && fset)                                      
                  {param[pI]=i;
                   //param.push(t[i].value);
                   ++pI;}
                 if( (t[i].type=="INTEGER") && !fset)
                  {//param.fill(0);
                   param[0]=-1;
                   param[1]=-1;  
                   pI=0;
                  }                                       
                 if(pI==2)
                  {var ff=env[t[f].value];
                   console.log("operation "+t[f].value+" "+t[param[0]].value+
                               " "+t[param[1]].value);
                   var nt={type: "INTEGER", value: ff(t[param[0]].value,t[param[1]].value)};
                   ntok.push(nt);
                  } 
                 ++i;
                }  
                return ntok;
               };

module.exports = ({evaluate: evaluate,replEnv: replEnv});