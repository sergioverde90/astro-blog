---
title: 'Algoritmos II - análisis de bucles'
description: 'En esta segunda entrada veremos cómo analizar los costes asintóticos de la estructura de nuestro código para poder sacar las expresiones necesarias y así poder analizarlo. Veremos cómo analizar bucles `for` y `while`, tanto de forma aislada como de forma conjunta, bucles anidados y, en defitiva, casos que comúnmente podemos encontrarnos a la hora de analizar código. También daremos algunos trucos que pueden ser interesantes a la hora de analizar y aplicaremos todo esto sobre un caso real.'
pubDate: 'Apr 15 2025'
draft: false
---

# Introducción 

Anteriormente, ya vimos y entendimos cómo categorizar los costes de nuestro código usando para ello <a href="/blog/algorithms-analysis">análisis asintótico</a>. Y eso está genial pero, **¿cómo se extraen dichos costes?** ¿Qué técnicas tenemos a nuestra disposición para ello? La primera vez que empecé a profundizar en este tema me di cuenta que **la mayoría de los libros y recursos ya parten de un análisis implícito**, dejando un hueco bastante importante sin cerrar. A lo largo del tiempo, y tras mucha investigación, me doy cuenta de que **hay muy poca literatura** hablando sobre **cómo extraer dichas expresiones**, cómo analizar las estructuras de nuestro código para sacar esa información y categorizarla. Mi idea con este segundo post es arrojar algo de luz sobre este tema y sentar bien las bases aunque, como veremos, tendremos que "ensuciarnos la manos".

En esta segunda entrada veremos cómo analizar bucles `for` y `while`, tanto de forma aislada como de forma conjunta, bucles anidados, etc. Mi idea es **ver casos que comúnmente podemos encontrarnos a la hora de analizar código**, algo cercano a la realidad. También daremos algunos trucos que pueden ser interesantes y aplicaremos todo esto sobre algoritmos conocidos.

# Bucles `for`

<blockquote class="ykt">

El análisis de bucles `for` *(a excepción, quizás, de los más elementales)* se analizan de forma sistemática usando **sumatorias**. A continuación veremos varios ejemplos de uso de esta técnica de análisis.

</blockquote>

Arrancamos con el análisis del tipo de bucle que más a ver en nuestro día a día: los bucles `for`. Para ello vamos a analizarlo en su **versión larga**. Normalmente, un bucle `for` suele seguir esta estructura:

```java
for (int i = 0; i < arr.length; i++) {
    // aquí se suele operar con el i-ésimo elemento de la lista 
}
```

Mencionar que definir un bucle de esta forma consta de tres partes: 

1. `int i = 0` donde, comúnmente, se inicializa la variable con la que recorreremos la lista de elementos. Solo se ejecuta una única vez la primera vez que arranca el bucle.
2. `i < arr.length` que se ejecuta tantas veces como la condición se cumpla *(en realidad se ejecuta una vez más, cuando la condición deja de cumplirse)*
3. `i++` condición que se ejecuta tantas veces como la condición se cumpla y que nos sirve para indicar cómo cambia el índice en cada iteración.

Esta es la **forma más básica**, pero muchas veces podemos encontrarnos casos más exóticos al definir un bucle, normalmente en los puntos 1 y 3 a la hora de inicializar y cambiar los valores del índice, ya que el índice podría inicializarse con el valor de otra variable *(como ocurre a menudo en los bucles anidados)* o que el índice `i` no incremente sino que decremente, o se divida, etc. Hay muchas combinaciones posibles y veremos algunas de ellas, empezando por la más simple de todas y viendo casos más complejos poco a poco.

## Análisis de un bucle `for` simple

Venga empecemos. Partamos del siguiente ejemplo:

```java
for (int i = 0; i < arr.length; i++) {
    console.log("i = " + i);
}
```

Asumimos que **el cuerpo del bucle**, en este caso una instrucción simple como sacar el valor de `i` por consola, es **constante**. Llamemos a esa constante $c_4$ por el momento. 

Como hemos visto, el bucle consta de tres partes. Analicemos el coste de cada una de forma independiente:

1. `int i = 0`: inicialización de una variable. Como hemos visto, el coste computacional de esta operación es **constante**, digamos $c_1$, y solo se ejecuta una vez.

