---
title: 'Algoritmos I - análisis asintótico'
description: 'En esta primera parte sobre análisis de algoritmos veremos cómo medir y categorizar algoritmos, usando para ello análisis asintótico, además de definir las notaciones Big-O, Big-Omega y Big-Theta.'
pubDate: 'Mar 06 2025'
draft: false
---

<style>
.container {
    display: grid;
    grid-template-columns: repeat(
        auto-fill, 
        minmax(300px, 1fr)
    );

    & div {
        padding: 5px;
    }
}
.katex-display > .katex {
    max-width: 100% !important;
    overflow: hidden !important;
    white-space: normal !important;
    color: var(--highlight);
}
.katex {
    color: var(--main-color-h2);
}
.asymptotic-graph {
    margin-left: calc(50% - 126px);
}
.disclaimer {
    background-color: rgb(255, 246, 206);
    border-left: 4px solid rgb(188, 161, 54);
}

pre code {
  counter-reset: line;
}

pre code .line::before {
  content: counter(line);
  counter-increment: line;
  width: 1.5em;
  display: inline-block;
  text-align: right;
  margin-right: 2em;
  color: rgba(115,138,148,.4)
}
</style>

# Introducción

Esta es la primera parte de una serie de posts en los que hablaré sobre **algoritmos y cómo analizarlos**. Para poder analizar algoritmos necesitamos desbloquear un par de cosas:

* **Análisis asintótico y orden de complejidad**, que es lo que vamos a ver **en este post**.
* **Análisis del tiempo de ejecución** de un algoritmo, a través del cuál se analiza un algoritmo estructuralmente para, posteriormente, poder hacer el análisis asintótico del mismo. Este apartado lo cubriré **en profundidad en un futuro post** pero dejaré un ejemplo al final.

<br />

# Por qué medir la eficiencia de un algoritmo

Venga, te presento los siguientes algoritmos de ordenación, ¿cuál dirías que es más eficiente? 

<span class="whisper">quizás sabes la respuesta pero, ¿sabrías justificar por qué?</span>

<div class="container">
<div>

**Insertion sort**

```java
void insertionsort(int[] arr) {
    for (int j = 1; j < arr.length; j++) {
        int i = j - 1;
        while (i >= 0 && arr[i] > arr[i+1]) { 
            swap(arr, i, i+1);
            i--;
        }
    }
}
```
</div>
<div>

**Merge sort**

```java
void mergesort(int[] arr, int from, int to) {
    if (arr.length == 1) return;
    
    int mid = (from + to) / 2;
    mergesort(arr, from, mid);
    mergesort(arr, mid + 1, to);

    merge(arr, from, mid, to);
}
```

</div>
</div>

Así a simple vista tampoco parece que haya mucha diferencia. El número de líneas de código es similar, no parece que en ninguno haya cálculos muy complejos... Entonces, **¿cómo lo hacemos?** Quizá se te pase por la cabeza decir: *"bueno pues voy haciendo pruebas manualmente con conjuntos de datos de diferente tamaño, más pequeños y más grandes, y a ver cuál termina primero"*. Aunque poco práctico, podría ser una primera aproximación, pero **tiene con un problema considerable**; estarías probado cómo se comporta el algoritmo **en tu hardware**. Lo cual no es extrapolable a cómo se comportaría el mismo algoritmo en una máquina distinta.

Para solucionar esto se estableció un marco teórico, **matemático**, a través del cual puedes abstraerte del hardware y medir de forma analítica el rendimiento de tu algoritmo. Este marco matemático se llama **análisis asintótico** y básicamente se encarga de **categorizar el tiempo de ejecución** de un algoritmo dado **cuando el conjunto de datos con el que trabaja crece sin límite**. 

> Cuando decimos **asintótico** nos referimos al **comportamiento de una función cuando los datos de entrada tienden a infinito**.

## La "big picture"

<br />

Fuente: <a href="https://www.bigocheatsheet.com" target="_blank">https://www.bigocheatsheet.com</a>

<svg id="chart" viewBox="0 0 800 500" width="100%" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 450 L 50 0 L 800 0 L 800 450 Z" fill="#ff8989"></path>      
    <path d="M50 450 L 800 0 L 800 450 Z" fill="#FFC543"></path>
    <path d="M50 450 L 800 450 L 800 330 Z" fill="yellow"></path>
    <path d="M50 450 L 800 450 L 800 410 Z" fill="#C8EA00"></path>
    <path d="M50 450 L 800 450 L 800 440 Z" fill="#53d000"></path>
    <path d="M50 0 L 50 450 L 800 450" fill="transparent" stroke="black" stroke-width="2"></path>
    <path d="M50 448 L 800 448" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="700" y="438" fill="black">O(log n), O(1)</text>
    <path d="M50 450 L 800 400" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="760" y="390" fill="black">O(n)</text>
    <path d="M50 450 Q 400 350, 800 150" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="630" y="190" fill="black">O(n log n)</text>
    <path d="M50 450 Q 180 380, 250 0" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="260" y="30" fill="black">O(n^2)</text>
    <path d="M50 450 C 100 430, 120 350, 120 0" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="125" y="20" fill="black">O(2^n)</text>
    <path d="M50 450 C 80 450, 80 350, 80 0" fill="transparent" stroke="black" stroke-width="2"></path>
    <text x="80" y="20" fill="black">O(n!)</text>
    <text x="0" y="0" transform="translate(30 230) rotate(-90)" style="dominant-baseline: middle; text-anchor: middle; font-size:20px; color: #555; font-size:20px; color: #555; font-style: italic;" fill="black">Operations</text>
    <text x="0" y="0" transform="translate(420 470)" style="dominant-baseline: middle; text-anchor: middle; font-size:20px; color: #555; font-style: italic;" fill="black">Elements</text>
</svg>

A poco que busques información sobre notación asintótica te cruzarás con esta imagen o con una similar. Básicamente **representa las categorizaciones que comúnmente usamos para clasificar algoritmos** *(existen muchas más categorías)*, donde los algoritmos con mejor rendimiento se encuentrarían paralelos *(más bien apoyados)* al eje $x$ e iría empeorando el rendimiento a medida que nos alejamos.

