module.exports = (input) => {
  var index = 0;

  const NUMBER = "NUM";
  const STRING_LITERAL = "STL";
  const IDENTIFIER = "IDE";
  const ARITHMETIC_OPERATOR = "OPA";
  const RELATIONAL_OPERATOR = "OPR";
  const LOGICAL_OPERATOR = "OPL";
  const DELIMITER = "DEL";
  const RESERVED_WORD = "RES";
  const BOOL_LITERAL = "BOL"

  const input = [{
      value: "if",
      class: "RES"
    },
    {
      value: "(",
      class: "DEL"
    },
    {
      value: "x",
      class: "IDE"
    },
    {
      value: "==",
      class: "ROP"
    },
    {
      value: "1",
      class: "NUM"
    },
    {
      value: ")",
      class: "DEL"
    },
    {
      value: "{",
      class: "DEL"
    },
    {
      value: "x",
      class: "IDE"
    },
    {
      value: "++",
      class: "OPA"
    },
    {
      value: ";",
      class: "DEL"
    },
    {
      value: "}",
      class: "DEL"
    },
  ];

  var errorLog = [];

  function actualToken() {
    return input[index].value;
  }

  function actualType() {
    return input[index].class;
  }

  function actualLine() {
    return input[index].line;
  }

  function nextToken() {
    index++;
  }

  function peekNext(ammount) {
    return ammount ? input[index + ammount] : input[index + 1]
  }

  function handleError(token, line, message) {
    let errorData = "Erro. Linha: " + line + ", Token Lido: " + token + ", Mensagem: " + message;
    errorLog.push(errorData)
  }

  function receiveStart() {
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
        handleError(actualToken(), actualLine(), errorMessage)
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
        receiveConstBody();
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
        receiveConstBody();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(actualToken(), actualLine(), errorMessage)
        receiveConstBody();
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
          handleError(actualToken(), actualLine(), errorMessage);
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

  function receiveNegateExpession() {
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
        handleError(actualToken(), actualLine(), errorMessage);
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
      handleError(actualToken(), actualLine(), errorMessage);
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
        handleError(actualToken(), actualLine(), errorMessage);
        nextToken();
        return;
      }
    } else {
      return;
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
      receiveReadStatement();
      nextToken();
      return;
    } else if (actualToken() == "write") {
      receiveWriteStatement();
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

  return {
    receiveStart
  }
}