2. `i < arr.length`: **condición de parada**. Esta condición **depende del tamaño del array**. Bauticemos como $n$ a dicho tamaño. Una comparación entre dos valores es algo que también tiene coste constante, $c_2$, **pero que evaluamos $n + 1$  veces** *(las $n$ primeras veces será `true` y la $n + 1$ vez será `false`, saliendo así del bucle)*. Tenemos pues $c_2 \cdot (n + 1)$.

3. `i++`: equivalente a `i = i + 1`, que es la asignación de una variable que se ejecuta $n$ veces y que tiene coste constante $c_3$, resultando en $c_3 \cdot n$

```java
for (
    int i = 0;       /* c_1 */ 
    i < arr.length;  /* c_2(n + 1) */ 
    i++              /* c_3(n) */ 
) {
    console.log("i = " + i); /* c_4 */
}
```

Pensemos un poco. Tenemos que la declaración del bucle, la "parte externa", tiene un coste de $c_1 +  c_2(n + 1) + c_3n$, y por cada iteración, se ejecuta el cuerpo del bucle, "la parte interna", con coste constante $c_4$. Esto resulta en la expresión $(c_1 +  c_2(n + 1) + c_3n) \cdot c_4$. Veámos **dos perspectivas** desde la que analizar esto.

### The _"hard" way_

Si nos fijamos bien nos ha quedado una expresión no muy complicada, pero aún tenemos que trabajarla un poco. Vamos a distribuir y a agrupar algunos términos:

$$
    (c_1 +  c_2(n + 1) + c_3n) \cdot c_4 \\
    = c_4c_1 + c_4c_2(n+1) + c_4c_3n \\
    = c_4c_1 + c_4c_2 + c_4c_2n + c_4c_3n \\
    = c_4c_1 + c_4c_2 + (c_4c_2 + c_4c_3)n
$$

Si agrupamos constantes y acomodamos un par de nuevas variables, de tal forma que $a = c_4c_1 + c_4c_2$ y $b = c_4c_2 + c_4c_3$, tenemos que la expresión anterior es una **función lineal de $n$** de la forma $a + bn$. Pues ya lo tenemos: su complejidad asintótica es de $\Theta(n)$.

> **¿Por qué podemos agrupar constantes?** 
>
> Teniendo en cuenta que las constantes son constantes y que sus valores concretos no nos interesan, podemos agrupar y renombrar un conjunto de constantes bajo una nueva variable y así simplificar la expresión.

### The _simple way_

Aquí viene **el primer truqui** *(que no es tan truqui en realidad)*. Como comentábamos en la primera parte, a nosotros lo que nos interesa es **saber el comportamiento de nuestro algoritmo cuando el tamaño de $n$ crece sin límite**. Cuando hacemos que $n$ tienda a infinito, los valores que son constantes respecto al tamaño de $n$ son insignificantes, por lo que podemos darnos la libertad$^{1}$ de pasar por alto dichas constantes y **quedarnos solamente con aquellos términos que son relevantes a mayor escala**. Teniendo esto en cuenta, la expresión $(c_1 +  c_2(n + 1) + c_3n) \cdot c_4$ quedaría reducida a $n$ descartando constantes $c_1$ , $c_2$, $c_3$, $c_4$ y $1$.

De igual forma, concluimos por tanto que la complejidad asintótica de iterar sobre un lista de elementos usando un bucle simple con operaciones constantes en su interior es de $\Theta(n)$.

> $^1$ Merece la pena recalcar que podemos añadir tantas operaciones **constantes** dentro del cuerpo del bucle como queramos, ya que esto no afecta a su complejidad asintótica debido que, al descartar constantes, acabaremos con el mismo resultado: **la complejidad asíntótica de un bucle simple viene dada por el tamaño de datos de entrada y no por las operaciones que se realizan en su interior, siempre y cuando las operaciones que ejecute sean constantes y no dependan de los datos de entrada**. Si bien esto es cierto, elegir un algoritmo con peor rendimiento asíntótico respecto a otro que se comporte mejor puede tener sentido dependiendo de estas contantes, **siempre y cuando el tamaño de entrada sea relativamente pequeño**.
>

<blockquote class="ykt">

**Ejemplos en CLRS**

En el libro **CLRS** hay un par de problemas *(1.2-2 y 2.2-1)* muy interesantes donde se compara el rendimiento de dos algoritmos, **Insertion Sort** y **Merge Sort**, dadas unas hipotéticas expresiones que representan el análisis de complejidad de cada uno de ellos, dejando patente que **dependiendo de estas constantes** y, de nuevo, **para tamaños de entrada relativamente pequeños**, un algoritmo con peor coste asintótico puede ser mejor opción respecto a otro con mejor coste. 

