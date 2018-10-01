# [EXA869] MI - PROCESSADORES DE LINGUAGEM DE PROGRAMAÇÃO
Frontend de compilador feito em Node JS. Time: **Bruno Lima** e **Diego Leite**

## Instruções
1. Faça o download da versão mais recente do [Node JS](https://nodejs.org/en/download/)
2. Abra o terminal e navegue até a pasta do projeto
3. Execute o software através do comando: `node index.js`

## Glossário

Tabela de Lexemas:
| Sigla | Significado           |
|-------|----------------------|
| PRE   | RESERVED_WORD        |
| IDE   | IDENTIFIER           |
| NRO   | NUMBER               |
| DEL   | DELIMITER            |
| ART   | ARITHMETIC_OPERATION |
| REL   | RELATIONAL_OPERATION |
| LOG   | LOGIC_OPERATION      |
| CdC   | CHARACTER_SEQUENCE   |

Tabela de Erros:
| Sigla | Significado           |
|-------|----------------------|
| NUL   | UNDEFINED_LEXEME     |
| NMF   | MALFORMED_NUMBER     |
| CMF   | MALFORMED_SEQUENCE   |
| CoMF  | MALFORMED_COMMENT    |
| IMF   | MALFORMED_IDENTIFIER |

## Parte 1 - Análise Léxica
Input:
```
/* This is
   a block
   comment
*/
method(hue) {
  int br = -      2.0;
  float test = 1 - 2;

  write("hellooooooooooooo");
  write("world!!!hue");

  // This is a line comment
  if (hue != 1 && br >= 3 || test == 1) {
    return hue;
  } else {
    return br;
  }
}
/* This is
   a block
   comment
```

Output:
```
05	PRE	method
05	DEL	(
05	IDE	hue
05	DEL	)
05	DEL	{
06	PRE	int
06	IDE	br
06	REL	=
06	NRO	-      2.0
06	DEL	;
07	PRE	float
07	IDE	test
07	REL	=
07	NRO	1
07	ART	-
07	NRO	 2
07	DEL	;
09	PRE	write
09	DEL	(
09	CdC	"hellooooooooooooo"
09	DEL	)
09	DEL	;
10	PRE	write
10	DEL	(
10	CdC	"world!!!hue"
10	DEL	)
10	DEL	;
13	PRE	if
13	DEL	(
13	IDE	hue
13	REL	!=
13	NRO	1
13	LOG	&&
13	IDE	br
13	REL	>=
13	NRO	3
13	LOG	||
13	IDE	test
13	REL	==
13	NRO	1
13	DEL	)
13	DEL	{
14	PRE	return
14	IDE	hue
14	DEL	;
15	DEL	}
15	PRE	else
15	DEL	{
16	PRE	return
16	IDE	br
16	DEL	;
17	DEL	}
18	DEL	}

Arquivo analisado com falhas. Total de erros: 1.
19	CoMF	/* This is
   a block
   comment
```