/*

 Author: Matthew Might
 Site:   http://matt.might.net/

 This file provides a non-blocking parsing toolkit based on the
 derivatives of context-free languages.

 A parser transforms a stream of tokens into a parse tree (also called
 an abstract syntax tree, or an AST).

 */


import scala.collection.immutable.{SortedSet}
import scala.collection.immutable.{TreeSet => FirstSet} 

import java.lang.{Object => TokenTag}


/** 
 A context-free pattern describes a language (a set of strings) with
 recursive structure.

 It's not inaccurate (even if it is uncommon) to think of context-free
 grammars as recursive regular expressions.
 */
abstract class Pattern {
  
  /**
   @return the concatenation of this pattern with <code>pat2</code>.
   */
  def ~ (pat2 : Pattern) = ConPattern(this,pat2)

  /**
   @return the alternation of this pattern with <code>pat2</code>.
   */
  def | (pat2 : Pattern) = AltPattern(this,pat2)

  /**
   @return the simplified concatenation of this pattern with <code>pat2</code>.
   */
  def ~~ (pat2 : Pattern) : Pattern = {
    if (this.empty || pat2.empty)
      EmptyPattern
    else if (this == Eps)
      pat2
    else if (pat2 == Eps)
      this
    else
      ConPattern(this,pat2)
  }

  /**
   @return the simplified alternation of this pattern with <code>pat2</code>.
   */
  def || (pat2 : Pattern) : Pattern = {
    if (this.empty)
      pat2
    else if (pat2.empty)
      this
    else
      AltPattern(this,pat2)
  }

  /**
   A cache of local derivatives.
   */
  private val derivatives = MutableLinkedMap[TokenTag,Pattern]()


  /**
   Takes the derivative and caches the result.
   @param c the token tag with respect to which the derivative is taken.
   @return the derivative with respect to <code>c</code>.
   */
  def derive(c : TokenTag) : Pattern = {
    (derivatives get c) match {
      case Some(d) => d
      case None => {
        val d = this.derivative(c)
        derivatives(c) = d
        // derivatives.clear() // slows it down, but prevents space leaks
        d
      }
    }
  }

  /**
   Specific patterns need to define this method.
   @return the specific derivative of this pattern.
   */
  protected def derivative(c : TokenTag) : Pattern ;

  /**
   @return the set of tokens which could appear first in this pattern.
   */
  def first : SortedSet[TokenPattern] = attributes.first.value

  /**
   @return the set of tokens which could appear first in this pattern,
   ignoring parsing markers.
   */
  def firstc : SortedSet[TokenPattern] = attributes.firstc.value

  /**
   @return true iff this pattern accepts the empty string.
   */
  def nullable : Boolean = attributes.nullable.value

  /**
   @return true iff this pattern accepts the empty string, treating parsing markers as empty.
   */
  def nullablec : Boolean = attributes.nullablec.value

  /**
   @return true iff this pattern accepts no strings.
   */
  def empty : Boolean = attributes.empty.value

  /**
   A collection of attributes which must be computed by iteration to a fixed point.
   */
  object attributes {
    private var generation = -1 ;
    private var stabilized = false ;

    /**
     An attribute computable by fixed point.
     
     @param bottom the bottom of the attribute's lattice.
     @param join the lub operation on the lattice.
     @param wt the partial order on the lattice.

     */
    abstract class Attribute[A](bottom : A, join : (A,A) => A, wt : (A,A) => Boolean)
    {
      private var currentValue : A = bottom
      private var compute : () => A = null
      private var fixed = false

      /**
       Sets the computation the updates this attribute.

       @param computation the computation that updates this attribute.
       */
      def := (computation : => A) {
        compute = (() => computation) 
      }

      /**
       Permanently fixes the value of this attribute.

       @param value the value of this attribute.

       */
      def :== (value : A) {
        currentValue = value
        fixed = true
      }

