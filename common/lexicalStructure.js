const categories = {
  RESERVED_WORDS: ['class', 'const', 'variables', 'method', 'return', 'main', 'if', 'then', 'else', 'while', 'read', 'write', 'void', 'int', 'float', 'bool', 'string', 'true', 'false', 'extends'],
  ARITHMETIC_OPERATORS: ['\\+', '\\-', '\\*', '\\/', '\\+\\+', '\\-\\-'],
  RELATIONAL_OPERATORS: ['!=', '==', '<', '<=', '>', '>=', '='],
  LOGIC_OPERATORS: ['\\!', '\\&\\&', '\\|\\|'],
  DELIMITERS: ['\;', '\,', '\\(', '\\)', '\\[', '\\]', '\\{', '\\}', '\\.']
};

module.exports = { categories };