</blockquote>

## Análisis de doble bucle `for`

Este caso también es interesante. Pongamos el ejemplo de ejecutar dos bucles consecutivos *(que no anidados)*:

```java
for (int i = 0; i < arr.length; i++) {
    console.log("i = " + i);
}

for (int i = arr.length; i > 0; i--) {
    console.log("i = " + i);
}
```

Este caso es muy simple de analizar, ya que sabemos que el coste de cada uno de ellos es de $\Theta(n)$, lo cual implicaría $\Theta(2n)$. De nuevo, si ignoramos constantes, deducimos que **ejecutar varios bucles de forma consecutiva no afecta al coste asintótico**, dejando dicho coste en $\Theta(n)$.

> Que no afecte al coste asintótico **no implica que no afecte tenga coste computacional**. Obviamente a mayor número de bucles sobre la entrada de datos, aún siendo secuencial, mayor coste. Aquí solo reflejamos que cuando el tamaño de $n$ es lo suficientemente grande este coste es insignificante.

## Análisis de bucle `for` anidado: índices independientes

```java
for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr.length; j++) {
        console.log("i = " + i + ", j = " + j);
    }
}
```

Este es un caso que podemos ver con bastante frecuencia, quizá no expresado exactamente así, pero sí siguiendo una estructura muy similar. Tenemos **dos bucles anidados** y, como comentaba arriba, la forma más analítica de representar un bucle es a partir de **sumatorias**. Vamos a expresar estos bucles multiplicando dichas sumatorias:

$$
    \sum\limits_{i=0}^{n} \sum\limits_{j=0}^{n} c
$$

> **¿Por qué multiplicar las sumatorias?** 
> 
> La **combinatoria** tiene la respuesta. Échale un ojo a la <a href="https://es.wikipedia.org/wiki/Principio_del_producto_(combinatoria)" target="_blank">regla del producto</a>.

Analizar las sumatorias por separado suele resultar más sencillo. La sumatoria interna no depende de $j$, por lo que podemos resolver directamente:

$$
    \sum\limits_{i=0}^{n} c(n + 1) = c \sum\limits_{i=0}^{n} (n + 1) \tag{1}
$$

<span class="whisper">

Si no hubiera basado los índices del bucle en cero el análisis sería incluso más simple, pero me gusta el realismo...

</span>

De igual forma, la sumatoria resultante tampoco depende de $i$, dejándonos la siguiente expresión:

$$
    c \sum\limits_{i=0}^{n} (n + 1) = c(n + 1)^2 \tag{2}
$$

Por tanto la complejidad asintótica de dos bucles anidados con **índices independientes** es de $\Theta(n^2)$.

## Análisis de bucle `for` anidado: índices dependientes

Aquí la cosa se empieza a poner interesante. Supongamos que nos encontramos con la siguiente estructura que es **bastante común**:

```java
for (int i = 0; i < arr.length; i++) {
    for (int j = i; j < arr.length; j++) {
        console.log("i = " + i + ", j = " + j);
    }
}
```

Nótese que, en este caso, el bucle interno **inicializa la variable `j` como `j = i`**; son **dependientes**. Aunque parezca un cambio inocuo, veremos cómo el análisis de este tipo de bucles dista mucho de ser tan simple como el ejemplo anterior.


De nuevo, asumamos que el coste de ejecución del cuerpo del bucle anidado es constante, coste $c$, asignemos $n$ a la longitud del array y expresemos el bucle `for` como una sumatoria, donde el **índice inferior** representa el **valor inicial** y el **índice superior** representa la **condición de parada** del bucle:

$$
     \sum\limits_{i=0}^{n} \sum\limits_{j=i}^{n} c
$$

<span class="whisper">Cómo trabajar con sumatorias está fuera del ámbito de este post, pero quizá en un futuro escriba algo al respecto.</a>

Como el índice $j$ no aparece dentro de la sumatoria, podemos resolver directamente sumando los $n - i + 1$ términos de la suma:

$$
     \sum\limits_{i=0}^{n} \sum\limits_{j=i}^{n} c =  \sum\limits_{i=0}^{n} c(n - i + 1) = c \sum\limits_{i=0}^{n} (n - i + 1)