      /**
       Recomputes the value of this attribute.
       */
      def update() {
        if (fixed)
          return ;

        val old = currentValue
        val newValue = compute()
        
        if (!wt(newValue,currentValue)) {
          currentValue = join(newValue,currentValue)
          FixedPoint.changed = true 
        }
      }

      /**
       The current value of this attribute.
       */
      def value : A = {
        // When the value of this attribute is requested, there are
        // three possible cases:
        //
        // (1) It's already been computed (this.stabilized);
        // (2) It's been manually set (this.fixed); or
        // (3) It needs to be computed (generation < FixedPoint.generation).
        if (fixed || stabilized || (generation == FixedPoint.generation))
          return currentValue 
        else
          // Run or continue the fixed-point computation:
          fix() 

        if (FixedPoint.stabilized) 
          stabilized = true

        return currentValue        
      }
    }

    // Subsumption tests for attributes:
    private def implies (a : Boolean, b : Boolean) = (!a) || b
    private def follows (a : Boolean, b : Boolean) = (!b) || a
    private def subsetOf (a : Set[TokenPattern], b : Set[TokenPattern]) = a.subsetOf(b)

    object first extends Attribute[SortedSet[TokenPattern]](FirstSet[TokenPattern](),_ ++ _,subsetOf)
    object firstc extends Attribute[SortedSet[TokenPattern]](FirstSet[TokenPattern](),_ ++ _,subsetOf)
    object nullable extends Attribute[Boolean](false,_ || _,implies)
    object nullablec extends Attribute[Boolean](false,_ || _,implies)
    object empty extends Attribute[Boolean](true,_ && _,follows)

    private def updateAttributes() {
      nullable.update() 
      nullablec.update() 
      empty.update() 
      first.update() 
      firstc.update() 
    }
    
    private def fix() {
      this.generation = FixedPoint.generation

      if (FixedPoint.master eq null) {
        FixedPoint.master = this ;
        do {
          FixedPoint.generation += 1
          FixedPoint.changed = false 
          updateAttributes() 
        } while (FixedPoint.changed) ;
        FixedPoint.stabilized = true ;
        FixedPoint.generation += 1
        updateAttributes() 
        FixedPoint.reset() 
      } else {
        updateAttributes()
      }
    }
  }
}


/**
 FixedPoint tracks the state of a fixed point algorithm for the attributes of a grammar.

 In case there are fixed points running in multiple threads, each attribute is thread-local.
 */

private object FixedPoint {
  private val _stabilized = new ThreadLocal[Boolean]
  _stabilized.set(false)
  def stabilized = _stabilized.get ;
  def stabilized_= (v : Boolean) { _stabilized.set(v) }

  private val _running = new ThreadLocal[Boolean]
  _running.set(false)
  def running = _running.get ;
  def running_= (v : Boolean) { _running.set(v) }

  private val _changed = new ThreadLocal[Boolean]
  _changed.set(false)
  def changed = _changed.get ;
  def changed_= (v : Boolean) { _changed.set(v) }  

  private val _generation = new ThreadLocal[Int]
  _generation.set(0)
  def generation = _generation.get ;
  def generation_= (v : Int) { _generation.set(v) }  

  private val _master = new ThreadLocal[Object]
  _master.set(null)
  def master = _master.get ;
  def master_= (v : Object) { _master.set(v) }  

  /**
   Resets all of the fixed point variables for this thread.
   */
  def reset () {
    this.stabilized = false ;
    this.running = false ;
    this.master = null ;
    this.changed = false ;
    this.generation = 0 ; 
  }
}


/**
 Represents the union of two context-free patterns.
 */
case class AltPattern(pat1 : Pattern, pat2 : Pattern) extends Pattern {
  attributes.nullable  := pat1.nullable  || pat2.nullable
  attributes.nullablec := pat1.nullablec || pat2.nullablec
  attributes.empty     := pat1.empty     && pat2.empty
  attributes.first     := pat1.first     ++ pat2.first
  attributes.firstc    := pat1.firstc    ++ pat2.firstc

  def derivative(c : TokenTag) = 
    pat1.derive(c) || pat2.derive(c)

  override lazy val hashCode = 2*pat1.hashCode() + pat2.hashCode() 
}


