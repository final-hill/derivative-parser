


object SXParser {

  implicit def charToParser(c : Char) : TokenParser = 
    TokenParser(String.valueOf(c))

  implicit def stringToParser(s : String) : TokenParser = 
    TokenParser(s)

  implicit def symbolToParser(s : Symbol) : TokenParser = 
    TokenParser(s.name)


  val SX     = new GenericParser[SExp]
  val SXList = new GenericParser[List[SExp]]

  SX     ::= '(' ~ SXList ~ (('.' ~ SX)?) ~ ')' ==> 
               { case _ ~ sxl ~ None ~ _ => SExp(sxl) 
                 case _ ~ sxl ~ Some(_ ~ sx) ~ _ => SExp(sxl,sx) }

  SX     ::= 'Symbol  ==> { case SymbolToken(s) => SName.from(s) } 
  SX     ::= 'Int     ==> { case IntToken(n) => SInt(n) }
  SX     ::= 'String  ==> { case StringToken(s) => SText(s) }
  SX     ::= 'Boolean ==> { case BooleanToken(s) => SBoolean(s) }

  SXList ::= (SX *)

}





/* S-Expressions. */
object SExp {

  /**
   Determines the style with which names are printed.
   */
  var shouldNamesBeSymbols = true

  def apply(list : List[SExp]) : SExp = list match {
    case hd :: tl => :+:(hd,apply(tl))
    case Nil => SNil()
  }

  def apply(list : List[SExp], tombstone : SExp) : SExp = list match {
    case hd :: tl => :+:(hd,apply(tl,tombstone))
    case Nil => tombstone
  }

  def parseAllIn (filename : String) : List[SExp] = {
    val input = scala.io.Source.fromFile(filename).mkString("")
    parseAll(input)
  }

  
  def parseAll (input : String) : List[SExp] = {
    throw new Exception()
    /*
    val p = new SExpParser
    p.parseAll(input)
    */
  }

  def parse (input : String) : SExp = {
    throw new Exception()
    /*
    val p = new SExpParser
    p.parse(input)
    */
  }

  private var maxSerialNumber = 0

  def allocateSerialNumber() : Long = {
    maxSerialNumber += 1
    maxSerialNumber
  }
}


abstract class SExp {
  lazy val serialNumber : Long = SExp.allocateSerialNumber()

  def toString : String ;

  def toList : List[SExp] ;
  def toDottedList : (List[SExp],SExp) ;

  def isKeyword : Boolean ;
  def isInteger : Boolean ;
  def isList : Boolean ;
  def isPair : Boolean ; 
  def isNull : Boolean ;
  def isSymbol : Boolean ;
  def isName : Boolean ;
}


final case class SInt(val value : BigInt) extends SExp {
  override def toString = value.toString

  def toList = throw new Exception("Cannot convert integer to list.")
  def toDottedList = (List(),this)

  def isKeyword = false
  def isInteger = true
  def isList = false
  def isPair = false
  def isNull = false
  def isName = false
  def isSymbol = false
}


final case class SChar(val value : Char) extends SExp {
  override def toString = "#\\" + value.toString

  def toList = throw new Exception("Cannot convert integer to list.")
  def toDottedList = (List(),this)

  def isKeyword = false
  def isInteger = false
  def isChar = true
  def isList = false
  def isPair = false
  def isNull = false
  def isName = false
  def isSymbol = false
}


final case class SText(val value : String) extends SExp {
  // BUG: Escape other values inside the string, too.
  override def toString = "\"" + (value.replace("\"","\\\"")) + "\""

  def toList = throw new Exception("Cannot convert string to list.")
  def toDottedList = (List(),this)

  def isKeyword = false
  def isInteger = false
  def isString = true
  def isList = false
  def isPair = false
  def isNull = false
  def isName = false
  def isSymbol = false
}


case class SBoolean(val value : Boolean) extends SExp {
  override def toString = (if (value) { "#t" } else { "#f" })

  def toList = throw new Exception("Cannot convert Boolean to list.")
  def toDottedList = (List(),this)

  def isFalse = value

  def isKeyword = false
  def isInteger = false
  def isString = false
  def isBoolean = true
  def isList = false
  def isPair = false
  def isNull = false
  def isName = false
  def isSymbol = false  
}


case class SKeyword(val string : String) extends SExp with Ordered[SKeyword] {
  override def toString = "#:" + string

  def toList = throw new Exception("Cannot convert keyword to list.")
  def toDottedList = (List(),this)

  def isFalse = false

  def isKeyword = true
  def isInteger = false
  def isString = false
  def isBoolean = false
  def isList = false
  def isPair = false
  def isNull = false
  def isName = false
  def isSymbol = false  

  def compare (that : SKeyword) = this.string compare that.string
}


abstract case class SSymbol (val string : String) extends SExp {
}


