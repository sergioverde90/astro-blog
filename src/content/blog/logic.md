---
title: 'Discrete Math Study Guide - Logic'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.'
pubDate: 'Jun 19 2024'
heroImage: '/blog-placeholder-1.jpg'
---

# Lógica

### Definición

***Proposición***: es una sentencia que declara un hecho que puede ser verdadero o falso pero no ambas cosas.

### Ejemplo

Todas estas son proposiciones válidas

- *Hoy es martes*
- *2+2=6*
- *Madrid es capital de España*

Las siguientes **no** son proposiciones válidas

- *¿Qué hora es?*
- *x+1 = 2*
- *x+y=z*

La primera no es declarativa, por tanto no es una proposición. Las dos siguientes  no son proposiciones porque, aunque son declarativas pueden ser verdaderas o falsas dependiendo del valor de las variables.

## Lógica preposicional

### Tablas de verdad

**AND** (conjunción)

| $p$  | $q$  | $p \land q$  |
| --- | --- | --- |
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | F |

**OR** (disyunción o OR inclusivo)

| $p$ | $q$ | $p \lor q$ |
| --- | --- | --- |
| T | T | T |
| T | F | T |
| F | T | T |
| F | F | F |

**XOR** (o OR exclusivo)

| $p$  | $q$  | $p \oplus q$ |
| --- | --- | --- |
| T | T | F |
| T | F | T |
| F | T | T |
| F | F | F |

**NAND** ($A\uarr b$): $\neg(p \land q)$

**NOR** ($A\darr B$): $\neg(p \lor q)$

## Lógica condicional

### Definición

Pongamos que $p$ y $q$ son proposiciones. La afirmación condicional $p \implies q$ es la afirmación de “si $p$ entonces $q$”.  En la afirmación condicional $p$ es la **hipótesis** (*o premisa*) y $q$ la **conclusión** (o *consecuencia*).

Nótese que cuando $p$ es falso no podemos decir nada sobre la verdad de $q$.

### Tabla de verdad

| **P** | **Q** | **P $\implies$Q** |
| --- | --- | --- |
| T | T | T |
| T | F | F |
| F | T | T |
| F | F | T |

Pongamos como ejemplo P = estudiar más de 4 horas y Q = aprobar el examen. $P \implies Q$ indicaría si estudias más de 4 horas aprobaras el examen. Vayamos por partes

- Si estudias más de 4 horas y apruebas el examen la afirmación se cumple, **por tanto debe ser cierto**.
- Si estudias más de 4 horas pero no apruebas el examen claramente **hay una violación de al cláusula, por tanto debe ser falso**.
- En caso de que no estudies más de 4 horas pero aún así apruebes el examen **no implica ninguna violación del acuerdo**, ya que aprobaste el examen igualmente, **por tanto debe ser cierto**.
- Lo mismo aplica si no estudiaste más de 4 horas y no aprobaste el examen, **no hay violación de la afirmación por tanto debe ser cierto**.

Existen 3 afirmaciones condicionales relacionadas con los condicionantes lógicos:

- $q \implies p$ : el **converso** de $p \implies q$.
- $\neg q \implies \neg p$  : el **contrapositivo** de $p \implies q$.
- $\neg p \implies \neg q$ : el **inverso** de $p \implies q$.

Cuando dos proposiciones compuestas tienen el mismo valor de verdad se dice que son **equivalentes**. En este caso solo el contrapositivo tiene el mismo valor de verdad, por tanto son equivalentes entre ellas, el resto no lo son. Uno de los errores lógicos más comunes es asumir que el converso o el inverso de una afirmación condicional es equivalente a dicha afirmación.

### Ejemplo

Lista el converso, contrapositivo e inverso de “si está lloviendo el equipo local gana”

- converso: “si el equipo local gana entonces está lloviendo”.
- contrapositivo: “si el equipo local no gana entonces no está lloviendo”.
- inverso: “si no está lloviendo el equipo local no gana”.

## Lógica bicondicional

### Definición

Pongamos que $p$ y $q$ son proposiciones. La afirmación bicondicional $p \iff q$ es la proposición de “$p$ si y solo si $q$”. Las afirmaciones bicondicionales solo son ciertas cuando ambas proposiciones tienen el mismo valor de verdad y son falsas en cualquier otro caso.