/**
 Represents the concatenation of two context-free patterns.
 */
case class ConPattern(pat1 : Pattern, pat2 : Pattern) extends Pattern {
  attributes.nullable  := pat1.nullable  && pat2.nullable
  attributes.nullablec := pat1.nullablec && pat2.nullablec
  attributes.empty     := pat1.empty     || pat2.empty
  attributes.first     := (if (pat1.nullable) {
                             pat1.first ++ pat2.first
                           } else {
                             pat1.first
                           })
  attributes.firstc   := (if (pat1.nullablec) {
                            pat1.firstc ++ pat2.firstc
                          } else {
                            pat1.firstc
                          })

  def derivative(c : TokenTag) = {
    if (pat1.nullable) {
      (pat1.derive(c) ~~ pat2) || pat2.derive(c)
    } else {
      pat1.derive(c) ~~ pat2
    }
  }
    

  override lazy val hashCode = 2*pat1.hashCode() + pat2.hashCode() 

  override lazy val toString = pat1 + " ~ " +  pat2
}



/**
 Represents zero or more repetitions of a context-free pattern.
 */
case class RepPattern(pat : Pattern) extends Pattern {
  attributes.nullable  :== true 
  attributes.nullablec :== true
  attributes.empty     :== false
  attributes.first     :=  pat.first
  attributes.firstc    :=  pat.firstc

  def derivative(c : TokenTag) = 
    pat.derive(c) ~~ this

  override lazy val hashCode = pat.hashCode()
}


/**
 Represents zero or one instances of the supplied pattern.
 */
case class OptPattern(pat : Pattern) extends Pattern {
  attributes.nullable  :== true 
  attributes.nullablec :== true
  attributes.empty     :== false
  attributes.first     :=  pat.first
  attributes.firstc    :=  pat.firstc

  def derivative(c : TokenTag) = 
    pat.derive(c) 

  override lazy val hashCode = pat.hashCode()
}



/**
 Represents a pattern that matches a token with a particular token
 tag.  Every token carries a "tag" indicating its type.  For most
 tokens, their tag will be a string.

 @param tag the tag to match.
 @param isParsingMarker true iff this is a parsing marker tag.

 */
case class TokenPattern(val tag : TokenTag, val isParsingMarker : Boolean)
      extends Pattern with Ordered[TokenPattern]
{

  def this (token : Token) = this(token.tag,token.isParsingMarker)

  attributes.nullable  :== false
  attributes.nullablec :== this.isParsingMarker
  attributes.empty     :== false
  attributes.first     :== FirstSet(this)
  attributes.firstc    :== (if (this.isParsingMarker) { FirstSet() } else { FirstSet(this) })

  /**
   @return true iff this pattern matches the given token tag.
   */
  def matches (c : TokenTag) : Boolean = 
    this.tag == c

  def derivative(c : TokenTag) = 
    if (this matches c)
      Eps
    else
      EmptyPattern

  private lazy val tagString = tag.toString
  
  def compare (that : TokenPattern) : Int = 
    this.tagString compare that.tagString

  override lazy val toString = tag.toString
  override lazy val hashCode = tag.hashCode
}


/**
 A pattern representing the language with only the empty string in it.
 */
case object Eps extends Pattern {
  attributes.nullable  :== true 
  attributes.nullablec :== true 
  attributes.first     :== FirstSet()
  attributes.firstc    :== FirstSet()
  attributes.empty     :== false

  override def derive(t : TokenTag) = EmptyPattern

  def derivative(t : TokenTag) = EmptyPattern

  override def hashCode = 1 
}


/**
 A pattern representing language with no strings in it; that is, this
 is the unmatchable pattern.
 */