Para empezar, vamos a desglosar un poco de esas categorías, en orden decreciente al rendimiento, es decir, **los más eficientes primero** y para ello usaré [la notación $\Omicron(x)$](#notación-oomicrono-big-o).

* $\Omicron(1)$ : **Implica que el tiempo de ejecución es constante** porque no depende del tamaño de entrada de datos. 

> Por ejemplo, declarar una variable tiene un tiempo de ejecución constante. De esta forma nos abstraemos del hardware, ya que declarar una variable en un ordenador de los 90 o en un servidor de alta capacidad muy moderno tiene el mismo coste *(asintóticamente hablando)*.

* $\Omicron(log(n))$ : **Rendimiento logarítmico**, prácticamente se puede considerar constante porque crece muy lentamente a medida que el número de datos de entrada aumenta. 

> Por ejemplo, supongamos que diseñamos un algorimo que es capaz de ordenar un conjunto de elementos en tiempo logarítmico. Si el conjunto de datos tiene por ejemplo 10 elementos, mi algoritmo tardaría 1 milisegundo en resolver el problema. Para 100 elementos, tardaría 2 milisegundo de tiempo, para 1000 tardaría 3 milisegundo, y así sucesivamente. Encontrar un elemento dado en una lista de elementos previamente ordenada tiempo logarítmico.
>
> Actualmente no existe ningún algoritmo **de ordenación** capaz de ordenar con esta complejidad asintótica.

* $\Omicron(n)$ : **Tiempo lineal**, lo cual implica que el rendimiento del algoritmo es proporcinal al tamaño de datos de entrada. Por ejemplo, recorrer todos los elementos de una lista para mostrarlos en pantalla tiene complejidad lineal.

* $\Omicron(n\cdot log(n))$ : **Tiempo cuasilineal**, un poco peor que lineal pero aún dentro de un rango aceptable. Algoritmos con estos tiempos de ejecución aún son aceptables cuando el tamaño de entrada es muy muy grande. 

> **Todos los algoritmos de ordenación basados en comparaciones binarias$^*$** *(la mayoría, vamos)* **tienen una complejidad asíntótica de $\Omega$(n)**.
>
> $^*$ Comparaciones binarias se refiere a cualquier comparación lógica en la que intervengan dos elementos: $ >, <, \leq, \ge, = ...  $

* $\Omicron(n^2)$ : **tiempo cuadrático** o **por fuerza bruta**, es el tope máximo *(siendo muy generoso)* que podríamos tildar de "aceptable" *(que no eficiente)* en un algoritmo. Hay algunos algoritmos que corren en este orden de crecimiento y no tenemos nada mejor, véase por ejemplo el método Streasen para multiplicar matrices.

* $\Omicron(2^n)$, $\Omicron(n!)$ : Estos dos los voy a tratar bajo un mismo punto porque el rendimiento de un algoritmo que caiga en cualquiera de estos tiempos asíntóticos no es manejable para ningún ordenador cuando el número de elementos de entrada aumenta. El famoso <a href="https://es.wikipedia.org/wiki/Problema_del_viajante" target="_blank">problema del viajante</a> recae en este orden de crecimiento.


## Notación $\Omicron$

Primero veámos **la idea intuitiva** de qué se quiere representar con esta notación y después vemos la definición formal. 

> La notación $\Omicron(n)$ *(conocida como **big-O** y usada como *O grande de $n$ o O de $n$*)* representa una **cota superior asintótica** para una función a partir de un valor dado. Es decir, para valores suficientemente grandes de $n$, la función $f(n)$ crece **como mucho** igual $g(n)$ dentro de un **factor constante**. Este hecho se representa como $ f(n) = \Omicron(g(n)) $.

Cuando decimos que un algoritmo es del orden de crecimiento de $\Omicron(g(n))$, indicamos que la función $f(n)$ crecerá como mucho igual que $g(n)$, de ahí lo de *"cota superior"*. **Puede ser mejor** dadas ciertas circunstancias, pero con esta notación indicamos el tope por arriba. Os dejo un pequeño esbozo de cómo se representaría una función $f(n)$ dentro de $\Omicron(g(n))$:

<svg xmlns="http://www.w3.org/2000/svg" width="252" height="255" class="asymptotic-graph"><defs><style>@font-face{font-family:Excalifont;src:url(data:font/woff2;base64,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)}</style></defs><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M11.523 43.899c.12 29.69.54 149.1.49 178.87m-2.01-180.16c.02 29.35 1.21 148.85 1.24 178.51"/><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M12.637 222.154c35.78.18 179.44 0 215.23-.22m-216.75-.73c35.59-.11 180.03-1.31 215.92-1.21"/><path fill="#e03131" d="m13.425 184.774.69-.63q.69-.63 1.71-1.7 1.02-1.07 1.97-2.12t2.07-2.19q1.13-1.15 2.21-2.24 1.09-1.09 1.9-1.84.82-.74 1.61-1.5.79-.76 1.96-1.91 1.17-1.16 2.06-1.8.89-.63 2.19-1.24 1.3-.61 2.79-.91 1.48-.31 2.59-.45 1.1-.15 2.28-.28 1.18-.13 2.45-.14 1.28-.01 2.42-.01 1.14-.01 2.39-.12 1.25-.12 2.83-.76 1.57-.65 2.9-1.44 1.33-.79 2.95-1.96 1.62-1.16 3.77-2.71 2.15-1.54 3.56-2.5 1.42-.97 2.3-1.62.89-.64 2.4-1.61 1.51-.97 2.77-1.75 1.25-.79 2.28-1.54 1.03-.75 2.06-1.47 1.04-.72 2.09-1.54 1.06-.81 2.32-1.86 1.26-1.04 2.75-2.06 1.48-1.02 2.9-1.84 1.42-.82 3.1-2.01 1.69-1.2 3.1-2.24 1.41-1.04 2.85-2.06 1.44-1.01 2.38-1.95.94-.93 2.02-2.18 1.08-1.24 1.89-2.27.8-1.03 1.72-2.36.92-1.34 2.25-2.72 1.33-1.38 2.02-2.31.68-.92 2.22-2.87 1.54-1.95 2.66-3.26 1.11-1.31 2.51-2.95 1.4-1.64 2.98-3.34 1.57-1.71 2.95-2.94 1.37-1.23 2.53-2.16 1.16-.93 2.51-1.8 1.35-.88 2.75-1.63 1.41-.74 2.95-1.49 1.54-.75 2.53-1.16.99-.41 2.02-.79 1.02-.37 2.93-1.1 1.9-.74 2.99-1.21 1.1-.46 2.31-.93 1.21-.47 2.29-.96l2.36-1.08q1.29-.59 3.37-1.41l3.27-1.31q1.21-.48 3.2-1.22 1.99-.74 3.02-1.2 1.03-.45 2.51-.99 1.48-.53 2.97-1.09 1.5-.55 3.16-1.34 1.66-.78 2.82-1.43 1.17-.65 2.17-1.47.99-.82 1.94-1.8.96-.98 1.8-2.25.83-1.27 1.62-2.55.79-1.29 1.61-2.22.83-.94 1.73-1.8.9-.86 1.96-1.91 1.05-1.05 2.06-1.88 1-.83 2.09-1.52 1.08-.69 1.87-1.47t1.56-1.63q.77-.86 1.59-1.54.83-.69 1.67-1.51.84-.82 1.94-1.85 1.09-1.03 2.36-1.94 1.27-.91 2.46-1.77 1.19-.85 2.31-1.8 1.12-.95 2.31-1.86 1.2-.91 2.38-1.76 1.19-.84 2.48-1.79 1.28-.96 2.16-1.67.88-.72 1.75-1.38.87-.66 2.18-1.29 1.31-.64 2.77-1.3 1.47-.67 2.49-1.18 1.02-.52 2.06-.96 1.04-.44 1.63-.84.59-.39.72-.55.13-.17.31-.29.18-.11.38-.16.21-.06.42-.04.21.01.41.1.19.08.35.22.16.14.27.33.1.18.14.39.05.21.02.42-.03.21-.12.4-.09.19-.24.34-.15.15-.34.25-.19.09-.4.12-.21.03-.42 0-.21-.04-.4-.15-.18-.1-.33-.26-.14-.15-.22-.35-.09-.19-.11-.41-.02-.21.03-.41.05-.21.17-.39.11-.18.28-.31.16-.14.36-.21.2-.08.41-.08.21-.01.42.05.2.06.37.18.18.13.3.3.13.17.19.37.06.21.06.42-.01.21-.08.41l-.07.2-1.08 1.77q-1.08 1.77-2.28 2.41-1.19.64-2.26 1.13-1.07.49-2.16.98-1.08.5-2.23 1.08-1.16.59-2.09 1.37-.94.79-2 1.59-1.06.79-2.35 1.73-1.28.94-2.53 1.84-1.26.9-2.29 1.74-1.03.83-2.39 1.9-1.37 1.07-2.48 1.81-1.11.73-2.05 1.52-.93.8-2.09 1.95-1.16 1.14-2.1 1.92-.94.78-1.77 1.7-.84.92-1.97 2-1.13 1.09-2.46 1.95-1.33.87-2.3 1.78-.98.91-2.05 1.97-1.08 1.05-2.01 2-.92.95-1.72 2.25-.8 1.3-1.9 2.89-1.09 1.59-2.22 2.72-1.12 1.14-2.37 2.14-1.25.99-2.56 1.72t-3.16 1.61q-1.86.87-3.43 1.45-1.56.58-2.88 1.05-1.33.48-2.51.99-1.18.52-3.09 1.23t-3.17 1.21l-3.17 1.26q-1.91.76-3.22 1.36-1.3.6-2.49 1.13-1.18.53-2.33.97-1.14.45-2.32.95-1.19.5-3.11 1.24l-3.81 1.48q-1.89.73-3.36 1.44-1.46.72-2.71 1.38-1.25.67-2.36 1.39-1.12.71-2.27 1.63-1.15.92-2.33 1.98-1.19 1.07-2.63 2.63-1.44 1.56-2.85 3.21l-2.47 2.89q-1.06 1.25-2.57 3.16-1.52 1.92-2.39 3.06-.88 1.14-1.81 2.09-.94.95-1.64 1.86-.7.9-1.59 2.17-.89 1.28-1.76 2.28-.87 1.01-1.64 1.89-.77.89-1.97 2.04t-2.66 2.19q-1.47 1.04-2.84 2.05-1.37 1.01-2.28 1.67-.91.65-1.9 1.33-.99.68-2.3 1.43-1.32.76-2.58 1.61-1.26.86-2.56 1.93-1.29 1.07-2.52 2.01-1.22.94-2.14 1.58-.93.65-2.08 1.48-1.15.84-2.44 1.65-1.3.81-2.67 1.68-1.37.88-2.3 1.56-.94.67-2.32 1.62-1.39.95-3.51 2.47-2.12 1.51-2.99 2.15-.87.64-2.54 1.77-1.68 1.12-3.1 1.84-1.42.72-2.99 1.25-1.58.53-3.1.66-1.53.13-2.92.13t-2.56.02q-1.17.02-2.42.17-1.25.14-2.32.29-1.06.16-2.54.73t-2.39 1.31q-.91.73-2.07 1.87-1.16 1.14-2.33 2.23-1.18 1.08-2.26 2.17-1.09 1.09-2.18 2.2t-2.06 2.18q-.98 1.08-2.09 2.24-1.12 1.15-1.81 1.78-.7.63-.91.78-.22.16-.46.25-.25.1-.51.13-.26.04-.51.01-.26-.03-.51-.12t-.46-.24q-.22-.14-.4-.34-.18-.19-.3-.42-.13-.24-.19-.49-.07-.26-.07-.52-.01-.25.05-.51.06-.25.18-.49.12-.23.3-.43l.17-.2Z"/><path fill="#1971c2" d="m15.737 160.095.82-.38q.81-.37 1.96-.68 1.16-.3 2.75-.11 1.6.19 2.99 1.05 1.39.85 2.38 1.73.98.87 1.84 2.04.86 1.18 1.55 2.35.69 1.17 1.24 2.33.55 1.15 1.32 2.3t1.48 1.99q.7.83 1.52 1.86.82 1.02 1.43 1.93.61.9 1.23 1.98.62 1.07 1.48 2.39.86 1.31 1.46 2.35.6 1.03 1.18 1.93.58.89 1.4 2.04.83 1.14 1.71 1.97.89.82 1.91 1.32 1.02.51 2.38.81 1.35.31 2.74.25 1.39-.06 2.52-.51 1.14-.46 2.19-1.17 1.05-.72 1.76-1.63.72-.9 1.36-1.84.64-.95 1.2-1.91.56-.96 1.03-2.08.47-1.13.84-2.17.38-1.03.8-2.27.42-1.25.81-2.59.39-1.34.75-2.65.36-1.32.68-2.61.31-1.29.55-2.35.24-1.06.57-2.25.33-1.18.63-2.31.3-1.13.33-2.29.03-1.17.03-2.37v-2.79q0-1.59.1-2.85.1-1.25.27-2.45.17-1.21.47-2.44.31-1.23.84-2.47.54-1.23 1.3-2.56.76-1.32 1.44-2.32.67-1.01 1.52-1.95.84-.93 1.84-1.97t2.43-2.14q1.43-1.09 2.86-1.79 1.42-.7 2.86-1.28 1.43-.59 2.99-1.19 1.56-.6 2.92-1.1 1.36-.49 3-.98 1.65-.49 2.81-.76 1.15-.26 3.71-.93 2.55-.66 3.99-1.12 1.44-.46 2.67-.8 1.24-.33 2.34-.61 1.1-.27 2.96-.73 1.87-.47 3.54-1.03 1.68-.57 3.28-1.17 1.59-.6 3.02-1.17 1.42-.58 2.68-1.2 1.26-.61 2.69-1.22t3.11-1.48q1.67-.87 3.08-1.57 1.4-.71 2.39-1.29 1-.58 2.19-1.25 1.19-.66 2.4-1.2 1.21-.54 2.52-1.18 1.31-.65 2.43-1.17 1.12-.52 2.18-1.02 1.07-.51 2.44-1.01 1.37-.5 2.58-.9 1.21-.41 2.38-.66 1.17-.26 2.28-.38 1.1-.12 2.31-.21 1.2-.1 2.5-.31t2.46-.71q1.16-.5 2.23-1.1 1.06-.61 2.14-1.39l2.26-1.61q1.19-.83 2.17-1.57.98-.74 1.86-1.43.88-.69 1.84-1.42.95-.73 2.16-1.44 1.2-.71 2.28-1.06 1.07-.36 2.11-.77 1.04-.42 2.05-1.09 1-.68 2.13-1.69 1.13-1.02 2-1.81.87-.8 1.72-1.82t1.65-2.03q.79-1 1.62-1.84.83-.84 1.76-1.9.92-1.06 1.74-2.02.82-.95 1.94-2t2.28-2.04q1.16-1 2.28-1.71 1.13-.71 2.26-1.44 1.13-.72 2.65-1.51 1.52-.8 2.76-1.23 1.24-.44 2.94-1.2 1.7-.75 2.91-1.31 1.2-.55 2.25-.97 1.05-.42 2.27-.79 1.22-.38 2.68-.88 1.45-.5 2.9-.85 1.44-.36 2.91-.72 1.48-.36 2.81-.6 1.34-.25 2.68-.39 1.34-.13 2.52-.16 1.18-.02 1.85-.46.68-.44.78-.63.1-.18.26-.33.15-.14.35-.23.19-.09.4-.11.21-.02.42.02.21.05.39.16.18.11.32.28.13.16.21.36.08.2.09.41.01.21-.05.41-.06.21-.18.38-.12.18-.29.31-.17.12-.37.19-.21.07-.42.06-.21 0-.41-.07-.2-.07-.37-.2-.17-.13-.29-.3-.11-.18-.17-.38-.05-.21-.04-.42.01-.21.09-.41.08-.2.22-.36.14-.16.32-.27.19-.11.39-.15.21-.04.42-.02.21.03.41.12.19.09.34.23.15.15.25.34.1.19.13.4.04.21 0 .42l-.04.21-1.59 2.19q-1.6 2.19-2.66 2.2-1.07.01-2.33.13-1.26.11-2.48.3-1.21.19-2.87.6-1.66.4-2.94.72-1.28.31-2.64.79-1.37.47-2.97 1.01t-2.72 1.02q-1.12.48-2.37.97-1.25.5-2.4 1.06-1.15.57-2.21.93-1.06.37-2.33 1.02-1.26.64-2.38 1.36-1.11.71-2.05 1.29-.95.57-1.97 1.44t-2.05 1.83q-1.03.96-1.81 1.86-.77.9-1.54 1.77-.78.87-1.7 1.83-.93.97-1.75 2.01-.83 1.05-1.75 2.14-.91 1.1-2.05 2.15-1.14 1.05-2.05 1.87-.91.83-1.82 1.5t-2.07 1.33q-1.16.66-2.43 1.09-1.28.43-2.42.96-1.14.54-2.16 1.32-1.02.78-2.17 1.73-1.14.95-2.07 1.57-.93.62-2.07 1.4-1.14.78-2.06 1.47-.92.69-2.03 1.36-1.12.66-2.41 1.28-1.3.62-2.78 1.03-1.48.41-2.87.59-1.4.17-2.64.2-1.25.02-2.43.28-1.17.27-2.38.67-1.21.41-2.28.79-1.06.38-2.32 1-1.26.62-2.26 1.06-1 .44-2.3 1.08-1.29.63-2.83 1.36-1.54.72-2.64 1.4-1.09.69-2.43 1.36-1.35.67-2.84 1.43-1.49.76-2.52 1.3-1.04.53-2.37 1.09-1.32.56-2.66 1.22-1.34.65-2.83 1.25-1.48.6-3.17 1.23-1.68.64-3.56 1.26-1.87.63-3.74 1.09-1.87.47-2.92.73-1.05.26-2.2.57-1.15.31-2.66.79-1.51.48-4.17 1.17-2.66.7-4.57 1.2-1.9.51-3.12.87-1.22.37-2.71.91-1.49.55-2.97 1.18-1.49.62-2.74 1.17-1.25.56-2.3 1.13-1.04.56-2.15 1.55-1.1.99-1.88 1.87-.78.88-1.64 2.05-.85 1.16-1.48 2.22-.63 1.06-1.23 2.56t-.84 2.88q-.24 1.39-.34 2.58-.1 1.19-.1 2.78v2.79q0 1.2-.03 2.35-.04 1.14-.34 2.21-.3 1.07-.46 2.15-.16 1.07-.53 2.18-.37 1.12-.6 2.22-.24 1.11-.5 2.18-.25 1.07-.66 2.58-.4 1.52-.85 2.91-.44 1.4-.83 2.57-.38 1.17-.81 2.36-.43 1.2-1.03 2.5-.61 1.29-1.15 2.25-.54.96-1.28 2.04-.73 1.07-1.57 2.01-.83.94-1.74 1.7-.9.76-1.82 1.33-.91.57-2.15 1-1.25.43-2.68.68-1.44.24-2.82.1-1.38-.14-2.52-.37-1.14-.22-2.17-.69-1.04-.47-2.07-1.05-1.03-.59-1.91-1.44-.89-.86-1.57-1.79t-1.3-1.85q-.63-.92-1.23-1.91-.61-1-1.3-2.06-.68-1.06-1.33-2.08-.66-1.03-1.22-1.99-.56-.97-1.23-1.94-.67-.97-1.59-2.1-.92-1.13-1.61-2-.69-.87-1.42-2-.72-1.12-1.22-2.19-.51-1.07-1.1-2.07-.58-1.01-1.47-2.13-.89-1.13-2.02-2.02-1.14-.89-2.37-.88-1.23 0-2.05.37-.81.38-1.06.46-.25.08-.51.1-.26.02-.52-.03-.26-.04-.5-.15-.24-.11-.45-.27-.21-.16-.37-.36-.16-.21-.27-.45-.11-.24-.16-.5-.05-.25-.04-.51.01-.26.09-.51t.21-.48q.13-.23.32-.41.18-.19.41-.33l.22-.14Z"/><text y="14.096" fill="#e03131" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(145.193 42.233)">c*g(n)</text><text y="14.096" fill="#1971c2" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(204.601 84.83)">f(n)</text><path fill="none" stroke="#f08c00" stroke-dasharray="8 9" stroke-linecap="round" stroke-width="1.5" d="M104.424 130.397c.09 17.45.11 86.97.52 104.34"/><text y="14.096" fill="#f08c00" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(111.47 225.146)">k</text><text y="14.096" fill="#1e1e1e" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(16.294 10)">f(n) = O(g(n))</text></svg>

> Normalmente, cuando hacemos análisis de algoritmos, la complejidad asíntótica se da para el **peor de los casos**, es decir, el rendimiento que tendría nuestro algoritmos si todas las condiciones que lo harían más eficiente **no** son favorables. 
> 
> De forma intuitiva se ve a que no aporta mucha información decir cómo de eficiente es un algoritmo cuando las condiciones son totalmente favorables. Por ejemplo, decir que nuestro algoritmo tiene complejidad constante $\Omicron(1)$ a la hora de ordenar un conjunto de datos porque la lista ya está previamente ordenada no aporta ningún valor puesto no podemos sacar información a partir de eso.

Una vez vista la idea general, pasemos a la **definición formal** y la repasamos:

$$
\Omicron(g(n)) = \set{f(n) : \exists c > 0, \exists k \geq 0 ( f(n) \leq c \cdot g(n) ) \space \forall n \geq k}
$$

La expresión anterior dice que $\Omicron(g(n))$ es el conjunto de funciones $f(n)$ para las cuales existen contantes $c$ y $k$ tal que $f(n)$ es menor o igual a una constante $c$ multiplicada por ese $g(n)$ para todo $n$ mayor que un $k$ dado. Normalmente "abusamos" de la notación y decimos que $f(n) = \Omicron(g(n))$ en realidad estamos diciendo que nuestro $f(n)$ pertecene a esa familia de funciones $g(n)$ porque existe una constante $c$ y un $k$ que satisface dicha desigualdad.

> Decir que $f(n) = \Omicron(g(n))$ es un uso poco ortodoxo matemáticamente hablando, ya que si $\Omicron(g(n))$ representa un conjunto de funciones lo normal sería decir que $f(n) \in \Omicron(g(n))$. Aún así hacer este uso de la notación tiene sus ventajas, ya que así podemos usar las notaciones asintóticas dentro de ecuaciones tradicionales, por ejemplo, diciendo $T(n) = T(\dfrac{n}{2}) + \Omicron(n)$

Pongamos un par de ejemplos prácticos para que se vea claramente: ¿ $x^2 + 2x + 1 = \Omicron(x^2)$ ?

Según la definición, debería haber una constante $c$ y un valor mínimo de $k$ tal que, multiplicar esa $c$ por $x^2$, *(nuestra $g(x)$)* hace que:  $x^2 + 2x + 1 \leq c \cdot x^2$ sea cierto para todo $x > k$. Un poco de álgebra y desarrollamos la desigualdad:

$$
\begin{align*} 
    x^2 + 2x + 1 \leq c \cdot x^2 \\
    \leq x^2 + 2x^2 + x^2 \\
    = 4x^2
\end{align*}     
$$

Pues ahí tenemos lo que buscamos, hemos encontrado un valor para $c=4$ y $k=1$ en este caso. Dado que esta notación representa un conjunto de funciones hay otros muchos valores para $c$ y $k$ que cumplen la desigualdad, pero lo importante es que **hay algún valor que cumple para todo $x$**. Simplemente encontrar un valor que satisfaga $c$ y $k$ *(a veces llamados **testigos**)* es suficiente.

De la misma forma podríamos demostrar lo contratario, que una función **no pertenece** a un conjunto de funciones. Por ejemplo, ¿ será cierto que $n^2 = \Omicron(n)$ ?

$$
\begin{align*} 
    n^2 \leq c \cdot n \\
    = n \cdot n \leq n \\ 
    = n \leq 1
\end{align*}     
$$

Dado que $n$ **crece sin límite**, no se cumple que **para todo $n$** esa condición se cumpla, ya que solo se cumple para $n=1$. Por tanto $n^2 \neq \Omicron(n)$.


## Notación $\Omega$
Todo lo que he contado para [$\Omicron(g(n))$](#notación-oomicrono-big-o) aplica para esta notación.

> La notación $\Omega(n)$ *(omega de n o **big-Omega**)* representa a una **cota inferior asintótica**. Es decir, para valores suficientemente grandes de $n$, la función $f(n)$ crece, **al menos**, como $g(n)$ dentro de un **factor constante**. Este hecho se representa como $f(n) = \Omega(g(n))$.

<svg xmlns="http://www.w3.org/2000/svg" width="263" height="255" class="asymptotic-graph"><defs><style>@font-face{font-family:Excalifont;src:url(data:font/woff2;base64,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)}</style></defs><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M11.523 43.899c.12 29.69.54 149.1.49 178.87m-2.01-180.16c.02 29.35 1.21 148.85 1.24 178.51"/><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M12.637 222.154c35.78.18 179.44 0 215.23-.22m-216.75-.73c35.59-.11 180.03-1.31 215.92-1.21"/><path fill="#1971c2" d="m13.425 184.774.69-.63q.69-.63 1.71-1.7 1.02-1.07 1.97-2.12t2.07-2.19q1.13-1.15 2.21-2.24 1.09-1.09 1.9-1.84.82-.74 1.61-1.5.79-.76 1.96-1.91 1.17-1.16 2.06-1.8.89-.63 2.19-1.24 1.3-.61 2.79-.91 1.48-.31 2.59-.45 1.1-.15 2.28-.28 1.18-.13 2.45-.14 1.28-.01 2.42-.01 1.14-.01 2.39-.12 1.25-.12 2.83-.76 1.57-.65 2.9-1.44 1.33-.79 2.95-1.96 1.62-1.16 3.77-2.71 2.15-1.54 3.56-2.5 1.42-.97 2.3-1.62.89-.64 2.4-1.61 1.51-.97 2.77-1.75 1.25-.79 2.28-1.54 1.03-.75 2.06-1.47 1.04-.72 2.09-1.54 1.06-.81 2.32-1.86 1.26-1.04 2.75-2.06 1.48-1.02 2.9-1.84 1.42-.82 3.1-2.01 1.69-1.2 3.1-2.24 1.41-1.04 2.85-2.06 1.44-1.01 2.38-1.95.94-.93 2.02-2.18 1.08-1.24 1.89-2.27.8-1.03 1.72-2.36.92-1.34 2.25-2.72 1.33-1.38 2.02-2.31.68-.92 2.22-2.87 1.54-1.95 2.66-3.26 1.11-1.31 2.51-2.95 1.4-1.64 2.98-3.34 1.57-1.71 2.95-2.94 1.37-1.23 2.53-2.16 1.16-.93 2.51-1.8 1.35-.88 2.75-1.63 1.41-.74 2.95-1.49 1.54-.75 2.53-1.16.99-.41 2.02-.79 1.02-.37 2.93-1.1 1.9-.74 2.99-1.21 1.1-.46 2.31-.93 1.21-.47 2.29-.96l2.36-1.08q1.29-.59 3.37-1.41l3.27-1.31q1.21-.48 3.2-1.22 1.99-.74 3.02-1.2 1.03-.45 2.51-.99 1.48-.53 2.97-1.09 1.5-.55 3.16-1.34 1.66-.78 2.82-1.43 1.17-.65 2.17-1.47.99-.82 1.94-1.8.96-.98 1.8-2.25.83-1.27 1.62-2.55.79-1.29 1.61-2.22.83-.94 1.73-1.8.9-.86 1.96-1.91 1.05-1.05 2.06-1.88 1-.83 2.09-1.52 1.08-.69 1.87-1.47t1.56-1.63q.77-.86 1.59-1.54.83-.69 1.67-1.51.84-.82 1.94-1.85 1.09-1.03 2.36-1.94 1.27-.91 2.46-1.77 1.19-.85 2.31-1.8 1.12-.95 2.31-1.86 1.2-.91 2.38-1.76 1.19-.84 2.48-1.79 1.28-.96 2.16-1.67.88-.72 1.75-1.38.87-.66 2.18-1.29 1.31-.64 2.77-1.3 1.47-.67 2.49-1.18 1.02-.52 2.06-.96 1.04-.44 1.63-.84.59-.39.72-.55.13-.17.31-.29.18-.11.38-.16.21-.06.42-.04.21.01.41.1.19.08.35.22.16.14.27.33.1.18.14.39.05.21.02.42-.03.21-.12.4-.09.19-.24.34-.15.15-.34.25-.19.09-.4.12-.21.03-.42 0-.21-.04-.4-.15-.18-.1-.33-.26-.14-.15-.22-.35-.09-.19-.11-.41-.02-.21.03-.41.05-.21.17-.39.11-.18.28-.31.16-.14.36-.21.2-.08.41-.08.21-.01.42.05.2.06.37.18.18.13.3.3.13.17.19.37.06.21.06.42-.01.21-.08.41l-.07.2-1.08 1.77q-1.08 1.77-2.28 2.41-1.19.64-2.26 1.13-1.07.49-2.16.98-1.08.5-2.23 1.08-1.16.59-2.09 1.37-.94.79-2 1.59-1.06.79-2.35 1.73-1.28.94-2.53 1.84-1.26.9-2.29 1.74-1.03.83-2.39 1.9-1.37 1.07-2.48 1.81-1.11.73-2.05 1.52-.93.8-2.09 1.95-1.16 1.14-2.1 1.92-.94.78-1.77 1.7-.84.92-1.97 2-1.13 1.09-2.46 1.95-1.33.87-2.3 1.78-.98.91-2.05 1.97-1.08 1.05-2.01 2-.92.95-1.72 2.25-.8 1.3-1.9 2.89-1.09 1.59-2.22 2.72-1.12 1.14-2.37 2.14-1.25.99-2.56 1.72t-3.16 1.61q-1.86.87-3.43 1.45-1.56.58-2.88 1.05-1.33.48-2.51.99-1.18.52-3.09 1.23t-3.17 1.21l-3.17 1.26q-1.91.76-3.22 1.36-1.3.6-2.49 1.13-1.18.53-2.33.97-1.14.45-2.32.95-1.19.5-3.11 1.24l-3.81 1.48q-1.89.73-3.36 1.44-1.46.72-2.71 1.38-1.25.67-2.36 1.39-1.12.71-2.27 1.63-1.15.92-2.33 1.98-1.19 1.07-2.63 2.63-1.44 1.56-2.85 3.21l-2.47 2.89q-1.06 1.25-2.57 3.16-1.52 1.92-2.39 3.06-.88 1.14-1.81 2.09-.94.95-1.64 1.86-.7.9-1.59 2.17-.89 1.28-1.76 2.28-.87 1.01-1.64 1.89-.77.89-1.97 2.04t-2.66 2.19q-1.47 1.04-2.84 2.05-1.37 1.01-2.28 1.67-.91.65-1.9 1.33-.99.68-2.3 1.43-1.32.76-2.58 1.61-1.26.86-2.56 1.93-1.29 1.07-2.52 2.01-1.22.94-2.14 1.58-.93.65-2.08 1.48-1.15.84-2.44 1.65-1.3.81-2.67 1.68-1.37.88-2.3 1.56-.94.67-2.32 1.62-1.39.95-3.51 2.47-2.12 1.51-2.99 2.15-.87.64-2.54 1.77-1.68 1.12-3.1 1.84-1.42.72-2.99 1.25-1.58.53-3.1.66-1.53.13-2.92.13t-2.56.02q-1.17.02-2.42.17-1.25.14-2.32.29-1.06.16-2.54.73t-2.39 1.31q-.91.73-2.07 1.87-1.16 1.14-2.33 2.23-1.18 1.08-2.26 2.17-1.09 1.09-2.18 2.2t-2.06 2.18q-.98 1.08-2.09 2.24-1.12 1.15-1.81 1.78-.7.63-.91.78-.22.16-.46.25-.25.1-.51.13-.26.04-.51.01-.26-.03-.51-.12t-.46-.24q-.22-.14-.4-.34-.18-.19-.3-.42-.13-.24-.19-.49-.07-.26-.07-.52-.01-.25.05-.51.06-.25.18-.49.12-.23.3-.43l.17-.2Z"/><path fill="#e03131" d="m15.737 160.095.82-.38q.81-.37 1.96-.68 1.16-.3 2.75-.11 1.6.19 2.99 1.05 1.39.85 2.38 1.73.98.87 1.84 2.04.86 1.18 1.55 2.35.69 1.17 1.24 2.33.55 1.15 1.32 2.3t1.48 1.99q.7.83 1.52 1.86.82 1.02 1.43 1.93.61.9 1.23 1.98.62 1.07 1.48 2.39.86 1.31 1.46 2.35.6 1.03 1.18 1.93.58.89 1.4 2.04.83 1.14 1.71 1.97.89.82 1.91 1.32 1.02.51 2.38.81 1.35.31 2.74.25 1.39-.06 2.52-.51 1.14-.46 2.19-1.17 1.05-.72 1.76-1.63.72-.9 1.36-1.84.64-.95 1.2-1.91.56-.96 1.03-2.08.47-1.13.84-2.17.38-1.03.8-2.27.42-1.25.81-2.59.39-1.34.75-2.65.36-1.32.68-2.61.31-1.29.55-2.35.24-1.06.57-2.25.33-1.18.63-2.31.3-1.13.33-2.29.03-1.17.03-2.37v-2.79q0-1.59.1-2.85.1-1.25.27-2.45.17-1.21.47-2.44.31-1.23.84-2.47.54-1.23 1.3-2.56.76-1.32 1.44-2.32.67-1.01 1.52-1.95.84-.93 1.84-1.97t2.43-2.14q1.43-1.09 2.86-1.79 1.42-.7 2.86-1.28 1.43-.59 2.99-1.19 1.56-.6 2.92-1.1 1.36-.49 3-.98 1.65-.49 2.81-.76 1.15-.26 3.71-.93 2.55-.66 3.99-1.12 1.44-.46 2.67-.8 1.24-.33 2.34-.61 1.1-.27 2.96-.73 1.87-.47 3.54-1.03 1.68-.57 3.28-1.17 1.59-.6 3.02-1.17 1.42-.58 2.68-1.2 1.26-.61 2.69-1.22t3.11-1.48q1.67-.87 3.08-1.57 1.4-.71 2.39-1.29 1-.58 2.19-1.25 1.19-.66 2.4-1.2 1.21-.54 2.52-1.18 1.31-.65 2.43-1.17 1.12-.52 2.18-1.02 1.07-.51 2.44-1.01 1.37-.5 2.58-.9 1.21-.41 2.38-.66 1.17-.26 2.28-.38 1.1-.12 2.31-.21 1.2-.1 2.5-.31t2.46-.71q1.16-.5 2.23-1.1 1.06-.61 2.14-1.39l2.26-1.61q1.19-.83 2.17-1.57.98-.74 1.86-1.43.88-.69 1.84-1.42.95-.73 2.16-1.44 1.2-.71 2.28-1.06 1.07-.36 2.11-.77 1.04-.42 2.05-1.09 1-.68 2.13-1.69 1.13-1.02 2-1.81.87-.8 1.72-1.82t1.65-2.03q.79-1 1.62-1.84.83-.84 1.76-1.9.92-1.06 1.74-2.02.82-.95 1.94-2t2.28-2.04q1.16-1 2.28-1.71 1.13-.71 2.26-1.44 1.13-.72 2.65-1.51 1.52-.8 2.76-1.23 1.24-.44 2.94-1.2 1.7-.75 2.91-1.31 1.2-.55 2.25-.97 1.05-.42 2.27-.79 1.22-.38 2.68-.88 1.45-.5 2.9-.85 1.44-.36 2.91-.72 1.48-.36 2.81-.6 1.34-.25 2.68-.39 1.34-.13 2.52-.16 1.18-.02 1.85-.46.68-.44.78-.63.1-.18.26-.33.15-.14.35-.23.19-.09.4-.11.21-.02.42.02.21.05.39.16.18.11.32.28.13.16.21.36.08.2.09.41.01.21-.05.41-.06.21-.18.38-.12.18-.29.31-.17.12-.37.19-.21.07-.42.06-.21 0-.41-.07-.2-.07-.37-.2-.17-.13-.29-.3-.11-.18-.17-.38-.05-.21-.04-.42.01-.21.09-.41.08-.2.22-.36.14-.16.32-.27.19-.11.39-.15.21-.04.42-.02.21.03.41.12.19.09.34.23.15.15.25.34.1.19.13.4.04.21 0 .42l-.04.21-1.59 2.19q-1.6 2.19-2.66 2.2-1.07.01-2.33.13-1.26.11-2.48.3-1.21.19-2.87.6-1.66.4-2.94.72-1.28.31-2.64.79-1.37.47-2.97 1.01t-2.72 1.02q-1.12.48-2.37.97-1.25.5-2.4 1.06-1.15.57-2.21.93-1.06.37-2.33 1.02-1.26.64-2.38 1.36-1.11.71-2.05 1.29-.95.57-1.97 1.44t-2.05 1.83q-1.03.96-1.81 1.86-.77.9-1.54 1.77-.78.87-1.7 1.83-.93.97-1.75 2.01-.83 1.05-1.75 2.14-.91 1.1-2.05 2.15-1.14 1.05-2.05 1.87-.91.83-1.82 1.5t-2.07 1.33q-1.16.66-2.43 1.09-1.28.43-2.42.96-1.14.54-2.16 1.32-1.02.78-2.17 1.73-1.14.95-2.07 1.57-.93.62-2.07 1.4-1.14.78-2.06 1.47-.92.69-2.03 1.36-1.12.66-2.41 1.28-1.3.62-2.78 1.03-1.48.41-2.87.59-1.4.17-2.64.2-1.25.02-2.43.28-1.17.27-2.38.67-1.21.41-2.28.79-1.06.38-2.32 1-1.26.62-2.26 1.06-1 .44-2.3 1.08-1.29.63-2.83 1.36-1.54.72-2.64 1.4-1.09.69-2.43 1.36-1.35.67-2.84 1.43-1.49.76-2.52 1.3-1.04.53-2.37 1.09-1.32.56-2.66 1.22-1.34.65-2.83 1.25-1.48.6-3.17 1.23-1.68.64-3.56 1.26-1.87.63-3.74 1.09-1.87.47-2.92.73-1.05.26-2.2.57-1.15.31-2.66.79-1.51.48-4.17 1.17-2.66.7-4.57 1.2-1.9.51-3.12.87-1.22.37-2.71.91-1.49.55-2.97 1.18-1.49.62-2.74 1.17-1.25.56-2.3 1.13-1.04.56-2.15 1.55-1.1.99-1.88 1.87-.78.88-1.64 2.05-.85 1.16-1.48 2.22-.63 1.06-1.23 2.56t-.84 2.88q-.24 1.39-.34 2.58-.1 1.19-.1 2.78v2.79q0 1.2-.03 2.35-.04 1.14-.34 2.21-.3 1.07-.46 2.15-.16 1.07-.53 2.18-.37 1.12-.6 2.22-.24 1.11-.5 2.18-.25 1.07-.66 2.58-.4 1.52-.85 2.91-.44 1.4-.83 2.57-.38 1.17-.81 2.36-.43 1.2-1.03 2.5-.61 1.29-1.15 2.25-.54.96-1.28 2.04-.73 1.07-1.57 2.01-.83.94-1.74 1.7-.9.76-1.82 1.33-.91.57-2.15 1-1.25.43-2.68.68-1.44.24-2.82.1-1.38-.14-2.52-.37-1.14-.22-2.17-.69-1.04-.47-2.07-1.05-1.03-.59-1.91-1.44-.89-.86-1.57-1.79t-1.3-1.85q-.63-.92-1.23-1.91-.61-1-1.3-2.06-.68-1.06-1.33-2.08-.66-1.03-1.22-1.99-.56-.97-1.23-1.94-.67-.97-1.59-2.1-.92-1.13-1.61-2-.69-.87-1.42-2-.72-1.12-1.22-2.19-.51-1.07-1.1-2.07-.58-1.01-1.47-2.13-.89-1.13-2.02-2.02-1.14-.89-2.37-.88-1.23 0-2.05.37-.81.38-1.06.46-.25.08-.51.1-.26.02-.52-.03-.26-.04-.5-.15-.24-.11-.45-.27-.21-.16-.37-.36-.16-.21-.27-.45-.11-.24-.16-.5-.05-.25-.04-.51.01-.26.09-.51t.21-.48q.13-.23.32-.41.18-.19.41-.33l.22-.14Z"/><text y="14.096" fill="#e03131" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(206.184 79.704)">c*g(n)</text><text y="14.096" fill="#1971c2" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(189.653 18.97)">f(n)</text><path fill="none" stroke="#f08c00" stroke-dasharray="8 9" stroke-linecap="round" stroke-width="1.5" d="M104.424 130.397c.09 17.45.11 86.97.52 104.34"/><text y="14.096" fill="#f08c00" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(111.47 225.146)">k</text><text y="14.096" fill="#1e1e1e" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(16.294 10)">f(n) = Ω(g(n))</text></svg>

$$
\Omega(g(n)) = \set{f(n) : \exists c > 0, \exists k \geq 0 ( f(n) \geq c \cdot g(n) ) \space \forall n \geq k}
$$

Para practicar, vamos a usar el mismo ejemplo de arriba: ¿ será $x^2 + 2x + 1 = \Omega(x^2)$ ?

Como antes, debemos encontrar valores para $c$ y $k$ que cumplan, así que usemos la definición y veamos si algebráicamente podemos adaptar el resultado:

$$
\begin{align*} 
    x^2 + 2x + 1 \geq c \cdot x^2 \\
\end{align*}
$$

Si tomamos $c=1$ y restamos $x^2$ a ambos miembros:

$$
    2x + 1 \geq 0 \medspace \medspace \medspace 
$$

Resolvemos para $x$

$$    
    x \geq -\dfrac{1}{2}
$$

Y ya lo tendríamos. Para $x \geq -\dfrac{1}{2}$, eligiendo valores $c=1$ y $k \geq 1$ tendríamos que la desigualdad se cumple para todo $x \geq k$. Concluimos por tanto que $x^2 + 2x + 1 = \Omega(x^2)$.

## Notación $\Theta$

Por último presentamos la notación $\Theta$, que es una mezcla de las dos anteriores: 

> $\Theta(n)$ *(theta de n o **big-Theta**)* es una notación que representa una **cota ajustada**, tanto "por arriba" como "por abajo". Es decir, si decimos que una función $f(n)$ = $\Theta(n^2)$ implica que la función $f(n)$ se comporta **igual** que $g(n)$ *(asintóticamente hablando)* a medida que el número de datos de entrada aumenta.

<span class="whisper">Si has visto o recuerdas algo de cálculo, quizá las dos funciones anteriores te recuerden a los límites de una función cuando se aproximan por izquierda y por derecha (salvando las distancias). Pues esta notación sería como el teorema del sándwich. </span>

<svg class="asymptotic-graph" xmlns="http://www.w3.org/2000/svg" width="273.838" height="257.577"><defs><style>@font-face{font-family:Excalifont;src:url(data:font/woff2;base64,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)}@font-face{font-family:Excalifont;src:url(data:font/woff2;base64,d09GMgABAAAAAALoAA0AAAAABUQAAAKYAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3AcNAZgADQRCAqBZIFfCwYAATYCJAMIBCAFgxgHIBtYBMiuBmzXGiFOGsUoFinmGr2+w4esH55T4wHaH/Vm5h/MRDESSA4JbMu8m0716v2/9msP82SyqO0d4hK/6cmeh4JrEs8MyRNkMkPo4jq54gMnFPk1QG//G4Cfem8j2Ayuq37/qZv89iCr81+ixTQWSJdIOJZYYAF2gSY8FvkC6gLTdHPNouDagpgMQyyvH1FAVd3U8R01pmcE4lZ6iAZxawmvQtwm2m6COL7wIRIbVxMTBJKaTFSDyqL6Km3F8WpDiDByhXrARkkRcAcMZ3FWOK+CyvFknAdMZGdYAvsHZD9bGTWzvQ/u0/V0PW39f1KFtDVsbQ1wD8LROA9oLRARCfX5CFR9tQayeCBdz3P7z63nBQh5LoIIMiRMBlYCkAFSo0atls9+Lvn0gdJSnOrwWGzX/s8qqjrnR+l+KA2fnrwMPtn+qUiaO68fivmu40WjvYnXqp16H3LlS4Mr748jzxtv91t/ehUVvP74KCG77uARWUoGV++hX+402jrwbeWA8pXx5irVdb1kVENJmYmCzcsm8iL2+i8Na+6T3LN6fL1606hCayTJazXuT2/q/Vrn5svE6HEfjeCKryqVL7v/kPkwv2zN/otRVBb1+xgICKxv/elFDPoH0k8o29G1BYDyh+/KD1/2O+sPVBZB4NlBhboDVIMAR8a0Qmv8qy8vRKUqgoggYBgAVLKAj5BVwSbPxYL6bllU0yuWdDXJMu0xrIIh0reuqD0wmhuLppEJzEzsCgzhiRw0NGIMj7CRmZkgJQoV+xdXa6fxsJDYIAaFMCSbAYaVy1nXQeW1/i2GtetTLZWtfjSb+VYLD0Imktgh2Vg5EKwYZoQwPJB6JoeguRRCGmk0SLdtzeQJ+Ec58TiFfIC8CgAA)}</style></defs><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M11.523 46.33c.12 29.69.54 149.1.49 178.87m-2.01-180.16c.02 29.35 1.21 148.85 1.24 178.51"/><path fill="none" stroke="#1e1e1e" stroke-linecap="round" d="M12.637 224.584c35.78.18 179.44 0 215.23-.22m-216.75-.73c35.59-.11 180.03-1.31 215.92-1.21"/><path fill="#1971c2" d="m12.425 187.204.69-.63q.69-.63 1.71-1.7 1.02-1.07 1.97-2.12t2.07-2.19q1.13-1.15 2.21-2.24 1.09-1.09 1.9-1.84.82-.74 1.61-1.5.79-.76 1.96-1.91 1.17-1.16 2.06-1.8.89-.63 2.19-1.24 1.3-.61 2.79-.91 1.48-.31 2.59-.45 1.1-.15 2.28-.28 1.18-.13 2.45-.14 1.28-.01 2.42-.01 1.14-.01 2.39-.12 1.25-.12 2.83-.76 1.57-.65 2.9-1.44 1.33-.79 2.95-1.96 1.62-1.16 3.77-2.71 2.15-1.54 3.56-2.5 1.42-.97 2.3-1.62.89-.64 2.4-1.61 1.51-.97 2.77-1.75 1.25-.79 2.28-1.54 1.03-.75 2.06-1.47 1.04-.72 2.09-1.54 1.06-.81 2.32-1.86 1.26-1.04 2.75-2.06 1.48-1.02 2.9-1.84 1.42-.82 3.1-2.01 1.69-1.2 3.1-2.24 1.41-1.04 2.85-2.06 1.44-1.01 2.38-1.95.94-.93 2.02-2.18 1.08-1.24 1.89-2.27.8-1.03 1.72-2.36.92-1.34 2.25-2.72 1.33-1.38 2.02-2.31.68-.92 2.22-2.87 1.54-1.95 2.66-3.26 1.11-1.31 2.51-2.95 1.4-1.64 2.98-3.34 1.57-1.71 2.95-2.94 1.37-1.23 2.53-2.16 1.16-.93 2.51-1.8 1.35-.88 2.75-1.63 1.41-.74 2.95-1.49 1.54-.75 2.53-1.16.99-.41 2.02-.79 1.02-.37 2.93-1.1 1.9-.74 2.99-1.21 1.1-.46 2.31-.93 1.21-.47 2.29-.96l2.36-1.08q1.29-.59 3.37-1.41l3.27-1.31q1.21-.48 3.2-1.22 1.99-.74 3.02-1.2 1.03-.45 2.51-.99 1.48-.53 2.97-1.09 1.5-.55 3.16-1.34 1.66-.78 2.82-1.43 1.17-.65 2.17-1.47.99-.82 1.94-1.8.96-.98 1.8-2.25.83-1.27 1.62-2.55.79-1.29 1.61-2.22.83-.94 1.73-1.8.9-.86 1.96-1.91 1.05-1.05 2.06-1.88 1-.83 2.09-1.52 1.08-.69 1.87-1.47t1.56-1.63q.77-.86 1.59-1.54.83-.69 1.67-1.51.84-.82 1.94-1.85 1.09-1.03 2.36-1.94 1.27-.91 2.46-1.77 1.19-.85 2.31-1.8 1.12-.95 2.31-1.86 1.2-.91 2.38-1.76 1.19-.84 2.48-1.79 1.28-.96 2.16-1.67.88-.72 1.75-1.38.87-.66 2.18-1.29 1.31-.64 2.77-1.3 1.47-.67 2.49-1.18 1.02-.52 2.06-.96 1.04-.44 1.63-.84.59-.39.72-.55.13-.17.31-.29.18-.11.38-.16.21-.06.42-.04.21.01.41.1.19.08.35.22.16.14.27.33.1.18.14.39.05.21.02.42-.03.21-.12.4-.09.19-.24.34-.15.15-.34.25-.19.09-.4.12-.21.03-.42 0-.21-.04-.4-.15-.18-.1-.33-.26-.14-.15-.22-.35-.09-.19-.11-.41-.02-.21.03-.41.05-.21.17-.39.11-.18.28-.31.16-.14.36-.21.2-.08.41-.08.21-.01.42.05.2.06.37.18.18.13.3.3.13.17.19.37.06.21.06.42-.01.21-.08.41l-.07.2-1.08 1.77q-1.08 1.77-2.28 2.41-1.19.64-2.26 1.13-1.07.49-2.16.98-1.08.5-2.23 1.08-1.16.59-2.09 1.37-.94.79-2 1.59-1.06.79-2.35 1.73-1.28.94-2.53 1.84-1.26.9-2.29 1.74-1.03.83-2.39 1.9-1.37 1.07-2.48 1.81-1.11.73-2.05 1.52-.93.8-2.09 1.95-1.16 1.14-2.1 1.92-.94.78-1.77 1.7-.84.92-1.97 2-1.13 1.09-2.46 1.95-1.33.87-2.3 1.78-.98.91-2.05 1.97-1.08 1.05-2.01 2-.92.95-1.72 2.25-.8 1.3-1.9 2.89-1.09 1.59-2.22 2.72-1.12 1.14-2.37 2.14-1.25.99-2.56 1.72t-3.16 1.61q-1.86.87-3.43 1.45-1.56.58-2.88 1.05-1.33.48-2.51.99-1.18.52-3.09 1.23t-3.17 1.21l-3.17 1.26q-1.91.76-3.22 1.36-1.3.6-2.49 1.13-1.18.53-2.33.97-1.14.45-2.32.95-1.19.5-3.11 1.24l-3.81 1.48q-1.89.73-3.36 1.44-1.46.72-2.71 1.38-1.25.67-2.36 1.39-1.12.71-2.27 1.63-1.15.92-2.33 1.98-1.19 1.07-2.63 2.63-1.44 1.56-2.85 3.21l-2.47 2.89q-1.06 1.25-2.57 3.16-1.52 1.92-2.39 3.06-.88 1.14-1.81 2.09-.94.95-1.64 1.86-.7.9-1.59 2.17-.89 1.28-1.76 2.28-.87 1.01-1.64 1.89-.77.89-1.97 2.04t-2.66 2.19q-1.47 1.04-2.84 2.05-1.37 1.01-2.28 1.67-.91.65-1.9 1.33-.99.68-2.3 1.43-1.32.76-2.58 1.61-1.26.86-2.56 1.93-1.29 1.07-2.52 2.01-1.22.94-2.14 1.58-.93.65-2.08 1.48-1.15.84-2.44 1.65-1.3.81-2.67 1.68-1.37.88-2.3 1.56-.94.67-2.32 1.62-1.39.95-3.51 2.47-2.12 1.51-2.99 2.15-.87.64-2.54 1.77-1.68 1.12-3.1 1.84-1.42.72-2.99 1.25-1.58.53-3.1.66-1.53.13-2.92.13t-2.56.02q-1.17.02-2.42.17-1.25.14-2.32.29-1.06.16-2.54.73t-2.39 1.31q-.91.73-2.07 1.87-1.16 1.14-2.33 2.23-1.18 1.08-2.26 2.17-1.09 1.09-2.18 2.2t-2.06 2.18q-.98 1.08-2.09 2.24-1.12 1.15-1.81 1.78-.7.63-.91.78-.22.16-.46.25-.25.1-.51.13-.26.04-.51.01-.26-.03-.51-.12t-.46-.24q-.22-.14-.4-.34-.18-.19-.3-.42-.13-.24-.19-.49-.07-.26-.07-.52-.01-.25.05-.51.06-.25.18-.49.12-.23.3-.43l.17-.2Z"/><path fill="#e03131" d="m13.737 162.526.82-.38q.81-.37 1.96-.68 1.16-.3 2.75-.11 1.6.19 2.99 1.05 1.39.85 2.38 1.73.98.87 1.84 2.04.86 1.18 1.55 2.35.69 1.17 1.24 2.33.55 1.15 1.32 2.3t1.48 1.99q.7.83 1.52 1.86.82 1.02 1.43 1.93.61.9 1.23 1.98.62 1.07 1.48 2.39.86 1.31 1.46 2.35.6 1.03 1.18 1.93.58.89 1.4 2.04.83 1.14 1.71 1.97.89.82 1.91 1.32 1.02.51 2.38.81 1.35.31 2.74.25 1.39-.06 2.52-.51 1.14-.46 2.19-1.17 1.05-.72 1.76-1.63.72-.9 1.36-1.84.64-.95 1.2-1.91.56-.96 1.03-2.08.47-1.13.84-2.17.38-1.03.8-2.27.42-1.25.81-2.59.39-1.34.75-2.65.36-1.32.68-2.61.31-1.29.55-2.35.24-1.06.57-2.25.33-1.18.63-2.31.3-1.13.33-2.29.03-1.17.03-2.37v-2.79q0-1.59.1-2.85.1-1.25.27-2.45.17-1.21.47-2.44.31-1.23.84-2.47.54-1.23 1.3-2.56.76-1.32 1.44-2.32.67-1.01 1.52-1.95.84-.93 1.84-1.97t2.43-2.14q1.43-1.09 2.86-1.79 1.42-.7 2.86-1.28 1.43-.59 2.99-1.19 1.56-.6 2.92-1.1 1.36-.49 3-.98 1.65-.49 2.81-.76 1.15-.26 3.71-.93 2.55-.66 3.99-1.12 1.44-.46 2.67-.8 1.24-.33 2.34-.61 1.1-.27 2.96-.73 1.87-.47 3.54-1.03 1.68-.57 3.28-1.17 1.59-.6 3.02-1.17 1.42-.58 2.68-1.2 1.26-.61 2.69-1.22t3.11-1.48q1.67-.87 3.08-1.57 1.4-.71 2.39-1.29 1-.58 2.19-1.25 1.19-.66 2.4-1.2 1.21-.54 2.52-1.18 1.31-.65 2.43-1.17 1.12-.52 2.18-1.02 1.07-.51 2.44-1.01 1.37-.5 2.58-.9 1.21-.41 2.38-.66 1.17-.26 2.28-.38 1.1-.12 2.31-.21 1.2-.1 2.5-.31t2.46-.71q1.16-.5 2.23-1.1 1.06-.61 2.14-1.39l2.26-1.61q1.19-.83 2.17-1.57.98-.74 1.86-1.43.88-.69 1.84-1.42.95-.73 2.16-1.44 1.2-.71 2.28-1.06 1.07-.36 2.11-.77 1.04-.42 2.05-1.09 1-.68 2.13-1.69 1.13-1.02 2-1.81.87-.8 1.72-1.82t1.65-2.03q.79-1 1.62-1.84.83-.84 1.76-1.9.92-1.06 1.74-2.02.82-.95 1.94-2t2.28-2.04q1.16-1 2.28-1.71 1.13-.71 2.26-1.44 1.13-.72 2.65-1.51 1.52-.8 2.76-1.23 1.24-.44 2.94-1.2 1.7-.75 2.91-1.31 1.2-.55 2.25-.97 1.05-.42 2.27-.79 1.22-.38 2.68-.88 1.45-.5 2.9-.85 1.44-.36 2.91-.72 1.48-.36 2.81-.6 1.34-.25 2.68-.39 1.34-.13 2.52-.16 1.18-.02 1.85-.46.68-.44.78-.63.1-.18.26-.33.15-.14.35-.23.19-.09.4-.11.21-.02.42.02.21.05.39.16.18.11.32.28.13.16.21.36.08.2.09.41.01.21-.05.41-.06.21-.18.38-.12.18-.29.31-.17.12-.37.19-.21.07-.42.06-.21 0-.41-.07-.2-.07-.37-.2-.17-.13-.29-.3-.11-.18-.17-.38-.05-.21-.04-.42.01-.21.09-.41.08-.2.22-.36.14-.16.32-.27.19-.11.39-.15.21-.04.42-.02.21.03.41.12.19.09.34.23.15.15.25.34.1.19.13.4.04.21 0 .42l-.04.21-1.59 2.19q-1.6 2.19-2.66 2.2-1.07.01-2.33.13-1.26.11-2.48.3-1.21.19-2.87.6-1.66.4-2.94.72-1.28.31-2.64.79-1.37.47-2.97 1.01t-2.72 1.02q-1.12.48-2.37.97-1.25.5-2.4 1.06-1.15.57-2.21.93-1.06.37-2.33 1.02-1.26.64-2.38 1.36-1.11.71-2.05 1.29-.95.57-1.97 1.44t-2.05 1.83q-1.03.96-1.81 1.86-.77.9-1.54 1.77-.78.87-1.7 1.83-.93.97-1.75 2.01-.83 1.05-1.75 2.14-.91 1.1-2.05 2.15-1.14 1.05-2.05 1.87-.91.83-1.82 1.5t-2.07 1.33q-1.16.66-2.43 1.09-1.28.43-2.42.96-1.14.54-2.16 1.32-1.02.78-2.17 1.73-1.14.95-2.07 1.57-.93.62-2.07 1.4-1.14.78-2.06 1.47-.92.69-2.03 1.36-1.12.66-2.41 1.28-1.3.62-2.78 1.03-1.48.41-2.87.59-1.4.17-2.64.2-1.25.02-2.43.28-1.17.27-2.38.67-1.21.41-2.28.79-1.06.38-2.32 1-1.26.62-2.26 1.06-1 .44-2.3 1.08-1.29.63-2.83 1.36-1.54.72-2.64 1.4-1.09.69-2.43 1.36-1.35.67-2.84 1.43-1.49.76-2.52 1.3-1.04.53-2.37 1.09-1.32.56-2.66 1.22-1.34.65-2.83 1.25-1.48.6-3.17 1.23-1.68.64-3.56 1.26-1.87.63-3.74 1.09-1.87.47-2.92.73-1.05.26-2.2.57-1.15.31-2.66.79-1.51.48-4.17 1.17-2.66.7-4.57 1.2-1.9.51-3.12.87-1.22.37-2.71.91-1.49.55-2.97 1.18-1.49.62-2.74 1.17-1.25.56-2.3 1.13-1.04.56-2.15 1.55-1.1.99-1.88 1.87-.78.88-1.64 2.05-.85 1.16-1.48 2.22-.63 1.06-1.23 2.56t-.84 2.88q-.24 1.39-.34 2.58-.1 1.19-.1 2.78v2.79q0 1.2-.03 2.35-.04 1.14-.34 2.21-.3 1.07-.46 2.15-.16 1.07-.53 2.18-.37 1.12-.6 2.22-.24 1.11-.5 2.18-.25 1.07-.66 2.58-.4 1.52-.85 2.91-.44 1.4-.83 2.57-.38 1.17-.81 2.36-.43 1.2-1.03 2.5-.61 1.29-1.15 2.25-.54.96-1.28 2.04-.73 1.07-1.57 2.01-.83.94-1.74 1.7-.9.76-1.82 1.33-.91.57-2.15 1-1.25.43-2.68.68-1.44.24-2.82.1-1.38-.14-2.52-.37-1.14-.22-2.17-.69-1.04-.47-2.07-1.05-1.03-.59-1.91-1.44-.89-.86-1.57-1.79t-1.3-1.85q-.63-.92-1.23-1.91-.61-1-1.3-2.06-.68-1.06-1.33-2.08-.66-1.03-1.22-1.99-.56-.97-1.23-1.94-.67-.97-1.59-2.1-.92-1.13-1.61-2-.69-.87-1.42-2-.72-1.12-1.22-2.19-.51-1.07-1.1-2.07-.58-1.01-1.47-2.13-.89-1.13-2.02-2.02-1.14-.89-2.37-.88-1.23 0-2.05.37-.81.38-1.06.46-.25.08-.51.1-.26.02-.52-.03-.26-.04-.5-.15-.24-.11-.45-.27-.21-.16-.37-.36-.16-.21-.27-.45-.11-.24-.16-.5-.05-.25-.04-.51.01-.26.09-.51t.21-.48q.13-.23.32-.41.18-.19.41-.33l.22-.14Z"/><text y="14.096" fill="#e03131" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(205.39 81.713)">c2g(n)</text><text y="14.096" fill="#1971c2" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(189.653 21.4)">f(n)</text><path fill="none" stroke="#f08c00" stroke-dasharray="8 9" stroke-linecap="round" stroke-width="1.5" d="M104.307 91.332c.11 24.36.21 121.55.63 145.83"/><text y="14.096" fill="#f08c00" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(111.47 227.577)">k</text><text y="14.096" fill="#1e1e1e" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(16.294 12.43)">f(n) = Θ(g(n))</text><text y="14.096" fill="#2f9e44" dominant-baseline="alphabetic" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="16" style="white-space:pre" transform="translate(80.071 45.359)">c1g(n)</text><path fill="#2f9e44" d="m11.225 159.487.66-.56q.66-.55 1.75-1.07 1.09-.52 2.8-.2 1.72.32 2.92 1.63 1.21 1.31 1.98 2.57.78 1.26 1.42 2.89.65 1.62 1.18 3.27.53 1.66.96 3.31.44 1.66.88 2.9t1.06 2.71q.63 1.47 1.22 2.76.59 1.29 1.06 2.41.46 1.13.87 2.33.41 1.2.87 2.69t1.01 2.97q.54 1.48 1 2.95.47 1.47.95 2.83.48 1.37.92 2.41.43 1.03.83 2.06.4 1.04 1.01 2.02.61.97 1.58 1.8.96.83 2.13 1.08 1.17.25 2.26-.4 1.09-.65 1.93-1.7.84-1.05 1.35-2.1.51-1.05.95-2.16.44-1.11.81-2.3.37-1.18.74-2.35.38-1.17.64-2.35.26-1.17.43-2.26.17-1.1.44-2.15.27-1.05.43-2.14.16-1.09.41-2.44.26-1.36.44-2.5.17-1.15.37-2.33.2-1.19.37-2.7.18-1.51.34-2.61.17-1.1.35-2.61.18-1.5.38-2.62.19-1.11.29-2.28.1-1.17.27-2.37.17-1.21.27-2.31.1-1.11.1-2.19v-5.64q0-1.49.05-3.14.06-1.64.14-3.42.08-1.78.24-3.41.16-1.63.53-3.47.37-1.84.86-3.61.49-1.78.93-3.16.44-1.37 1.11-2.91.66-1.54 1.27-2.79t1.66-3.01q1.06-1.76 2.31-3.08 1.25-1.33 2.38-2.23 1.12-.91 2.27-1.79t2.4-1.73q1.25-.85 2.46-1.51 1.2-.66 2.85-1.46 1.65-.8 3.66-1.75 2.02-.96 3.15-1.62 1.13-.66 2.15-1.17 1.02-.51 2.68-1.26 1.67-.76 3.02-1.46t2.63-1.51q1.28-.81 2.57-1.73 1.28-.92 2.77-2.21 1.5-1.29 2.66-2.19 1.16-.91 2.48-2.16 1.33-1.26 2.46-2.3 1.13-1.04 1.91-1.88.79-.83 1.75-1.82.96-.98 1.95-1.79.99-.8 2.05-1.75 1.05-.94 1.92-1.68.88-.74 1.75-1.5.87-.75 2.03-1.52 1.16-.78 2.13-1.38.98-.59 2.1-1.03 1.12-.43 2.37-.62 1.25-.2 2.43-.43 1.19-.23 2.35-1.07 1.17-.83 1.99-1.7.83-.87 1.72-2.02l1.55-2.02q.67-.86 1.5-1.85.83-.98 1.66-2.27t1.56-2.31q.73-1.01 1.55-2.03.82-1.02 2.05-1.83 1.22-.81 2.2-1.58.97-.76 1.69-1.76.72-.99 1.49-2.26.77-1.27 1.49-2.48.73-1.21 1.42-2.73t1.33-3q.65-1.48 1.28-2.65.63-1.16 1.4-2.76.77-1.6 1.42-2.99.65-1.38 1.23-2.35.59-.97 1.35-2.26.77-1.3 1.78-2.6 1.01-1.31 1.79-2.24.78-.92 1.92-2.16 1.14-1.23 2.34-2.13 1.2-.89 2.3-1.83 1.11-.93 2.21-1.74 1.1-.8 2.12-1.59 1.03-.8 2.03-1.41.99-.6 2.09-1.33 1.1-.74 2.29-1.34 1.2-.61 2.33-1.04 1.13-.42 2.12-.92.98-.5 2.33-.81 1.34-.3 2.6-.41 1.25-.11 1.78-.57.53-.46.6-.66.08-.2.21-.37.13-.17.31-.28.18-.12.38-.17.21-.05.42-.03.21.01.41.1.19.08.35.22.16.14.27.33.1.18.14.39.04.21.01.42-.02.21-.12.4-.09.19-.24.34-.15.15-.34.25-.19.09-.4.12-.21.03-.42-.01t-.4-.14q-.18-.1-.32-.26-.15-.16-.23-.35-.08-.2-.1-.41-.02-.21.03-.42t.17-.39q.11-.17.28-.31.16-.13.36-.21.2-.07.41-.08.21 0 .42.06.2.06.37.19.18.12.3.29.13.17.19.38.06.2.06.41l-.01.21-1.44 2.41q-1.44 2.4-2.57 2.45-1.13.05-2.46.39t-2.73.96q-1.4.63-2.37 1.07-.97.43-2.03 1.11-1.07.68-2.34 1.46-1.28.79-2.15 1.47-.88.69-2.26 1.76t-2.77 2.08q-1.39 1.01-2.39 1.94-.99.93-1.89 1.97-.89 1.05-1.65 1.9-.77.86-1.6 2.15-.83 1.3-1.67 2.72-.84 1.43-1.47 2.76-.62 1.34-1.24 2.6-.63 1.27-1.38 2.71-.75 1.43-1.41 2.95-.66 1.52-1.38 3.11-.73 1.59-1.61 3.08-.89 1.49-1.62 2.7-.74 1.22-1.46 2.19-.73.98-1.73 2-1 1.01-2.01 1.64-1.02.62-1.88 1.37-.86.74-1.51 1.63-.65.88-1.4 1.96-.75 1.07-1.36 1.98-.62.91-1.3 1.83-.68.91-1.39 1.72-.72.81-1.36 1.73-.63.91-1.42 1.78-.78.87-1.6 1.61-.82.74-1.9 1.52t-2.45 1.19q-1.37.4-2.78.55-1.41.15-2.66.71-1.25.56-2.37 1.29-1.11.73-2.11 1.51-.99.77-2.1 1.74-1.12.96-2.16 1.89-1.03.94-2.25 1.97-1.21 1.04-2.1 2.05-.88 1.02-1.96 2t-2.27 2.09q-1.2 1.12-2.05 1.92-.86.8-1.9 1.61-1.05.81-2.14 1.78-1.09.96-2.29 1.85-1.19.88-2.57 1.83-1.38.95-2.94 1.89-1.56.95-3.06 1.63-1.51.69-3.23 1.5t-2.96 1.53q-1.23.71-2.8 1.5-1.58.8-2.91 1.33t-3.02 1.46q-1.68.93-2.86 1.72-1.19.8-2.39 1.72-1.19.92-2.18 1.71-.98.8-1.81 1.63-.83.83-1.75 2.33t-1.54 2.78q-.62 1.28-1.17 2.53-.56 1.25-1 2.64-.44 1.39-.9 3.05-.45 1.65-.77 3.19-.32 1.55-.47 3.1-.15 1.56-.21 2.81t-.13 2.42q-.07 1.17-.07 2.68v5.42q0 1.24-.01 2.51-.01 1.27-.12 2.33-.11 1.07-.28 2.49l-.31 2.61q-.14 1.19-.39 2.46-.25 1.26-.35 2.4-.1 1.13-.27 2.21-.16 1.07-.3 2.15-.14 1.07-.37 2.69-.23 1.61-.4 2.74-.17 1.13-.44 2.51-.26 1.38-.46 2.67-.2 1.28-.48 2.42-.29 1.13-.47 2.25-.18 1.13-.46 2.32-.28 1.2-.65 2.37-.37 1.17-.69 2.21-.33 1.04-.79 2.21-.47 1.17-1.12 2.49-.65 1.33-1.34 2.38-.69 1.05-1.43 1.89-.73.84-1.8 1.51t-2.52 1.11q-1.45.44-2.69.22-1.23-.23-2.3-.62-1.06-.39-1.93-1.1-.86-.71-1.71-1.59-.86-.88-1.53-2.06-.67-1.17-1.2-2.51-.54-1.34-1.04-2.7-.51-1.37-.99-2.8-.47-1.42-1.04-3.01l-1.05-2.98q-.48-1.39-.95-2.85-.46-1.45-.87-2.56-.4-1.11-.84-2.08-.44-.97-.94-2.23-.5-1.26-1.01-2.34-.51-1.07-1.04-2.59-.54-1.53-.95-3.12-.42-1.6-.91-3.13-.49-1.53-.97-2.79-.47-1.27-1.1-2.3-.62-1.03-1.51-1.79-.88-.76-1.53-.22-.65.55-.87.7-.22.14-.47.23-.25.08-.51.11-.25.02-.51-.01-.26-.04-.51-.14-.24-.1-.45-.26-.22-.15-.39-.35-.16-.21-.28-.44-.12-.24-.17-.49-.06-.26-.05-.52 0-.27.07-.52.07-.26.2-.49.13-.23.31-.42l.18-.19Z"/></svg>

De hecho, una vez entendidas las notaciones anteriores, la definición formal de esta no tiene mucha diferencia:

$$
\Theta(g(n)) = \set{f(n) : \exists c_1,c_2 > 0, \exists k \geq 0 (c_1 \cdot g(n) \leq f(n) \leq c_2 \cdot g(n) ) \space \forall n \geq k}
$$

Teniendo en cuenta las definiciones anteriores y esta, se puede derivar el siguiente teorema:

$$
    f(n) = \Theta(g(n)) \iff f(n) = \Omicron(g(n)) \land f(n) = \Omega(g(n))
$$

Con esto concluimos el apartado de notaciones asintóticas. **Existen dos notaciones más** que no voy a cubrir aquí porque no suelen aparecer tanto, aunque las dejaré como referencia: <a href="https://www.geeksforgeeks.org/analysis-of-algorithems-little-o-and-little-omega-notations/">little-o y little-omega</a>.

<br />

# Pero y todo esto, ¿cómo se aplica?

Como comentaba en la introducción, el análisis asintótico es solo "una pata" de todas las que sustenta el análisis de algoritmos. Para cerrar el post voy a dejar el análisis de uno de los algoritmos que mencioné arriba, insertion sort, aunque **para ello utilizaré técnicas que no están descritas en esta entrada** pero que **explicaré en un futuro**.

## Análisis de insertion sort

```java
void insertionsort(int[] arr) {
    for (int j = 1; j < arr.length; j++) {
        int i = j - 1;
        while (i >= 0 && arr[i] > arr[i+1]) { // [!code focus]
            swap(arr, i, i+1);                // [!code focus]
            i--;                              // [!code focus]
        }                                     // [!code focus]
    }
}
```

**Insertion-sort es un algoritmo de ordenación** muy fácil de entender. Imaginemos una baraja de cartas sin ordenar puesta boca abajo en una mesa. Vamos levantando cartas con la mano derecha y colocándola en la izquierda, asegurándonos que siempre que añadimos una carta a la mano izquierda buscamos la posición correcta de dicha carta (en orden ascendente, por ejemplo). De esta forma todo lo que hay en el montón boca abajo está desordenado y lo que tenemos en la mano izquierda ordenado.

<br />

### Bucle while

```java
// omitimos el bucle for de momento
// ...
while (i >= 0 && arr[i] > arr[i+1]) { // [!code focus]
    swap(arr, i, i+1);                // [!code focus]
    i--;                              // [!code focus]
}
                                     // [!code focus] 
// ...                                  

```

Primero analicemos el bucle `while`. Si hacemos una tabla de iteración tenemos que:

| Iteración | i   |
|-----------|-----|
| 1         | $j-1$ |
| 2         | $j-2$ |
| 3         | $j-3$ |
| ...       | ... |
| k         | $j-k$ |

Donde $k$ **es la k-ésima iteración** *(un número de iteración random, la que sea, no importa)*. La condición de parada del bucle es $i \geq 0$, así que resolviendo para $k$ tenemos que 
$$ 
    j - k = 0 \implies k = j
$$

Por tanto, cuando la iteración $k$ es la última tenemos que el bucle se ha ejecutado $j$ veces. Asumiendo $\Theta(1)$ para las líneas 4 y 5 tenemos que el coste del bucle `while` es de $\Theta(j)$.

<br />

### Bucle for

```java
void insertionsort(int[] arr) {
    for (int j = 1; j < arr.length; j++) { // [!code focus]
        int i = j - 1;                     // [!code focus] 
        // + Θ(j)
    }
}
```

Ahora centrémonos en el bucle `for` desde las líneas 2 a 5. Ya sabemos que el bucle `while` tiene una complejidad de $\Theta(j)$, por tanto podemos obviarlo de momento y centrarnos en el resto de las líneas de código que, de hecho, solo hay una. Esta línea es la asignación de una variable, y sabemos que eso tiene tiempo constante, por tanto la línea 3 tiene complejidad $\Theta(1)$.

Pues ya solo nos queda analizar el conjunto, el bucle `for` teniendo en cuenta el bucle `while`. Para ello usamos una sumatoria desde $j=1$ hasta $n$ *(que es el rango del bucle  `for`)*:

$$
    \sum\limits_{j=1}^{n} \Theta(j) = \sum\limits_{j=1}^{n} c \cdot j = c \cdot \sum\limits_{j=1}^{n} j = \dfrac{n(n+1)}{2} = \Theta(n^2)
$$

Lo que nos queda al manipular la sumatoria es una **progresión aritmética** *(la suma de los primeros $n$ términos o suma de Gauss)*, que tiene forma cerrada conocida: $\dfrac{n(n+1)}{2}$.

Por tanto acabamos de concluir que el algoritmo insertion sort tiene complejidad cuadrática o $\Theta(n^2)$ y, como hemos visto en esta entrada, **es un algoritmo muy poco eficiente**.

Cualquier duda, comentario, mejora o error en el footer está mi correo personal.
!Hasta la próxima¡