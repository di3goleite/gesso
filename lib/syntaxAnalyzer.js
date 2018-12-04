module.exports = (input) => {
  var index = 0;

  const NUMBER = "NUMBER";
  const STRING_LITERAL = "CHARACTER_SEQUENCE";
  const IDENTIFIER = "IDENTIFIER";
  const ARITHMETIC_OPERATOR = "ARITHMETIC_OPERATION";
  const RELATIONAL_OPERATOR = "RELATIONAL_OPERATION";
  const LOGICAL_OPERATOR = "LOGIC_OPERATION";
  const DELIMITER = "DELIMITER";
  const RESERVED_WORD = "RESERVED_WORD";
  const BOOL_LITERAL = "BOOLEAN_LITERAL"

  var errorLog = [];

  function actualToken() {
    console.log("actual token - " + input[index].value)
    return input[index].value;
  }

  function actualType() {
    console.log("Actual Type - " + input[index].class)
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

  function handleError(message) {
    let errorData = "Erro. Linha: " + actualLine() + ", Token Lido: " + actualToken() + ", Mensagem: " + message;
    console.log(errorData);
    errorLog.push(errorData);
  }

  function recovery(token, type) {
    if (type) {
      while (actualType() !== type) {
        nextToken();
      }
    } else {
      while (actualToken() !== token) {
        nextToken();
      }
    }
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
          nextToken();
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
        nextToken();
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
          nextToken();
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
        nextToken();
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
      if (actualToken() == ",") {
        nextToken();
        receiveVariablesAssignmentList();
      }
      return;
    } else {
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
          if (actualToken() == "}") {
            nextToken();
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
    } else {
      let errorMessage = "Não foi possível encontrar a declaração da função main";
      handleError(errorMessage);
      nextToken();
      return;
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
      } else {
        let errorMessage = "Assinatura do método inválida";
        handleError(errorMessage);
        recovery("{");
        receiveFunctionBody();
        receiveMethods();
      }
      nextToken();
    }
  }

  function receiveMethodParams() {
    if (actualToken() == "(") {
      nextToken();
      receiveMethodArgList();
      if (actualToken() == ")") {
        nextToken();
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
    if (actualToken() != ")") {
      receiveType();
      nextToken();
      receiveBaseValue();
      if (actualToken() == ",") {
        nextToken();
        receiveMethodArgList();
      }
      return;
    } else {
      return;
    }
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
              nextToken();
              if (actualToken() == "else") {
                receiveElseIfStatement();
                receiveElseStatement();
              }
              return;
            }
          }
        }
      }
    }
  }

  function receiveElseIfStatement() {
    if (actualToken() == "else" && peekNext().value == "if") {
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
                  if (peekNext(1).value == "if") {
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
          nextToken();
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
        if (actualToken() == ")") {
          return;
        }
      }
    }
  }

  function receiveType() {
    if (actualToken() == "int" || actualToken() == "float" || actualToken() == "string" || actualToken() == "bool" || actualToken() == "void" || actualType() == IDENTIFIER) {
      return;
    } else {
      let errorMessage = "Tipo de variável não reconhecido";
      handleError(errorMessage);
      return;
    }
  }

  function receiveExpression() {
    receiveAddExpression();
    if (actualType() == RELATIONAL_OPERATOR || actualType() == LOGICAL_OPERATOR) {
      nextToken();
      receiveExpression();
      return;
    }
    return;
  }

  function receiveAddExpression() {
    receiveMultExpression();
    if (actualToken() == "+" || actualToken() == "-") {
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
    } else {
      receiveBaseValue();
      return;
    }
  }

  function receiveBaseValue() {
    if (actualType() == STRING_LITERAL || actualToken() == "void" || actualToken() == "true" || actualToken() == "false") {
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
    receiveParams();
    if (actualToken() == ".") {
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
        nextToken();
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
    if (actualToken() == ")") {
      return;
    } else {
      receiveBaseValue();
      if (actualToken() == ",") {
        nextToken();
        receiveArgList();
      }
      return;
    }
  }

  function receiveOptionalVector() {
    if (actualType() == IDENTIFIER) {
      nextToken();
      receiveVectorIndex();
      return;
    } else {
      let errorMessage = "Recebido tipo não esperado: " + actualType();
      handleError(errorMessage);
      recovery(";");
      return;
    }
  }

  function receiveVectorIndex() {
    if (actualToken() == "[") {
      nextToken();
      console.log("conteudo do array", actualToken())
      receiveExpression();
      console.log("fim do conteudo", actualToken())
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
      return;
    } else {
      receiveExpression();
      return;
    }

  }

  function receiveStatements() {
    if (actualToken() == "if") {
      receiveIfStatement();
      receiveStatements();
      return;
    } else if (actualToken() == "while") {
      receiveWhileStatement();
      nextToken();
      receiveStatements();
      return;
    } else if (actualToken() == "read") {
      receiveRead();
      nextToken();
      if (actualToken() == ";") {
        nextToken();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(errorMessage);
      }
      receiveStatements();
      return;
    } else if (actualToken() == "write") {
      receiveWrite();
      nextToken();
      if (actualToken() == ";") {
        nextToken();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(errorMessage);
      }
      receiveStatements();
      return;
    } else if (actualType() == IDENTIFIER) {
      let lookahead = peekNext();
      if (lookahead.value == "=") {
        receiveAssignment();
        if (actualToken() == ";") {
          nextToken();
        } else {
          let errorMessage = "Faltando ponto-vírgula";
          handleError(errorMessage);
        }
        receiveStatements();
        return;
      } else {
        receiveExpression();
        if (actualToken() == ";") {
          nextToken();
        } else {
          let errorMessage = "Faltando ponto-vírgula";
          handleError(errorMessage);
        }
        receiveStatements();
        return;
      }
    } else if (actualType() == STRING_LITERAL || actualType() == NUMBER) {
      receiveExpression();
      if (actualToken() == ";") {
        nextToken();
      } else {
        let errorMessage = "Faltando ponto-vírgula";
        handleError(errorMessage);
      }
      receiveStatements();
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