$$

> **¿Por qué los $n - i + 1$ términos?**
> 
> Si quiero sumar, pongamos, desde el 5 hasta el 10, ¿cuántos elementos intervienen en dicha suma? El conjunto de elementos que queremos sumar sería $ S = \set{5, 6, 7, 8 ,9, 10}$ y la cardinalidad de $S$ sería $|S| = 6$. Si $n = 10$ y $i=5$, tenemos que $10 - 5 + 1 = 6$, que es el total de elementos que tenemos que sumar. Prueba con otras cantidades si aún tienes los ojos entornados.

Ahora tenemos un pequeño problema, y es que la sumatoria que nos ha quedado **no tiene forma cerrada** como al anterior, sino que depende de $n$ y de $i$. Para analizar este tipo de sumatorias hay varias técnicas y en este post voy a detallar dos de ellas: **linealidad** y **limitar la sumatoria**.

<blockquote class="info">

**linealidad vs limitar la sumatoria**

Es **muy recomendable** que la técnica por defecto sea limitar las sumatorias. En ocasiones puede ser más tedioso pero hay expresiones que **son muy aparatosas de analizar** usando linealidad o, directamente, **no pueden analizarse**. La propiedad de linealiad está **pensada para encontra valores exactos** y puede aplicarse cuando la expresión sea más o menos simple. Para expresiones más complejas no merece la pena el esfuerzo de un análisis tan exhaustivo, pues recordemos que en **análisis asintótico buscamos valores aproximados** cuando $n$ tiende a infinito, por lo que usando la técnica de limitar la sumatoria obtendremos un análisis de tendencia, que es justo lo que buscamos.

</blockquote>

#### Usando linealidad

La linealidad se aprovecha de algunas de las propiedades básicas de la suma, en concreto de la **asociatividad** y la **commutatividad**, y es que $(a_1 + b_1) + (a_2 + b_2) = (a_1 + a_2) + (b_1 + b_2)$. Entonces podemos partir la sumatoria tal que así:

$$
     c \sum\limits_{i=0}^{n} (n - i + 1) = c \sum\limits_{i=0}^{n} n - c \sum\limits_{i=0}^{n} i + c \sum\limits_{i=0}^{n} 1
$$

Ahora podemos resolver cada sumatoria de forma aislada, dando como resultado:

$$
    \begin{align}
    c \sum\limits_{i=0}^{n} n &= c(n+1)n \medspace, \\
    c \sum\limits_{i=0}^{n} i &= \dfrac{c(n+1)(n+2)}{2} \medspace, \\
    c \sum\limits_{i=0}^{n} 1 &= c(n+1)
    \end{align}
$$

Lo ponemos todo junto y solo queda una operación simple:

$$
    \begin{aligned}
    &c(n+1)n - \dfrac{c(n+1)(n+2)}{2} + c(n+1) \\
    &= c(n+1)(n - \dfrac{n+2}{2} + 1) \\ 
    &= c(n+1) \dfrac{2n−(n+2)+2}{2} \\ 
    &= \dfrac{c(n+1)n}{2}
    \end{aligned}
$$

**Conclusión**: el coste asintótico es de $\Theta(n^2)$.

#### Limitando la sumatoria

En este caso, lo que haremos será analizarla como si fuera un límite por izquierda y por derecha, es decir, analizaremos su límite superior e inferior y, si coinciden, podremos dar la complejidad asintótica.

##### Analizando el límite superior

Para poder limitar por arriba la sumatoria y dado que la función es decreciente en $i$, tenemos que dar el **menor valor de $i$** posible:

> **¿Por qué el menor valor de $i$?**
>
> Porque al ser una función **decreciente** en $i$ *(está restando)*, para obtener una **cota superior** tenemos que **encontrar el valor de $i$ que haga que la función tome el mayor valor posible**. De lo contrario acabaríamos con una expresión tal que $c \sum\limits_{i=0}^{n} (n - n + 1) = c \sum\limits_{i=0}^{n} 1 = cn$, lo cual no nos una cota superior lo suficientemente ajustada subestimando la sumatoria.

$$
    c \sum\limits_{i=0}^{n} (n - i + 1) \leq c \sum\limits_{i=0}^{n} (n - 0 + 1) = c \sum\limits_{i=0}^{n} (n + 1) = c n(n + 1) = c(n^2 +n)
$$