case object EmptyPattern extends Pattern {
  attributes.nullable  :== false
  attributes.nullablec :== false
  attributes.first     :== FirstSet()
  attributes.firstc    :== FirstSet()
  attributes.empty     :== true

  def derivative(t : TokenTag) = EmptyPattern

  override def hashCode = 2
}



private object GenericPattern {
  private var id = 0 

  /**
   @return the next available id for a generic pattern.
   */
  def nextId() : Int = synchronized { id = id + 1 ; id }
}

/**
 A generic pattern corresponds to a nonterminal in a context-free grammar.

 A generic pattern can be extended with the ::= operation.
 */
class GenericPattern extends Pattern {
  private var _rules : List[Pattern] = List()

  /**
   The rules that define this pattern.
   */
  def rules : List[Pattern] = _rules

  /**
   Sets the rules that define this pattern.
   */

  def ::= (r : Pattern) = _rules = r :: _rules

  /**
   The unique id of this pattern.
   */
  lazy val id = GenericPattern.nextId()

  
  def derivative(c : TokenTag) : GenericPattern = new Derivative(this,c)

  attributes.nullable  := this.rules exists (_.nullable)
  attributes.nullablec := this.rules exists (_.nullablec)
  attributes.empty     := this.rules forall (_.empty)
  attributes.first     := this.rules.foldLeft (FirstSet[TokenPattern]()) (_ ++ _.first)
  attributes.firstc    := this.rules.foldLeft (FirstSet[TokenPattern]()) (_ ++ _.firstc)


  override def equals (a : Any) : Boolean = {
    if (a.isInstanceOf[GenericPattern]) 
      return a.asInstanceOf[GenericPattern].id == this.id ;
    else 
      return false ;
  }

  override lazy val hashCode = id

  override lazy val toString = "N" + id 
}



/**
 Represents the derivative of a generic pattern.

 @param base the core pattern.
 @param c the tag with respect to which the derivative is taken.
 */
class Derivative (base : GenericPattern, c : TokenTag) extends GenericPattern {

  override lazy val rules : List[Pattern] = {
    (for (r <- base.rules) yield {
      r.derive(c)
    })
  }

  override lazy val hashCode = 2 * base.hashCode + c.hashCode

  override lazy val toString = "D{"+c+"}"
}






/**
   Parsing markers are special tokens that appear in parse strings, but not in input strings.

   The parsing machine converts streams of tokens into lists of tokens containing these markers.

   The markers indicate the structure of the parse.
 */
abstract class ParsingMark extends Token {
  def isParsingMarker = true
  def tag = this
}



/**
 A "hard" empty string (a hard epsilon) is a parsing marker inserted
 into a parse string to indicate that the original context-free
 grammar called for parsing the empty string.
 */
case object HardEps extends ParsingMark {
  
  def localCompare (that : Token) = that match {
    case HardEps => 0
  }

  override lazy val toString = "[e]"

  override def hashCode = 3

}


/**

 An open reduction marker in a parse string indicates that opening of
 a new node in the parse tree.

 @param f the function to construct the tree node from its leaves.
 @param id the unique id of this reduction rule.

 */
case class OpenRed(f : Any => Any, val id : Int) extends ParsingMark {
  def localCompare (that : Token) = that match {
    case OpenRed(thatRed,thatId) => this.id compare thatId
  }

  override lazy val toString = "<" + f.hashCode + "|"

  override lazy val hashCode = f.hashCode

  override def equals (a : Any) = a match {
    case OpenRed(_,id2) => id == id2
    case _ => false
  }
}


/**
 
 A close reduction parsing marker in a parse string indicates the
 end of a node in the parse tree.

 Open/close reduction markers match like balanced parentheses in a
 correct parse string.

 */
