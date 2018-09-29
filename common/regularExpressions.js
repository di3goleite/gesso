const lexical = {
  IDENTIFIER: /^([a-z]|[A-Z]){1}([a-z]|[A-Z]|[0-9]|_)*/,
  RESERVED_WORD: /(^class$|^const$|^variables$|^method$|^return$|^main$|^if$|^then$|^else$|^while$|^read$|^write$|^void$|^int$|^float$|^bool$|^string$|^true$|^false$|^extends$)/,
  NUMBER: /^\-?\s*[0-9]+(\.[0-9]+)?$/,
  ARITHMETIC_OPERATION: /(^\+$|^\-$|^\*$|^\/$|^\+\+$|^\-\-$)/,
  RELATIONAL_OPERATION: /(^\!\=$|^\=\=$|^<$|^<\=$|^>$|^>\=$|^=$)/,
  LOGIC_OPERATION: /(^\!$|^&&$|^\|\|$)/,
  LINE_COMMENT: /^\/\//,
  BLOCK_COMMENT: /^\/\*.+\*\/$/,
  DELIMITER: /(^;$|^,$|^\($|^\)$|^\[$|^\]$|^\{$|^\}$|^\.$)/,
  CHARACTER_SEQUENCE: /^\"([^\"]|\\\")*\"$/
};

const errors = {
  UNDEFINED_LEXEME: /.*/,
  MALFORMED_NUMBER: /^\-?\s*[0-9]+(\.[^0-9]+)$/,
  MALFORMED_SEQUENCE: /^\".*(?<!\")$/,
  MALFORMED_COMMENT: /^\/\*.*(?<!\*\/)$/,
  MALFORMED_IDENTIFIER: /^([a-z]|[A-Z]).*[^(\w|\d|\_)].*/
};

module.exports = { lexical, errors };