Lo cual nos deja $\Omicron(n^2)$.

##### Analizando el límite inferior

Este caso requiere de algo más de trabajo. El objetivo en el límite inferior es encontrar el **mayor valor de $i$** que sea lo más ajustado posible. Antes de ponernos con el análisis pensemos un poco en cómo podríamos abordar este problema. Partimos de una desigualdad tal que así:

$$
    c \sum\limits_{i=0}^{n} (n - i + 1) \geq \delta
$$

<span class="whisper">He usado $\delta$ porque es la primera que se me ha ocurrido, pero podría ser otra variable cualquiera</span>

El tema es que ese $\delta$ puede ser cualquier cosa siempre y cuando se cumpla la desigualdad. Trabajar con desigualdades nos da una flexibilidad tremenda, mucho más que una igualdad, ya que mientras la desigualdad se cumpla podemos dar cualquier paso que sea legítimo, por raro que parezca. **Aquí otro truco**: sabemos que algo siempre es mayor que la mitad de ese algo. Con esto en mente podríamos partir la sumatoria en dos partes: una primera parte que sume desde $0$ hasta $n/2$ y otra parte que sume desde $(n+1)/2$ hasta $n$. Veámos qué podemos hacer partiendo de esta premisa:

$$
    \begin{align}
    &\quad\thickspace c \sum\limits_{i=0}^{n} (n - i + 1) \notag \\ 
    &= c \Bigg\lbrack \sum\limits_{i=0}^{n/2} (n - i + 1) + \sum\limits_{i=(n + 1)/2}^{n} (n - i + 1) \Bigg\rbrack \tag{1}\\ 
    &\geq c \sum\limits_{i=0}^{n/2} (n - i + 1) \tag{2}\\ 
    &\geq c \sum\limits_{i=0}^{n/2} (n - i) \notag \\ 
    &\geq c \sum\limits_{i=0}^{n/2} (n - \dfrac{n}{2}) \tag{3}\\ 
    &= c \sum\limits_{i=0}^{n/2} (\dfrac{n}{2}) = c \dfrac{n}{2} \cdot \dfrac{n}{2} = c \dfrac{n^2}{4} \notag
    \end{align}
$$

Recordemos que nuestro objetivo es hacer la desigualdad lo más ajustada posible. Con esto en mente, repasemos los puntos clave de este análisis:

1. Partimos la sumatoria en dos partes: desde $0$ hasta $n/2$ y desde $(n + 1)/2$ hasta $n$
2. Descartamos la mitad donde la suma haría que el valor fuese mucho menor y nos quedamos con la mayor$^1$ suma.
3. Sustituimos $i$ por el mayor$^2$ valor de $i$ haciendo que el **valor de la función sea el menor posible**, en este caso $n/2$.

Lo cual nos deja $\Omega(n^2)$ descartando constantes. Dado que el límite superior es $\Omicron(n^2)$ y el límite inferior es $\Omega(n^2)$, podemos concluir que el coste asintótico es de $\Theta(n^2)$.

> $^1$ **¿Por qué la mayor de las dos?**
> 
> Tenemos la sumatoria dividida tal que así:
> $$ 
>  \underbrace{c \sum\limits_{i=0}^{n/2} (n - i + 1) }_{\text{a}} + \underbrace{ c \sum\limits_{i=(n + 1)/2}^{n} (n - i + 1) }_{\text{b}}  
> $$
>
> Donde $a > b$ (poniendo valores concretos de $n$ se puede ver que esto es cierto). Si nos quedásemos con la mitad de la sumatoria que es menor de las dos, es decir, $b$, al resolver la sumatoria acabaríamos en el punto (3) con la siguiente expresión:
>
> $$
> \geq c \sum\limits_{i=(n + 1)/2}^{n} (n - n) = 0
> $$ 
>
> Lo cual no nos aporta ninguna información en el análisis ya que, aunque obviamente la desigualdad se cumple, no podemos sacar ninguna conclusión a partir de este resultado.

> $^2$ **¿Por qué el mayor valor de $i$?**
> 
> Por el mismo motivo que en el análisis de la cuota superior usábamos el menor valor de $i$, pero a la inversa.

# Bucles `while`

<blockquote class="ykt">

El análisis de bucles `while` se puede realizar de forma sistemática dibujando una **tabla de iteración** hasta la k-ésima iteración y después aplicando la condición de parada del bucle a la expresión resultante.