### Tabla de verdad

| **P** | **Q** | **P $\iff$Q** |
| --- | --- | --- |
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | T |

## Proposiciones equivalentes

### Definición

Una proposición compuesta es una expresión formada por dos o más proposiciones unidas por uno o varios conectores lógicos.

### Definición

Una proposición compuesta que siempre es cierta, independientemente de los valores que se puedan asignar a las variables, se llama ***tautología* ( $\top$ )**. Una proposición compuesta que siempre es false, independientemente de los valores que se puedan asignar a las variables, se llama ***contradicción* ( $\bot )$**. 

### Definición

Una proposición compuesta es l***ógicamente equivalente*** si $p \iff q$ es una tautología. Se usa la notación $p \equiv q$  para indicar que $p$ y $q$ son lógicamente equivalentes. 

<aside>
💡

El símbolo $\equiv$ no es un conector lógico, ni $p \equiv q$ es una proposición compuesta, es simplemente una afirmación de que $p \iff q$ es una tautología.

</aside>

De entre todas las equivalencias que hay, a continuación se listan aquellas que son imprescindibles conocer.

$p \implies q \medspace \medspace \equiv \medspace \medspace \neg p \lor q$

(logical equivalence)   

$p \implies q \medspace \medspace \equiv \medspace \medspace \neg q \implies \neg p \medspace \medspace \medspace \medspace$

(contrapositive)

$\neg (p \land q) \equiv \neg p \lor \neg q  \medspace \medspace \medspace \medspace$

(De Morgan’s Laws)

$\neg (p \lor q) \equiv \neg p \land \neg q  \medspace \medspace \medspace \medspace$

(De Morgan’s Laws)

$\neg \forall xP(x) \equiv \exists x\neg P(x)  \medspace \medspace \medspace \medspace$

(De Morgan’s Laws)

$\neg \exists xP(x) \equiv \forall x\neg P(x)  \medspace \medspace \medspace \medspace$

(De Morgan’s Laws)

$p \land p \equiv p$ 

(idempotency law)

$p \lor p \equiv p$ 

(idempotency law)

## Satisfability

// TODO: Satisfability what is? [https://en.wikipedia.org/wiki/Satisfiability#:~:text=Propositional satisfiability for classical logic,-Main article%3A Propositional&text=In the case of classical,problems in computational complexity theory](https://en.wikipedia.org/wiki/Satisfiability#:~:text=Propositional%20satisfiability%20for%20classical%20logic,-Main%20article%3A%20Propositional&text=In%20the%20case%20of%20classical,problems%20in%20computational%20complexity%20theory).

## Funcitional completeness

// TODO: (functionally complete) functional completeness what is?? [https://en.wikipedia.org/wiki/Functional_completeness](https://en.wikipedia.org/wiki/Functional_completeness)

https://www.youtube.com/watch?v=KF42CnPR0KI

// TODO: disjuntive normal form (1.3 ex. 42) AND 

https://www.youtube.com/watch?v=KF42CnPR0KI

https://www.youtube.com/watch?v=IPGYPgqVYP0

“A partir de cualquier tabla de verdad se puede formar el conjunto de proposiciones y conectores lógicos que satisfacen dicha tabla de verdad, resultando en un conjunto de proposiciones que cumplen con la forma normal disyuntiva. De la misma forma que, expresando una afirmación en forma normal disyuntiva, siempre podemos sacar la tabla de verdad de dicha afirmación.”

## Cuantificadores y cuantificadores anidados

// TODO: explicar cuantificadores y cuantificafores anidados con especial énfasis en el texto subrayado en el libro que contiene información muy importante como el scope de un cuantificador y el cambio de variable.

## Null quantification and Null quantification rules

https://www.youtube.com/watch?v=DinrKHKYFXY

<aside>
💡

- **Bound variable**: Variable limitada por un cuantificador.  En $\forall xP(x)$ es una variable limitada (bound variable).
- **Free variable**: Variable no limitada por un cuantificador. En $P(x)$, $x$ es una variable libre (free variable) porque no hay ningún cuantificador que la limite.