case class CloseRed(f : Any => Any, val id : Int) extends ParsingMark {
  def localCompare (that : Token) = that match {
    case CloseRed(thatRed,thatId) => this.id compare thatId
  }

  override lazy val toString = "|" + f.hashCode + ">"

  override lazy val hashCode = f.hashCode

  override def equals (a : Any) = a match {
    case CloseRed(_,id2) => id == id2
    case _ => false
  }
}


/**
 Open/close repetition parsing markers indicate that the nodes between should be converted into a list.
 */
case object OpenRep extends ParsingMark {
  def localCompare (that : Token) = that match {
    case OpenRep => 0
  }

  override lazy val toString = "<*|"

  override lazy val hashCode = 1
}

/**
 Open/close repetition parsing markers indicate that the nodes between should be converted into a list.
 */
case object CloseRep extends ParsingMark {
  def localCompare (that : Token) = that match {
    case CloseRep => 0
  }

  override lazy val toString = "|*>"

  override lazy val hashCode = 2
}


/**
 Open/close option parsing markers indicate that the node between (if
 any) should be converted to an <code>Option</code>.
 */
case object OpenOpt extends ParsingMark {
  def localCompare (that : Token) = that match {
    case OpenOpt => 0
  }

  override lazy val toString = "<?|"
  override lazy val hashCode = 1
}

/**
 Open/close option parsing markers indicate that the node between (if
 any) should be converted to an <code>Option</code>.
 */
case object CloseOpt extends ParsingMark {
  def localCompare (that : Token) = that match {
    case CloseOpt => 0
  }

  override lazy val toString = "|?>"

  override lazy val hashCode = 2
}



/**
 A parsing state is a node in the graph explored by a parsing machine.

 A parsing state indicates a partially parsed input.

 @param lang the pattern meant to match the remaining input.
 @param parse the parse string constructed thus far.
 @param input the remaining input.
 */
