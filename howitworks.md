<html> 

<body>
<h1>How the tiny lisp interpreter of mine is working </h1>

<h3> Content </h3> 
<ul>
<li><a href="#listortree">The List or Tree Structure</a></li>
<li><a href="#repl">The REPL</a></li>
<li><a href="#evaluation">The Evaluation</a></li>
<li><a href="#specialfunctions">The “special functions” or list and enviroment modifiers</a></li>
<li><a href="#workarounds">Workarounds for lack of lambda</a></li>
</ul>

<h2 id="listortree">The List or Tree Structure</h2>

<p>Probably one of the reasons why Lisp is still worth looking at in the 21st century.</p> 

<p>The structure is build recursivly from the “tokenized” form or from without brackets. The required functions are all in reader.js. The evaluation copies this structure. 
However the functions for evaluation are in eval.js .</p> 

<p>There is a function readForm which calls either readAtom or readList. Through readForm readList is interwoven with readAtom, which reads a single Element. </p>

<p>The structure is saved as array. In simple language each thing between parenthesis is actually an array itself.</p><p> So (+ 1 (* 2 3)) becomes [ “+”,”1” , [ “*” , “2”, “3” ] ] and then further types and additional information is added.</p>

<p>The function readList reads an whole such array. </p>
<p>The function readAtom is extended to recognize and set types.</p>

Currently implemented are 

<ul>
<li>SYMBOL … an alphanumeric string ; used for variables and
         functions</li>

<li>BOOLEAN … boolean values true and false </li>

<li>INTEGER … simple numbers without dot and minus</li>
</ul>

<br></br>

<h2 id="repl">The REPL </h2>

<p>REPL is short for repeat , evaluate … etc. There is even an npm package for that because it is so common and that is used in repl.js. </p>

<p>By the way you start the whole thing with </p>

	<center>node repl.js . </center>

<h2 id="evaluation">The Evaluation </h2>

<p>... or the E in REPL is actually the heart of the whole thing and it is by nature very recursive. </p>

<p>Basically like in Thue or in other simple languages based on String Rewriting Theorem you replace one part with just another and then do that thing over and over again. </p>

<p>Lisp uses its “list” or better tree or graph structure. 
It uses also different environments – more about that in another chapter. </p>

<p>JavaScript knows associative arrays and both functions and variables are stored in an associative array. For ease I call and to be compatible with the sayings and writings of others I call this “environment”. </p>

<p>A variable usually marked as “type: SYMBOL” is looked up in the array and then it is replaced by the value it represents. </p>

<p>Just to give a sample: </p>

<pre>(define x 3 ) // roughly the same as JS var x=3 </pre>

<p>an expression (+ x 1)  is replaced with (+ 3 1)
as 3 is the value of x and then in the next call 
or execution of function evalList in function evaluate
the +-function is executed and (+ 3 1) is replaced 
with (4). </p>

<p>(4) and other similar looking things are called singletons by me and they are removed from their parenthesis in function evalForm. This means they used to be an array in an array before but now become part of an array. In the case of (4) , it just becomes 4. </p>

<p>The functions evalForm, evalList and evalAtom are anaolog to the functions readForm, readList and readAtom in file reader.js and already discussed in the first chapter. </p>

<p>It is important that those two things are analog to each other because otherwise it would make the whole interpreter an unknown multiple more difficult. </p>

<p>It is important to keep certain parts well structured and it is a bad idea to design them by trial and error. I'd say you need at least a glimpse of an understanding what a logical proof is. Otherwise you will produce one garbage after another. </p>

<p>Just as variables are stored in what's refered to as environemnt so are functions. There is no real difference between single values and lists as single values are just lists with one atom or element. Functions are just stored as lists too. </p>

<p>However certain functions are not stored as lists because they had to be there before the evaluate function or the interpreter was there. </p>

<p>Thus there are functions stored in an associative array 
called replEnv in eval.js and functions coded in the evaluate function itself. </p>

<p>The latter modify the list structure or add functions and
variables to the environment. I will call them “special functions” for now although the term might not be correct. </p>

