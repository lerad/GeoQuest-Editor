
function Lexer() {


    this.getToken = function(string) {
        this.string = string;
        this.position = 0;
        var token = [];
        var next = this.getNextToken()
        while(next != null) {
            token.push(next);
            next = this.getNextToken();
        }
        return token;
    }

    this.getNextToken = function() {

        while(this.peekChar() == ' ') this.readChar(); // Skip whitespaces

        var currentChar = this.readChar();
        switch(currentChar) {
            case null: 
                return null
            case '(':
                return this.createToken(TokenType.BracketOpen, "(");
            case ')':
                return this.createToken(TokenType.BracketClose, ")");
            case ',':
                return this.createToken(TokenType.Comma, ",");
            case '=':
                return this.createToken(TokenType.Equal, "=");
            case '<':
                if(this.peekChar() == '=') {
                    this.readChar();
                    return this.createToken(TokenType.LesserEqual, "<=");
                }
                else 
                    return this.createToken(TokenType.Lesser, "<");
            case '>':
                if(this.peekChar() == '=') {
                    this.readChar();
                    return this.createToken(TokenType.GreaterEqual, ">=");
                }
                else 
                    return this.createToken(TokenType.Greater, ">");
            case '0': case '1': case '2':
            case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                return this.readNumber( new String(currentChar) );
            default:
                return this.readString( new String(currentChar) )
                
        
        }
    }
    
    this.peekChar = function() {
        if(this.position  >= this.string.length) 
            return null;
        else
            return this.string[this.position];
    }

    this.readChar = function() {
        if(this.position >= this.string.length) 
            return null;
        else
            var myChar = this.string[this.position];
            this.position++;
            return myChar; 
    }

    this.createToken = function(type, string) {
        return {
            "type" : type,
            "string" : string
        }
    }

    this.readNumber = function(currentString) {
        var numeric = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
        while (numeric.indexOf( this.peekChar() ) != -1) {
            currentString += this.readChar();
        }
        if(this.peekChar() != '.') {
            return this.createToken(TokenType._Number, currentString);
        }
        currentString += this.readChar(); // Read the '.'
        while (numeric.indexOf( this.peekChar() ) != -1) {
            currentString += this.readChar();
        }
        return this.createToken(TokenType._Number, currentString);
    }


    this.readString = function(currentString) {
        var validStartChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
        var validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
        if(validStartChars.indexOf(currentString[0]) == -1) {
            alert("String may not start with '" + currentString[0] + "'");
        }        
        
        while(validChars.indexOf(this.peekChar()) != -1) {
            currentString += this.readChar();
        }

        var lowerCaseString = currentString.toLowerCase();

        if(lowerCaseString == "and") return this.createToken(TokenType.And, currentString);
        if(lowerCaseString == "or") return this.createToken(TokenType.Or, currentString);
        if(lowerCaseString == "isfailed") return this.createToken(TokenType.IsFailed, currentString);
        if(lowerCaseString == "issuccess") return this.createToken(TokenType.IsSuccess, currentString);
        if(lowerCaseString == "isnew") return this.createToken(TokenType.IsNew, currentString);
        if(lowerCaseString == "isrunning") return this.createToken(TokenType.IsRunning, currentString);
        if(lowerCaseString == "true") return this.createToken(TokenType._True, currentString);
        if(lowerCaseString == "not") return this.createToken(TokenType.Not, currentString);

        return this.createToken(TokenType.Variable, currentString);
    }

}
TokenType = {
    BracketOpen : 0,
    BracketClose : 1,
    And : 2,
    Or : 3,
    IsFailed : 5,
    IsSuccess : 6,
    IsNew : 7,
    IsRunning : 8,
    Variable : 9,
    Greater : 10,
    Lesser : 11,
    GreaterEqual : 12,
    LesserEqual : 13,
    Equal : 14,
    _Number : 15,
    Comma : 16,
    _True : 17,
    Not : 18

}
