module.exports = (input) => {
  var index = 0;

  const NUMBER = "NUMBER";
  const STRING_LITERAL = "STRING_LITERAL";
  const IDENTIFIER = "IDENTIFIER";
  const ARITHMETIC_OPERATOR = "ARITHMETIC_OPERATION";
  const RELATIONAL_OPERATOR = "RELATIONAL_OPERATION";
  const LOGICAL_OPERATOR = "LOGIC_OPERATION";
  const DELIMITER = "DELIMITER";
  const RESERVED_WORD = "RESERVED_WORD";
  const BOOL_LITERAL = "BOOLEAN_LITERAL"

  var errorLog = [];

  function actualToken() {
    console.log(input[index].value)
    return input[index].value;
  }

  function actualType() {
    console.log(input[index].class)
    return input[index].class;
  }

  function actualLine() {
    return input[index].line;
  }

  function nextToken() {
    index++;
    console.log("next ", index);
  }

  function peekNext(ammount) {
    return ammount ? input[index + ammount] : input[index + 1]
  }

  function handleError(message) {
    let errorData = "Erro. Linha: " + actualLine() + ", Token Lido: " + actualToken() + ", Mensagem: " + message;
    console.log(errorData);
    errorLog.push(errorData);
  }

  function receiveStart() {
    console.log("Start Syntax")
    receiveProgram();
    return errorLog;
  }

  function receiveProgram() {
    receiveConsts();
    receiveClasses();
    receiveMain();
  }

  function receiveConsts() {
    if (actualToken() == "const") {
      nextToken();
      if (actualToken() == "{") {
        nextToken();
        receiveConstBody();
        if (actualToken() == "}") {
          return;
        }
      }
    } else {
      let errorMessage = "Não foi possível encontrar declaração de constantes";

    }
  }

  function receiveConstBody() {
    if (actualToken() == "}") {
      return;
    } else {
      receiveType();
      nextToken();
      receiveConstAssignmentList();
      if (actualToken() == ";") {
        receiveConstBody();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(errorMessage);
        receiveConstBody();
      }
    }
  }

  function receiveConstAssignmentList() {
    receiveGeneralIdentifier();
    if (actualToken() == "=") {
      nextToken();
      receiveVectorDeclaration();
      nextToken();
      if (actualToken() == ",") {
        nextToken();
        receiveConstAssignmentList();
      }
      return;
    }
  }

  function receiveVariables() {
    if (actualToken() == "variables") {
      nextToken();
      if (actualToken() == "{") {
        nextToken();
        receiveVariablesBody();
        if (actualToken() == "}") {
          return;
        }
      }
    }
  }

  function receiveVariablesBody() {
    if (actualToken() == "}") {
      return;
    } else {
      receiveType();
      nextToken();
      receiveVariablesAssignmentList();
      if (actualToken() == ";") {
        receiveVariablesBody();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(errorMessage);
        receiveVariablesBody();
      }
    }
  }

  function receiveVariablesAssignmentList() {
    receiveGeneralIdentifierList();
    if (actualToken() == "=") {
      nextToken();
      receiveVectorDeclaration();
      nextToken();
      if (actualToken() == ",") {
        nextToken();
        receiveVariablesAssignmentList();
      }
      return;
    } else {
      nextToken();
      receiveVariablesAssignmentList();
      return;
    }
  }

  function receiveClasses() {
    if (actualToken() == "class") {
      nextToken();
      if (actualType() == IDENTIFIER) {
        nextToken();
        receiveExtends();
        if (actualToken() == "{") {
          nextToken();
          receiveVariables();
          nextToken();
          receiveMethods();
          nextToken();
          if (actualToken() == "}") {
            receiveClasses();
            return;
          }
        }
      }
    }
  }

  function receiveExtends() {
    if (actualToken() == "extends") {
      nextToken();
      if (actualType() == IDENTIFIER) {
        nextToken();
        return;
      }
    }
  }

  function receiveMain() {
    if (actualToken() == "main") {
      nextToken();
      if (actualToken() == "{") {
        nextToken();
        receiveVariables();
        receiveStatements();
        if (actualToken() == "}") {
          return;
        }
      } else {
        let errorMessage = "Esperava encontrar { . Encontrou " + actualToken();
        handleError(errorMessage);
        nextToken();
        return;
      }
    }
  }

  function receiveMethods() {
    if (actualToken() == "method") {
      nextToken();
      receiveType();
      nextToken();
      if (actualType() == IDENTIFIER) {
        nextToken();
        receiveMethodParams();
        receiveFunctionBody();
        receiveMethods();
        return;
      }
    }
  }

  function receiveMethodParams() {
    if (actualToken() == "(") {
      nextToken();
      receiveMethodArgList();
      if (actualToken() == ")") {
        return;
      } else {
        let errorMessage = "Não foi encontrado o fechamento da lista de parâmetros da função";
        handleError(errorMessage);
        nextToken();
      }
    } else {
      return;
    }
  }

  function receiveMethodArgList() {
    receiveType();
    nextToken();
    receiveBaseValue();
    if (actualToken() == ",") {
      nextToken();
      receiveMethodArgList();
    }
    return;
  }

  function receiveFunctionBody() {
    if (actualToken() == "{") {
      nextToken();
      receiveVariables();
      receiveStatements();
      receiveReturn();
      if (actualToken() == ";") {
        nextToken();
        if (actualToken() == "}") {
          nextToken();
          return;
        }
      }
    }
  }

  function receiveReturn() {
    if (actualToken() == "return") {
      nextToken();
      receiveExpression();
      return;
    }
  }

  function receiveIfStatement() {
    if (actualToken() == "if") {
      nextToken();
      if (actualToken() == "(") {
        nextToken();
        receiveExpression();
        if (actualToken() == ")") {
          nextToken();
          if (actualToken() == "{") {
            nextToken();
            receiveStatements();
            if (actualToken() == "}") {
              receiveElseIfStatement();
              receiveElseStatement();
              return;
            }
          }
        }
      }
    }
  }

  function receiveElseIfStatement() {
    if (actualToken() == "else") {
      nextToken();
      if (actualToken() == "if") {
        nextToken();
        if (actualToken() == "(") {
          nextToken();
          receiveExpression();
          if (actualToken() == ")") {
            nextToken();
            if (actualToken() == "{") {
              nextToken();
              receiveStatements();
              if (actualToken() == "}") {
                nextToken();
                if (actualToken() == "else") {
                  nextToken();
                  if (actualToken() == "if") {
                    receiveElseIfStatement();
                  }
                }
                return;
              }
            }
          }
        }
      }
    }
  }

  function receiveElseStatement() {
    if (actualToken() == "else") {
      nextToken();
      if (actualToken() == "{") {
        nextToken();
        receiveStatements();
        if (actualToken() == "}") {
          return;
        } else {
          let errorMessage = "Não foi possível encontrar fechamento para o corpo do else";
          handleError(errorMessage);
          nextToken();
          return;
        }
      }
    }
  }

  function receiveWhileStatement() {
    if (actualToken() == "while") {
      nextToken();
      if (actualToken() == "(") {
        nextToken();
        receiveExpression();
        if (actualToken() == ")") {
          nextToken();
          if (actualToken() == "{") {
            nextToken();
            receiveStatements();
            if (actualToken() == "}") {
              return;
            }
          }
        }
      }
    }
  }

  function receiveWrite() {
    if (actualToken() == "write") {
      nextToken();
      if (actualToken() == "(") {
        nextToken();
        receiveArgList();
        if (actualToken() == ")") {
          return;
        }
      }
    }
  }

  function receiveRead() {
    if (actualToken() == "read") {
      nextToken();
      if (actualToken() == "(") {
        nextToken();
        receiveGeneralIdentifierList();
        if (actual() == ")") {
          return;
        }
      }
    }
  }

  function receiveType() {
    if (actualToken() == "int" || actualToken() == "float" || actualToken() == "string" || actualToken() == "bool" || actualType() == IDENTIFIER) {
      return;
    } else {
      let errorMessage = "Tipo de variável não reconhecido";
      handleError(errorMessage);
      return;
    }
  }

  function receiveExpression() {
    receiveAddExpression();
    if (actualType == RELATIONAL_OPERATOR || actualType == LOGICAL_OPERATOR) {
      nextToken();
      receiveExpression();
      return;
    }
    return;
  }

  function receiveAddExpression() {
    receiveMultExpression();
    if (actualToken == "+" || actualToken == "-") {
      nextToken();
      receiveAddExpression();
      return;
    }
    return;
  }

  function receiveMultExpression() {
    receiveNegateExpression();
    if (actualToken() == "*" || actualToken() == "/") {
      nextToken();
      receiveNegateExpression();
      return;
    }
    return;
  }

  function receiveNegateExpression() {
    if (actualToken() == "-") {
      nextToken();
      receiveValue();
      return;
    } else {
      receiveValue();
      return;
    }
  }

  function receiveValue() {
    if (actualToken() == "(") {
      nextToken();
      receiveExpression();
      if (actualToken() == ")") {
        nextToken();
        return;
      }
    } else if (actualType() == IDENTIFIER) {

    }
  }

  function receiveBaseValue() {
    if (actualType() == BOOL_LITERAL || actualType() == STRING_LITERAL) {
      nextToken();
      return;
    } else {
      receiveNumber();
      return;
    }
  }

  function receiveNumber() {
    if (actualToken() == "++" || actualToken() == "--") {
      nextToken();
      receiveNumberLiteral();
      return;
    } else {
      receiveNumberLiteral();
      if (actualToken() == "++" || actualToken() == "--") {
        nextToken();
        return;
      } else {
        return;
      }
    }
  }

  function receiveNumberLiteral() {
    if (actualType() == NUMBER) {
      nextToken();
      return;
    } else {
      receiveGeneralIdentifier();
      return;
    }
  }

  function receiveGeneralIdentifier() {
    receiveOptionalVector();
    nextToken();
    receiveParams();
    nextToken();
    if (actualToken == ".") {
      nextToken();
      receiveGeneralIdentifier();
      return;
    }
    return;
  }

  function receiveGeneralIdentifierList() {
    receiveGeneralIdentifier();
    if (actualToken() == ",") {
      nextToken();
      receiveGeneralIdentifierList();
    }
    return;
  }

  function receiveParams() {
    if (actualToken() == "(") {
      nextToken();
      receiveArgList();
      if (actualToken() == ")") {
        return;
      } else {
        let errorMessage = "Não foi encontrado o fechamento da lista de parâmetros da função";
        handleError(errorMessage);
        nextToken();
      }
    } else {
      return;
    }
  }

  function receiveArgList() {
    receiveBaseValue();
    if (actualToken() == ",") {
      nextToken();
      receiveArgList();
    }
    return;
  }

  function receiveOptionalVector() {
    if (actualType() == IDENTIFIER) {
      nextToken();
      receiveVectorIndex();
      return;
    } else {
      let errorMessage = "Espera-va receber um Identificador. Recebido " + actualType();
      handleError(errorMessage);
      nextToken();
      return;
    }
  }

  function receiveVectorIndex() {
    if (actualToken() == "[") {
      nextToken();
      receiveExpression();
      nextToken();
      if (actualToken() == "]") {
        nextToken();
        receiveVectorIndex();
        return;
      } else {
        let errorMessage = "O indíce do vetor não foi fechado propriamente";
        handleError(errorMessage);
        nextToken();
        return;
      }
    } else {
      return;
    }
  }

  function receiveVectorDeclaration() {
    if (actualToken() == "[") {
      nextToken();
      receiveVectorDeclaration();
    } else {
      receiveExpression();
    }
    
  }

  function receiveStatements() {
    if (actualToken() == "if") {
      receiveIfStatement();
      nextToken();
      return;
    } else if (actualToken() == "while") {
      receiveWhileStatement();
      nextToken();
      return;
    } else if (actualToken() == "read") {
      receiveRead();
      nextToken();
      return;
    } else if (actualToken() == "write") {
      receiveWrite();
      nextToken();
      return;
    } else if (actualType() == IDENTIFIER) {
      let lookahead = peekNext();
      if (lookahead.value == "=") {
        receiveAssignment();
        return;
      } else {
        receiveExpression();
        return;
      }
    } else if (actualType == STRING_LITERAL || actualType == NUMBER) {
      receiveExpression();
      return;
    } else {
      return;
    }
  }

  function receiveAssignment() {
    receiveGeneralIdentifier();
    if (actualToken() == "=") {
      nextToken();
      receiveExpression();
      return;
    }
  }

  return {
    receiveStart
  }
}