case class ParsingState[T <% Token] (val lang : Pattern,
                                     val parse : List[Token],
                                     val input : LiveStream[T])
{

  private lazy val firstMarks : Set[ParsingMark] = {
    val first = lang.first
    val tokens = first filter (_.isParsingMarker)
    tokens map ({ case TokenPattern(tag : ParsingMark,_) => tag })
  }

  /**
   @return true iff this state can consume a parsing marker.
   */
  def hasMarks : Boolean = !firstMarks.isEmpty

  /**
   @return true iff the input consumed thus far is a legal parse.
   */
  def isFinal = lang.nullable

  /**
   @return true iff the input stream in this state is ready to make progress.
   */
  def canConsume = !input.isPlugged && !lang.empty 

  /**
   @return the state that results from consuming the head of the input, if any.
   */
  def nextConsume : Option[ParsingState[T]] = {
    input match {
      case c :~: rest => { 
        val newLang = lang.derive(c.tag)
        val newParseString : List[Token] = c :: parse
        if (!newLang.empty)
          Some(ParsingState[T](newLang, newParseString, rest))
        else {
          None
        }
      }

      case LiveNil() => {
        throw new Exception("Can't consume -- end of input!")
      }

      case LivePlug() => {
        throw new Exception("Can't consume on a plugged stream!")
      }
    }
  }


  /**
   @return the next states resulting from consuming all possible
   parsing marks at the start of the language.
   */ 

  def nextMark : List[ParsingState[T]] = { 
    val marks = firstMarks
    
    
    if (input.isPlugged) {
      // If the input is plugged; derive.
      for (c <- marks.toList) yield {
        val newLang = lang.derive(c)
        val newParseString = c :: parse
        ParsingState(newLang, newParseString, input)
      }
    } else {
      // If the input isn't plugged, eliminate subsequent states which
      // can't ever match the head of the input.
      def canMatchHead(pats : Set[TokenPattern]) : Boolean = 
        if (input.isEmpty)
          true
        else
          pats exists (pat => pat matches input.head.tag)
      
      for (c <- marks.toList if (lang.derive(c).nullable || canMatchHead(lang.derive(c).firstc))) yield 
        {
          val newLang = lang.derive(c)
          val newParseString = c :: parse
          ParsingState(newLang, newParseString, input)
        }
    }
  }

  override lazy val toString = {
    "lang:  " + lang + "\n" +
    "parse: " + (parse reverse) + "\n" +
    "input: " + input 
  }

  private def listify (o : Any) : List[Any] = {
    o match {
      case a ~ b => a :: listify(b)
      case atom => List(atom)
    }
  }

  /**
   Takes a step toward converting a parse string into a parse tree.
   */
  private def reduceStep (stack : List[Any], parseString : List[Token]) : (List[Any], List[Token]) = 
  {
    def combine (newTop : Any, stack : List[Any], rest : List[Token]) = stack match {
      case (top@(CloseRed(_,_)|CloseRep|CloseOpt)) :: tail => (newTop :: top :: tail, rest)
      case data :: tail => (new ~(newTop,data) :: tail, rest)
      case List() => (List(newTop),rest)
    }

    def reassociate (data : Any) : Any = data match {
      case a ~ (b ~ rest) => reassociate(new ~(new ~(a,b),rest))
      case a ~ b => data
      case a => data
    }

    (stack,parseString) match {
      case (_,(c @ CloseRed(f,_)) :: rest) => (c :: stack,rest) 
      case (_,(c @ CloseRep) :: rest) => (c :: stack,rest)
      case (_,(c @ CloseOpt) :: rest) => (c :: stack,rest)
      case (_,HardEps :: rest) => combine((),stack,rest)
      case (data :: CloseRed(f1,id1) :: tail, OpenRed(f2,id2) :: rest) if id1 == id2 => {
        val rdata = reassociate(data)
        combine(f1(rdata),tail,rest)
      }
      case (CloseRep :: tail, OpenRep :: rest) =>
        combine(List(),tail,rest)
      case (data :: CloseRep :: tail, OpenRep :: rest) =>
        combine(listify(data),tail,rest)

      case (CloseOpt :: tail, OpenOpt :: rest) =>
        combine(None,tail,rest)
      case (data :: CloseOpt :: tail, OpenOpt :: rest) =>
        combine(Some(data),tail,rest)

      case ((top@(CloseRed(_,_)|CloseRep|CloseOpt)) :: tail, c :: rest) =>
        combine(c, top :: tail, rest)

      case (data :: tail, c :: rest) =>
        combine(new ~(c,data), tail, rest)
      case (List(answer), List()) => 
        throw new Exception("Bug: over-parsed!")
    }
  }

  /**
   Converts a parse string into a parse tree.
   */
  def reduce () : Any = {
    var state : (List[Any],List[Token]) = (List(), parse) 
    while (state._2.length > 0) {
      state = reduceStep(state._1,state._2)
    }
    state._1.head
  }
  
}


/**
 A parsing machine parses by exploring the graph of parsing states.

 The exploration uses two work-lists: a high-priority list, and a low-priority list.

 The exploration only pulls from the low-priority list when the high-priority list is empty.

 The high-priority states should consume a character; the low-priority
 states should consume a parsing mark.
 */