</blockquote>

Quizá la primera pregunta que se te venga a la mente es, ¿por qué distinguir el análisis de bucles `for` y `while` si ambos son bucles? Ciertamente el análisis de ambos no difiere mucho y la diferencia reside en **qué tan compleja es la lógica para la condición de parada**. Me explico: en los bucles `for` normalmente actualizamos el índice de una forma específica, ya sea incrementándolo, decrementándolo, etc. En un bucle `while`, además de esto podemos, tener algún tipo de lógica, como estructuras condicionales, haciendo el análisis un tanto diferente. 

Para ilustrar cómo se analizaría un bucle `while` dejaré tres de casuísticas: un ejemplo sencillo como toma de contacto, un ejemplo mixto que incluye una mezcla de bucles `for` y `while` anidados y un último ejemplo real, y también más complejo de analizar, usando un algoritmo bastante conocido: **binary search**.

## Bucle `while`: ejemplo simple

```java
int i = 4;
int n = arr.length();

while (i <= n) {
    i = i + 3;
}
```

Asumamos que la línea 5 tiene coste constante $c$. Dibujemos la tabla de iteración:

| # Iteración     | valor de $i$  |
|-----------      | -----         |
| $0$             | $4$           |
| $1$             | $7$           |
| $2$             | $10$          |
| $3$             | $13$          |
| $4$             | $16$          |
| ...             | ...           |
| $k$             | $4 + 3k$      |

**Sígueme en este razonamiento porque aquí está la clave del análisis**:

Pongamos que **el bucle termina en la k-ésima iteración** *($k$ es cualquier entero)*, lo cual implica que el bucle se ha ejecutado pues eso, $k$ veces. Fijémonos en la **condición de parada**: la condición de parada es $i \leq n$. En la k-ésima iteración $i$ vale $4 + 3k$ y, como hemos dicho que la ejecución $k$ es la última ejecución, tenemos que el valor de $i$ en la ejecución $k$ es igual a $n$, es decir: $4 + 3k = n \implies k = \dfrac{n-4}{3}$. Si el cuerpo de bucle tiene un coste de $c$ y el coste de las $k$ ejecuciones es de $\dfrac{(n-4)}{3}$, tenemos que el coste total es de $\dfrac{c(n-4)}{3}$ lo que nos deja un coste asintótico de $\Theta(n)$.

## Bucle `while`: ejemplo mixto

```java
int i = 1;
int n = arr.length();

while (i <= n) {
    for (int j = 1; j < i; j++) {
        console.log("i = " + i + ", j = " + j);
    }
    i = i * 2;
}
```

El bucle interno tiene coste de $c \cdot i$ *(omito el análisis ya que un ejemplo similar está analizado arriba)*. Ahora, tenemos un bucle `while` que depende de $i$. Dibujemos la tabla de iteración:

| # Iteración     | valor de _i_  |
|-----------      | -----         |
| $1$             | $1$           |
| $2$             | $2$           |
| $3$             | $4$           |
| $4$             | $8$           |
| ...             | ...           |
| $k$             | $2^k$         |

Sabemos que el bucle termina cuando `i = n`. Asumamos que el bucle finaliza en la k-ésima iteración, es decir, $2^k = n \implies k = log_2(n)$. Con esto sabemos el número total de iteraciones: $log_2(n)$. Y también sabemos el coste de cada iteración: $c \cdot i$. Aquí, a diferencia del ejemplo anterior, el coste del cuerpo del bucle `while` no es constante, sino que depende de $i$:

| i-ésima iteración   | coste  |
| -----------   | -----  |
| $0$           | $1c$   |
| $1$           | $2c$   |
| $2$           | $4c$   |
| $3$           | $8c$   |
| ...           | ...    |
| $log_2(n)$    | $c2^i$ |

Por tanto, el coste total será la suma de los costes, desde $0$ hasta $k$ *(donde $k = log_2(n)$)*, es decir: $ c \sum\limits_{i=0}^{log_2(n)} 2^{i}$. Resultando en una **serie geométrica** que tiene forma cerrada conocida: $2^{k+1} − 1$. Como $k = log_2(n)$ y $2^{k+1} = 2 \cdot 2^k$, el coste total por tanto es $c(2 \cdot 2^{log_2(n)} - 1) = c(2n - 1)$ y la complejidad asíntótica es de $\Theta(n)$.