final case class SName(s : String, version : Int) extends SSymbol(s) with Ordered[SName] {
  def compare (that : SName) : Int = that match {
    case SName(s2,v2) => {
      val cmpString = s compare s2
      if (cmpString != 0)
        cmpString
      else
        version compare v2
    }
  }

  override def toString = 
    if (version == 0) {
      string
    } else {
      if (SExp.shouldNamesBeSymbols) 
        s + "$" + version
      else
        "#name[" + string + " " + version + "]"
    }

  def toList = throw new Exception("Cannot convert symbol to list.")
  def toDottedList = (List(),this)

  def isKeyword = false
  def isInteger = false
  def isList = false
  def isPair = false
  def isNull = false
  def isSymbol = true
  def isName = true

  override def hashCode : Int = s.hashCode() * 10 + version

  override def equals (a : Any) = a match {
    case SName(s2,v2) => (s equals s2) && (version == v2)
    case _ => false
  }
}

final case class SNil() extends SExp {
  override def toString = "()"

  def toList = List()
  def toDottedList = (List(),this)

  def isKeyword = false
  def isInteger = false
  def isList = true
  def isPair = false
  def isNull = true
  def isName = false
  def isSymbol = false
}

final case class :+:(var car : SExp, var cdr : SExp) extends SExp {
  override def toString = this.toDottedList match {
    case (l,SNil()) => "(" + (l mkString " ") + ")"
    case (l,end) => "(" + ((l mkString " ") + " . " + end) + ")"
  }

  def toList = car :: cdr.toList
  def toDottedList : (List[SExp],SExp) = {
    val (lst,end) = cdr.toDottedList
    return (car :: lst, end)
  }

  def isKeyword = false
  def isInteger = false
  def isList = cdr.isList
  def isPair = true
  def isNull = false
  def isName = false
  def isSymbol = false
}


object SList {
  def apply(sx : SExp*) : SExp = 
    SExp(sx.toList)

  def unapplySeq(sx : SExp) : Option[List[SExp]] = {
    if (sx isList) 
      Some(sx toList)
    else
      None
  }
}



object SKeyword {

  private val keywordTable = scala.collection.mutable.HashMap[String,SKeyword]()

  def from (string : String) : SKeyword = {
    (keywordTable get string) match {
      case Some(kw) => kw
      case None => {
        val kw = SKeyword(string)
        keywordTable(string) = kw
        kw
      }
    }
  }
}


object SName {

  private val nameTable = scala.collection.mutable.HashMap[String,SName]()
  private val maxTable = scala.collection.mutable.HashMap[String,SName]()

  def from (string : String) : SName = {
    (nameTable get string) match {
      case Some(name) => name
      case None => {
        val name = SName(string,0)
        nameTable(string) = name
        name
      }
    }
  }

  def from (symbol : SSymbol) : SName = {
    from(symbol.string)
  }

  def gensym(string : String) : SName = {
    (maxTable get string) match {
      case Some(SName(_,v)) => {
        val name = SName(string,v+1)
        maxTable(string) = name
        name
      }
      case None => {
        val name = SName(string,1)
        maxTable(string) = name
        name        
      }
    }
  }

  def gensym(symbol : SSymbol) : SName = {
    gensym(symbol.string)
  }
}






object SXMain {


  def runTest1() {
    val chars = LiveStream("(define   (inc   x)   (+\n\n x ;a sntaoheusah\n #! #! aoeuaoeu !# !# 1)) (inc 3)")

    println("chars: " + chars) ;

    val lexer = new SXLexer

    lexer.lex(chars)

    println("tokens: " + lexer.output) ;
    
    println("parse:")
    
    val ast = SXParser.SX.parse(lexer.output)

    println(ast) 
  }



  def runTest2 () {
    
    val S = SXParser.SX.compile

    val core = List(
      PunctToken("(")
      ,
      PunctToken("(")
      ,
      PunctToken(")")
      ,
      PunctToken(")")
    )

    var input = core
    
    var rounds = 10 ;

    while (rounds > 0) {
      input = input ++ input;
      rounds -= 1 ;
    }
    
    input = PunctToken("(") :: (input ++ List(PunctToken(")")))

    println("input.length = " + input.length) ;

    val source : LiveStreamSource[Token] = new LiveStreamSource()

    source ++= input ;

    val stream = new LiveStream(source)

    val pm = new ParsingMachine(S, stream)
    
    println ("parse string generated!") ;

    println(pm.output.head) ;

    println(pm.output.head.reduce()) ;

    println("input.length = " + input.length) ;
    
    ()
  }

  def main(args : Array[String]) {
    args match {
      case Array("--test1") => {
        runTest1() 
        return
      }

      case Array("--tests") => {
        runTest1() 
        runTest2()
        return
      }

      case Array() => {
      }
    }
  }
  

}
