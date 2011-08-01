function Parser() {

    this.parse = function(tokenArray) {
        // Recursive remove all brackets:

        var parserArray = this.toParserArray(tokenArray);
        
        parserArray = this.parseStatus(parserArray);
        
        var condition  = this.parseCondition(parserArray);
         
        return this.toAjaxTree(condition);
    }

    this.parseStatus = function(parserArray) {
        var position = 0;
        while(position < parserArray.length) {
            var states = [TokenType.IsFailed, TokenType.IsSuccess, TokenType.IsRunning, TokenType.IsNew ];
            if( states.indexOf( parserArray[position].token.type ) != -1) {
                var hasStatusPosition = position;
                parserArray[hasStatusPosition].data = {
                    "mission" : null
                };
                position++;
                if (parserArray[position].token.type != TokenType.BracketOpen) {
                    throw "Expected '(' after Status Query";
                }
                position++;
                if (parserArray[position].token.type != TokenType.Variable) {
                    throw "Expected mission ID as first parameter for HasStatus";
                }
                parserArray[hasStatusPosition].data["mission"] = parserArray[position].token["string"];
                position++;
                if (parserArray[position].token.type != TokenType.BracketClose) {
                    throw "Expected ')' after Status Query";
                }

           
                len = position - hasStatusPosition;
                parserArray.splice(hasStatusPosition +1, len);
                position = hasStatusPosition + 1;

            }
            else
                position++;
            
        }
        return parserArray;
    }

    this.parseCondition = function( parserArray) {

        if(parserArray.length == 1) return parserArray[0];

        // Check for brackets:
        var i = 0;
        while( i < parserArray.length ) {
            if(parserArray[i].token.type == TokenType.BracketOpen) {
                // Find corresponding close Bracket:
                var hierarchy = 0;
                var startBracket = i;
                var pos = i+1;
                
                if(pos >=  parserArray.length) {
                    throw "Cannot find corresponding ')' bracket";
                }
                while (!((hierarchy == 0) && (parserArray[pos].token.type == TokenType.BracketClose))) {
                    
                    if(parserArray[pos].token.type == TokenType.BracketOpen) hierarchy++;
                    if(parserArray[pos].token.type == TokenType.BracketClose) hierarchy--;

                    pos++;
                    if(pos >= parserArray.length) {
                        throw "Cannot find corresponding ')' bracket to to  " + parserArray[startBracket].token["string"] + parserArray[startBracket+1].token["string"]  ;
                    }


                }
                var endBracket = pos;
                var subArray = $.extend(true, [], parserArray.slice(startBracket + 1, endBracket)); // Deep copy
                var myParseArray = parserArray.toSource();
                var subCondition = this.parseCondition( subArray );
                parserArray.splice(startBracket+1, endBracket - startBracket);
                parserArray[ startBracket ] = subCondition;
                i = startBracket;
            }
            i++;
        }

        if(parserArray.length == 1) return parserArray[0]; //Might happen after the brackets are evaluated


        // Check for NOT's

        i=0; 
        while (i < parserArray.length) {
            if (parserArray[i].token.type == TokenType.Not) {
                if(parserArray[i].children.length > 0) { // Already parsed
                    i++;
                    continue;
                }
                var next = i+1;
                if(next >= parserArray.length) throw "Not shall not be the last element";
                parserArray[i].children = [ parserArray[next] ];
                parserArray.splice(next, 1);
            }
            i++;
        }




        if(parserArray.length == 1) return parserArray[0]; //Might happen after the brackets are evaluated

        // Check for AND's:
        i = 0;
        while (i < parserArray.length ) {
            if(parserArray[i].token.type == TokenType.And) { 
                var conditions = []
                if (i == 0) throw "AND should not be the first entry";
                var start = i-1;
                conditions.push(parserArray[start]);
                while( true ) {
                    i++;
                    if( i >= parserArray.length) throw "AND should not be the last entry";
                    conditions.push(parserArray[i]);
                    i++;
                    if (i >= parserArray.length) break;
                    if (parserArray[i].token.type != TokenType.And) break;
                }
                var end = i;
                parserArray[start] = {
                    token : parserArray[start + 1].token,
                    children : conditions
                };
                parserArray.splice(start+1, end-start);
                i = start + 1;
            }
            i++;
        }

        if(parserArray.length == 1) return parserArray[0]; //Might happen after the brackets are evaluated

        // Check for OR's:
        i = 0;
        while (i < parserArray.length ) {
            if(parserArray[i].token.type == TokenType.Or) { 
                conditions = []
                if (i == 0) throw "OR should not be the first entry";
                start = i-1;
                conditions.push(parserArray[start]);
                while( true ) {
                    i++;
                    if( i >= parserArray.length) throw "OR should not be the last entry";
                    conditions.push(parserArray[i]);
                    i++;
                    if (i >= parserArray.length) break;
                    if (parserArray[i].token.type != TokenType.Or) break;
                }
                end = i;
                parserArray[start] = {
                    token : parserArray[start + 1].token,
                    children : conditions
                };
                parserArray.splice(start+1, end-start);
                i = start + 1;
            }
            i++;
        }


        if (parserArray.length == 1) return parserArray[0];

        // Check for number comparisions:
        var numberComparisions = [TokenType.Lesser, TokenType.Greater, TokenType.Equal, TokenType.LesserEqual, TokenType.GreaterEqual];
        i=0;
        while( i < parserArray.length) {
            if( numberComparisions.indexOf( parserArray[i].token.type ) != -1) {
                var comparisionType = parserArray[i].token.type;
                if ( i == 0) throw "Comparisionelement should not be the first entry";
                start = i -1;
                var elements = [];
                elements.push(parserArray[ start ]);
                while(true) {
                    i++;
                    if (i >= parserArray.length) {
                        throw "Comparisionelement should not be the last entry";
                    }
                    elements.push(parserArray[i]);
                    i++;
                    if (i >= parserArray.length) break;
                    if (parserArray[i].token.type != comparisionType) break;
                }

                end = i;
                parserArray[start] = {
                    token : parserArray[start + 1].token,
                    children : elements
                };
            parserArray.splice(start+1, end-start);
            i = start + 1;
            }
          i++;
        }

        if (parserArray.length == 1) return parserArray[0];
        else {
           throw "Expected parserArray with length 1";
        }
    }


    this.toParserArray = function(tokenArray) {
        var parserArray = [];
        for ( var token in tokenArray) {
            var parserObject = {
                "token" : tokenArray[token],
                "children" : [],
                "data" : {}
            };
            parserArray.push(parserObject);
        
        }
        return parserArray;
    
    }

    // Remove all the parsing stuff
    this.toAjaxTree = function(condition) {

        // This happens if toAjaxTree is called twice for a condition
        // This should not happen, but apparently it does?
        if(!condition.token.type) {
            return condition;
        }
        for(var i = 0; i< condition.children.length; i++) {
            condition.children[i] = this.toAjaxTree(condition.children[i]);
        }


        if (condition.token.type == TokenType.IsFailed) {
            condition.data.state = "fail";
        }
        if (condition.token.type == TokenType.IsSuccess) {
            condition.data.state = "success";
        }
        if (condition.token.type == TokenType.IsNew) {
            condition.data.state = "new";
        }
        if (condition.token.type == TokenType.IsRunning) {
            condition.data.state = "running";
        }
        if (condition.token.type == TokenType.Variable) {
            condition.data.name = condition.token["string"];
        }
        if (condition.token.type == TokenType._Number) {
            condition.data.value = condition.token["string"];
        }
       
        condition.token = TokenName[condition.token.type];        



        return condition;
    }

}

TokenName = [];
TokenName[ TokenType.And ] =  "and";
TokenName[ TokenType.Or ] = "or";
TokenName[ TokenType.IsFailed ] = "missionState";
TokenName[ TokenType.IsSuccess ] =  "missionState";
TokenName[ TokenType.IsNew ] =  "missionState";
TokenName[ TokenType.IsRunning ] = "missionState";
TokenName[ TokenType.Variable ] =  "var";
TokenName[ TokenType.Greater ] =  "gt";
TokenName[ TokenType.Lesser ] = "lt";
TokenName[ TokenType.GreaterEqual ] = "geq";
TokenName[ TokenType.LesserEqual ] = "leq";
TokenName[ TokenType.Equal ] = "eq";
TokenName[ TokenType._Number ] = "num";
TokenName[ TokenType._True ] = "true";
TokenName[ TokenType.Not ] =  "not";