<h2 id="specialfunctions">The “special functions” or list and enviroment modifiers</h2>

<p>A variable or function just gets replaced by a return value when evaluated or when processed in the evaluate function. </p>

<p>There are however certain let's say “special functions” or modifiers which do more than that. </p>

<p>Currently the interpreter supports the following </p>
<ul>	
	<li>define</li>
	<li>if</li>
	<li>car </li>
	<li>cdr</li>
	<li>cons</li>
	<li>quote </li>
</ul>

<h3>-- define</h3>

<p>... modifies the environment and defines a new function or variable. Currently you have to make use of “quote” in case you want the variable to store the unevaluated list. </p>

<p>So I see I have to give a sample </p>

<pre>(define x (+ 1 2)) will do just the same as (define x (3)) . 

(define x (quote (+ 1 2))) will store (+ 1 2) in x. </pre>

<h3>-- quote</h3>

<p>... is different from the other modifiers in that I even put it out of the recursive or in reality iterative looping. </p>

<p>It is thus even more special than “define” and all others.</p>

<p>“quote” prevents its argument or parameter from being evaluated and thus it is the key of defining functions.</p>

<p>Although the current implementation does not include “lambda” it is somehow quirky possible to define functions which can have parameters and add an equivalent of a local environment. </p>

<p>This was mentioned by an Austrian on the web but he did not explain how , so I started to ask questions and think about it. </p>

<h3>-- if</h3>

<p>It ruined the shortness of my evalList function and currently has to even work as a substitute by the more elaborate “cond” in my implementation. </p>

<p>“if” replaces itself by value depending whether or not a statement is true or not. </p>

<p>It has three arguments. The first I may call condition or statement which is evaluated to a BOOLEAN value --- thus only either true or false. </p>

<p>In case the first argument evaluates to true  the whole thing is replaced by the second argument. In case it is false it gets replaced by the third argument. </p>

<p>It is important that no code of the if-arguments gets executed before it is decided whether or not the condition or statement is true or false. </p>

<h3>-- car, cdr, cons</h3>

<p>A list can be regarded as a family of mice biting each other in the tail – probably going for a walk that way. </p>

<p>“car” returns the first element or head of the list. In our mouse family example this would probably be mama mouse. In Lisp jargon this is described as returning the head. </p>

<p>“cdr” returns all the elements attached to the first element. In Lisp jargon this is called the tail. </p>

<p>“cons” is short for constructing and constructs a list from two arguments which are usually lists by themselves. Unfortunately the implementation of “cons” is still buggy by the time I am writing this. </p>

<p>Don't think about mice as those are list elements and I have told you that list elements can also be list of themselves. </p>

<p>This cries for another sample so I give you one. </p>

<p>You can define a list currently by </p>
<center>
(define x ((1 2)(3 4)) ) </center>

<p>thanks to the implementation of types , which doesn't let the code suppose 1 and 3 are functions. </p>

<p>(car x) should then return (1 2)   </p>

<p>while (cdr x) should then return (3 4) . </p>

<h2 id="workarounds">Workarounds for lack of lambda </h2>

<p>As I mentioned earlier “lambda” is not yet implemented so   I am showing you a workaround.</p> 

<p>Suppose you want to implement a simple function “double” which doubles the amount of a given parameter. </p>

<p>In Scheme and other Lisp interpreters you can do so by </p>

<center>(define double (lambda (x) (* 2 x)) )</center>

<p>which you can also do in javaScript by </p>

<center>var double = function (x){return 2*x;};</center>

<p>or by using the arrow function</p>

<center>var double = x => 2*x;</center>

<p>So , how can it be done without lambda ?</p>

<pre>(define double (quote (* 2 (car (cdr doublex)))) )</pre>

<p>then you attach the value you want for x with </p>

<pre>(define doublex (cons double (quote (3 0))) )</pre>

<p>then you execute the whole thing with </p>

<pre>(eval (car doublex))</pre>

<p>... unfortunately I have not yet made evaluate to be called directly , but you can do so quite easily. </p>

</body></html>
 