## Bucle `while`: ejemplo de análisis de binary search

<blockquote class="ykt">

Hacer análisis de estructuras condicionales en algoritmos iterativos, como las que vamos a ver ahora, suele evitarse dado que normalmente no sabemos a exactamente cuántas veces se va a ejecutar cada rama de la estuctura `if / else`, lo cuál nos lleva a **estimar y asumir comportamiento de dichos datos** (como probabilidad uniforme, asumir que no hay repetición del dato, etc) y complica el análisis. La **estrategia a seguir** en estos casos es **tomar el camino más costoso** *(el peor de los casos)* y **descartar los caminos donde el algoritmo tenga que realizar menos operaciones** intentando así eliminar la estructura condicional.

</blockquote>

```java
public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}
```

Pactemos un par de condiciones para facilitar el análisis:

* Asumamos que **el índice del array no empieza en cero, sino en uno**, quedando tal que `int left = 1, right = arr.length` ya que si no lo hacemos así la expresión final se complica un poco y solo aporta ruido visual al análisis.
* Dado que tenemos varios caminos `if / else`, lo que vamos a hacer es **elegir el peor de los casos** (que es lo que nos interesa para el análisis). Por tanto, dentro de la lógica condicional, asumimos que siempre **se va a ejecutar el camino más costoso**. 

> Claramente la condición de la línea 8 tiene que ser la **menos costosa**, puesto que ese es el camino donde encontramos el valor que estábamos buscando. Por tanto la más costosa tiene que ser una de las dos condiciones restantes. Revisando cada operación vemos que el coste es el mismo: hacer una comparación y después asignar el valor a una variable.

Nos ponemos en el peor de los casos y **pensamos que buscamos un elemento que no existe y que es más pequeño que el primer elemento de la lista**, lo cuál haría que se ejecutase la rama de la **línea 13 en todas las iteraciones**. 

> Básicamente buscamos que el algoritmo trabaje lo máximo posible. Por ejemplo, para este input `int[] arr = {2, 3, 5, 7, 9, 11, 13, 15};`, si buscamos un elemento que no exista y que sea menor que el primer elemento, el algoritmo tendría que hacer todas las comparaciones posibles hasta encontrar el elemento: `[2, 3, 5, 7, 9] -> [2, 3, 5] -> [2, 3] -> [2]`

La forma más sencilla de analizar bucles `while` cuando intervienen varias variables es usando tablas de iteración. Veámos entonces la tabla de iteración del bucle **suponiendo que el bucle termina después de $k$ iteraciones**:

| # Iteración   | total datos   |
|-----------    | -----         |
| 1             | $n/2$         |
| 2             | $n/4$         |
| 3             | $n/8$         |
| 4             | $n/16$        |
| ...           | ...           |
| k             | $n/2^k$       |


La condición de parada del bucle es `left <= right` y, dado hemos fijado que `left = 1`, el bucle parará cuando la k-ésima iteración sea menor o igual a ese valor, es decir, que $n/2^k = 1$. Si resolvemos para $k$ tenemos que $k = log_2(n)$, es decir, el cuerpo del bucle se ejecuta en **order logarítmico** respecto al tamaño de datos. Tenemos pues que el coste asintótico del algoritmo **binary search** es de $\Theta(log(n))$.

# Conclusión y siguientes pasos

En la <a href="/blog/algorithms-analysis">primera parte</a> hablamos sobre la notación Big-O, qué representa y cómo usarla. En esta segunda hemos visto cómo analizar los distintos tipos de estructuras que podemos encontrarnos habitualmente y así poder categorizarlas. Con esto creamos un fundamento bastante sólido y hemos desarrollado una seríe de técnicas que nos brindan autonomía para analizar una gran variedad de casos que pueden presentarse en el día a día.

Sin embargo aquí no hemos hablado en ningún momento sobre otro aspecto necesario en el diseño y estudio de algoritmos: **recursividad**. Muchos de los algoritmos que podemos encontrarnos por ahí hacen uso de esta técnica y el análisis de estos difiere de lo que hemos venido contando hasta ahora. Tocaría hablar este tipo de análisis y de **relaciones de recurrencia** pero, como hay mucho que contar sobre esto, lo voy a dejar aquí y añadiré ese contenido en una tercera entrada. 

Sin más, cualquier duda, aclaración, error o comentario en el footer están mis datos de contacto. ¡Hasta la próxima!