class ParsingMachine[T <% Token] (val lang : Pattern, 
                                  val input : LiveStream[T])
{
 
  input.source.addListener (tokens => {
    // After we get more input, search some more.
    this.search() ;
  })


  /**
   High-priority to-do list for configurations which could consume a character.
   */
  private var highTodo : List[ParsingState[T]] = 
    List(ParsingState[T](lang,List[Token](),input))

  /**
   Low-priority to-do list for configurations which might produce a parsing marker.
   */
  private var lowTodo : List[ParsingState[T]] = 
    List(ParsingState[T](lang,List[Token](),input))

  private val finalSource = new LiveStreamSource[ParsingState[T]]()

  /**
   A stream of final parsing states; final parsing states can be reduced.
   */
  val output : LiveStream[ParsingState[T]] = new LiveStream(finalSource)


  /**
   Returns the newest frontier states in the parsing state search
   space.
   */
  private def nextStates () : Iterable[ParsingState[T]] = {
    if (!highTodo.isEmpty && highTodo.head.canConsume) {
      val next = highTodo.head
      highTodo = highTodo.tail
      return next nextConsume
    } else if (!lowTodo.isEmpty && !lowTodo.head.lang.empty) {
      val next = lowTodo.head
      lowTodo = lowTodo.tail 
      return next nextMark
    } else {
      return Nil
    }
  }


  /**
   Searches the parsing state-space as much as possible given the input available.
   */
  def search () {
    while (!highTodo.isEmpty || !lowTodo.isEmpty) {
      
      val newConfs = nextStates() 

      highTodo = (newConfs filter (!_.lang.firstc.isEmpty)).toList ++ highTodo
      lowTodo = (newConfs filter (_.hasMarks)).toList ++ lowTodo 

      var foundFinal = false
      for (conf <- newConfs) {
        if (conf.isFinal) {
          finalSource += conf
          foundFinal = true
        }
      }

      // Pause search when we've found at least one final state
      if (foundFinal)
        return 
    }
  }

  // In case any input is ready, search:
  this.search()
}






/* Parser combinators. */


/**
 Contains a sequence of two parsed items.
 */
case class ~[A,B](val a : A, val b : B)


/**
 An abstract parser that creates parse trees of type <code>A</code>.
 */
abstract class Parser[A] {

  /**
   @return a new parser which parses the concatenation of this parser and the supplied parser.
   */
  def ~[B] (pat2 : Parser[B]) : Parser[~[A,B]] = new ConParser(this,pat2)

  /**
   @return a new parser which parses as this parser or the supplied parser.
   */  
  def | (pat2 : Parser[A]) : Parser[A] = new AltParser(this,pat2)

  /**
   @return a new parser which accepts zero or more repetitions of this parser.
   */
  def * : Parser[List[A]] = new RepParser(this)

  /**
   @return a parser which may parse what this parser parses.
   */
  def ? : Parser[Option[A]] = new OptParser(this)


  /**
   @return a parser that parses what this parser parses, but converts the result.
   */
  def ==>[B] (f : A => B) = new RedParser(this,f)

  /**
   @return a context-free pattern that matches the parse strings describe by this parser.
   */
  def compile : Pattern ;

  /**
   @return a parsing machine for this parser on the specified input.
   */
  def machine [T <% Token] (input : LiveStream[T]) : ParsingMachine[T] = 
    new ParsingMachine(this.compile, input)

  /**
   Returns the parse tree from completely consuming the input for this parse.   

   This procedure assumes the parser is unambiguous.  

   If you need access to all possible parse trees, use the <code>machine</code> method.

   @return the parse tree from completely consuming the input for this parse.
   */
  def parseFull [T <% Token] (input : LiveStream[T]) : A = {
    val m = machine(input)
    val finals = m.output
    val state = finals.head
    if (state.input.isEmpty)
      return state.reduce().asInstanceOf[A]
    else
      throw new Exception("Full parse failure; input remaining: " + state.input)
  }

  def parseFull [T <% Token] (input : Iterable[T]) : A = {
    return parseFull (LiveStream(input))
  }

  /**
   Returns the parse tree and the remaining input.

   This procedure assumes the parser is unambiguous.  

   If you need access to all possible parse trees, use the <code>machine</code> method.

   @return the parse tree and the remaining input.
   */
  def parse [T <% Token] (input : LiveStream[T]) : (A,LiveStream[T]) = {
    val m = machine(input)
    val finals = m.output
    val state = finals.head
    return (state.reduce().asInstanceOf[A], state.input) 
  }

  def parse [T <% Token] (input : Iterable[T]) : (A,LiveStream[T]) = {
    return parse (LiveStream(input))
  }

}



/**
 Represents an extensible parser that produces parse trees of type <code>A</code>.
 */
