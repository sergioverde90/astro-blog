---
title: 'Insertion Sort'
description: 'Coge una baraja de cartas, barájala y pon el mazo boca abajo. Coge la primera carta y colócala en tu mano izquierda (o derecha si eres zurdo). Ahora coge una segunda carta y haz lo mismo. Repite el proceso hasta que el mazo se quede sin cartas y estén todas en tu mano. ¿Qué harías para ordenarlas? El algoritmo Insertion Sort* (u ordenación por inserción) es uno de los'
pubDate: 'Mar 06 2025'
draft: true
---

Coge una baraja de cartas, barájala y pon el mazo boca abajo. Coge la primera carta y colócala en tu mano izquierda (o derecha si eres zurdo). Ahora coge una segunda carta y haz lo mismo. Repite el proceso hasta que el mazo se quede sin cartas y estén todas en tu mano. ¿Qué harías para ordenarlas? El algoritmo **Insertion Sort** (ordenación por inserción) es uno de los algoritmos de ordenación que, si bien no es el más eficiente, se aprende porque es fácil de implementar y fácil de analizar. En este post vamos a hacer las dos: primero daremos una implementación en Java y después analizaremos la complejidad del mismo.

## Algoritmo

// TODO:

## Implementación

Como la mayoría de algoritmos, la implementación que podemos hacer puede ser **iterativa** o **recursiva**. En este caso vamos a hacer una implementación iterativa:

```java
void insertionsort(int[] arr) {
    for (int j = 1; j < arr.length; j++) {
        int i = j - 1;
        while (i >= 0 && arr[i] > arr[i+1]) { 
            swap(arr, i, i+1); // se omite el método swap por simplicidad
            i--;
        }
    }
}
```

Varios puntos a considerar. Nótese que el bucle `for` no empieza a recorrer desde el primer elemento, sino **desde el segundo**. Esto se debe a lo que la idea is ir comparando "la carta" actual con la anterior.