Siendo $A$ una proposición sin cuantificador que limite la variable $x$ podemos decir que:

- $\forall xA \equiv A$
- $\exists xA \equiv A$
</aside>

Se considera *null quantification* cuando, dada una afirmación que involucra un cuantificador universal o existencial y una o varias proposiciones, la variable de bindeo del cuantificador solo aplica a una de las proposiciones dejando el resto de proposiciones con una variable fuera del scope del cuantificador. Por ejemplo la siguiente expresión:

$$
(\forall x P(x) \lor A)
$$

Donde $A$ es una proposición que no depende de $x$.  En este caso decimos que la relación entre $\forall x$ y $A$ es nula, siendo este un ejemplo de cuantificador nulo o *null quantification*.

Estas reglas son especialmente útiles a la hora de saber distribuir (o no) proposiciones limitadas por cuantificadores. A continuación se detalla el listado de reglas que aplican a los cuantificadores nulos, demostrando posteriormente una de las reglas únicamente, ya que el modo de demostrar la regla es extrapolable al resto.

### Null quantification rules or equivalences

- $(\forall xP (x)) \lor A \equiv \forall x(P(x) \lor A)$
- $(∀xP (x)) ∧ A ≡ ∀x(P (x) ∧ A)$
- $(∃xP (x)) ∨ A ≡ ∃x(P (x) ∨ A)$
- $(∃xP (x)) ∧ A ≡ ∃x(P (x) ∧ A)$
- $∀x(A → P (x)) ≡ A → ∀xP (x)$
- $∀x(P (x) → A) ≡ ∃xP (x) → A$
- $∃x(A → P (x)) ≡ A → ∃xP (x)$
- $∃x(P (x) → A) ≡ ∀xP (x) → A$

Las siguientes equivalencias **no se mantienen** y se listan por ser especialmente susceptibles de error:

- $∀xP (x) ∨ ∀xQ(x) \not\equiv ∀x(P (x) ∨ Q(x))$
- $∃xP (x) ∧ ∃xQ(x) \not\equiv ∃x(P (x) ∧ Q(x))$

// TODO: hacer todos los ejercicios subrayados en amarillo y subirlos a github

# Reglas de inferencia

Las reglas de inferencia son un conjunto de **argumentos** **válidos** en bloque y que asumimos como ciertos para llegar a una conclusión con objeto de demostrar algo.

Un **argumento** es una secuencia de proposiciones. Cada una de las proposiciones, a excepción de la última, se les llama **premisas** y a la última se le llama **conclusión**. Un argumento se dice que es **válido** si y solo sí la verdad de todas las premisas implican que la conclusión cierta, es decir, $P_1 \land P_2 \land...P_n \implies C$  es una tautología (donde $P_n$  son premisas y $C$  la conclusión).

Las reglas de inferencia se basan en tautologías, de tal forma que al anidar dichas reglas podamos ir simplificando las premisas para llegar a la conclusión. 

// TODO: resolution rule of inference.

https://www.youtube.com/watch?v=SjEQNOV5FMk

## Resolution

https://youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3&si=eWkPeEc9QLSV7eId

https://youtu.be/ikpJqINGPX4?si=ZGaFd2d-qSzN_1aY

### **Definition**

A **clause** is a disjunction of variables or negations of these variables.

### How to prove if an argument is a valid argument?

Consider an argument with premises $P_1, P_2,P_3...P_n$ and conclusion $C$. To prove that the argument is valid, put all premises in clause form and add $\neg C$ to it. Remember that a clause form is a disjunction of a literal and a literal es a variable or a negation of a variable. If logically the sequence of logic ends up in an empty clause then the argument is valid. Let use the modus ponens rule as example:

$p \\ p \implies q \\---- \\
∴ q$

In clause form

$C_1: p \\ C_2: \neg p \lor q$

Take the negation of the conclusion

$C_3: \neg q$

All together

$C_1: p \\ C_2: \neg p \lor q \\ C_3: \neg q \\ C_4: q \medspace (\text{\scriptsize by resolution C1, C2}) \\ C_5: \Box \medspace (\text{\scriptsize by resolution C3, C4})$ 

Because the $C_5$  is an empty clause, the argument is valid.