class GenericParser[A] extends Parser[A] {
  
  private var rules : List[Parser[A]] = List() ;

  /**
   Adds a new parser to this parser.
   */
  def ::= (parser : Parser[A]) {
    rules = parser :: rules ;
  }

  private var compileCache : GenericPattern = null 


  /**
   Compiles a parser into context-free pattern, such that when the context-free pattern
   is given to a parsing machine, the parsing machine produces parse trees.
   */
  def compile : GenericPattern = {
    if (this.compileCache != null)
      return this.compileCache ;

    this.compileCache = new GenericPattern
    for (pat <- rules) {
      this.compileCache ::= (pat.compile)
    }
    this.compileCache
  }
}




/**
 Matches tokens with the specified tag.
 */
case class TokenParser(val tag : String) extends Parser[Token] {
  lazy val compile = TokenPattern(tag,false)
}

/**
 Matches strings of length 0.
 */
case object EpsParser extends Parser[Unit] {
  lazy val compile = new TokenPattern(HardEps)
}

/**
 Cannot match any strings.
 */
case object EmptyParser extends Parser[Nothing] {
  lazy val compile = EmptyPattern
}

/**
 A parser representing the concatenation of two parsers.
 */
class ConParser[A,B](pat1 : Parser[A], pat2 : Parser[B]) extends Parser[~[A,B]] {
  lazy val compile = ConPattern(pat1.compile, pat2.compile)
}

/**
 A parser representing the union of two parsers.
 */
class AltParser[A](pat1 : Parser[A], pat2 : Parser[A]) extends Parser[A] {
  lazy val compile = AltPattern(pat1.compile,pat2.compile)
}

/**
 A parser representing the possibly-empty repetition of another parser.
 */
class RepParser[A](pat : Parser[A]) extends Parser[List[A]] {
  lazy val compile = ConPattern(new TokenPattern(OpenRep),
                         ConPattern(RepPattern(pat.compile),
                                    new TokenPattern(CloseRep)))
}

/**
 A parser representing zero or one instances of another parser.
 */
class OptParser[A](pat : Parser[A]) extends Parser[Option[A]] {
  lazy val compile = ConPattern(new TokenPattern(OpenOpt),
                                ConPattern(OptPattern(pat.compile),
                                           new TokenPattern(CloseOpt)))
}


private object Reduction {
  private var id = 0
  def nextId() = synchronized { id += 1; id }
}


/**
 A parser which converts the parse tree of one parse into a new parse tree.
 */
class RedParser[A,B](pat : Parser[A], f : A => B) extends Parser[B] {
  val g = f.asInstanceOf[Any => Any]
  lazy val id = Reduction.nextId() 
  lazy val compile = ConPattern(new TokenPattern(OpenRed(g,id)),
                                ConPattern(pat.compile,new TokenPattern(CloseRed(g,id))))
}







/* Local data structures. */

private object MutableLinkedMap {

  /**
   @return an empty mutable linked map.
   */
  def apply[A,B]() : MutableLinkedMap[A,B] = new MutableLinkedMap()
}

/**
 For small maps, linked maps are more space-efficient than hash maps.
 */
private class MutableLinkedMap[A, B] extends Iterable[(A,B)]
{
  private var internalMap : scala.collection.immutable.Map[A,B]
   = scala.collection.immutable.ListMap[A,B]() ;

  def get (a : A) : Option[B] = (internalMap get a) ;

  def getOrElse (a : A, d : B) : B = (internalMap getOrElse (a,d)) ;

  def update(a : A, b : B) = {
    internalMap = (internalMap(a) = b)
  }

  override def filter(p : ((A, B)) => Boolean) =
    internalMap.filter(p)

  override def mkString (sep : String) = internalMap.mkString (sep)

  override def elements = internalMap.elements

  def iterator = elements

  override def isEmpty = internalMap.isEmpty

  def clear() { internalMap = scala.collection.immutable.ListMap[A,B]() } 
}
