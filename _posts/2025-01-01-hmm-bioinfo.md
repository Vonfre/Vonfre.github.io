---
layout: post
title: "Understanding Hidden Markov Models in Bioinformatics"
date: 2025-01-01
tags: [Algorithms, Probability, HMM]
author: Vonfre
description: A deep dive into the mathematical foundations of HMMs and their application in sequence alignment.
---

Hidden Markov Models (HMMs) are a statistical tool used for modeling systematically generative sequences that can be characterized by an underlying process generating an observable sequence. They are ubiquitous in bioinformatics, particularly in sequence alignment and gene prediction.

## The Three Problems of HMM

When using HMMs, there are three fundamental problems we typically want to solve:

1.  **Evaluation**: Given the parameters of the model, compute the probability of a particular output sequence.
2.  **Decoding**: Given an observed sequence, determine the most likely sequence of hidden states.
3.  **Learning**: Given an output sequence or a set of such sequences, find the most likely set of state transition and output probabilities.

## Mathematical Formulation

An HMM is defined by:
*   $S = \{s_1, s_2, \dots, s_N\}$: A set of $N$ states.
*   $V = \{v_1, v_2, \dots, v_M\}$: A set of $M$ observations.
*   $A = \{a_{ij}\}$: Transition probability matrix, where $a_{ij} = P(q_{t+1} = s_j | q_t = s_i)$.
*   $B = \{b_j(k)\}$: Emission probability distribution, where $b_j(k) = P(O_t = v_k | q_t = s_j)$.

### Forward Algorithm

To solve the Evaluation problem, we use the Forward Algorithm. The probability of being in probability state $s_j$ at time $t$ having observed the first $t$ observations is denoted as $\alpha_t(j)$:

$$
\alpha_t(j) = P(O_1 O_2 \dots O_t, q_t = s_j | \lambda)
$$

The recursion step is given by:

$$
\alpha_{t+1}(j) = \left[ \sum_{i=1}^N \alpha_t(i) a_{ij} \right] b_j(O_{t+1})
$$

Where:
*   $1 \le t \le T-1$
*   $1 \le j \le N$

## Implementation Example (Python)

Here is a simplified Python representation of the Viterbi algorithm for decoding:

```python
import numpy as np

def viterbi(obs, states, start_p, trans_p, emit_p):
    V = [{}]
    for st in states:
        V[0][st] = {"prob": start_p[st] * emit_p[st][obs[0]], "prev": None}
    
    # Run Viterbi when t > 0
    for t in range(1, len(obs)):
        V.append({})
        for st in states:
            max_tr_prob = V[t-1][states[0]]["prob"] * trans_p[states[0]][st]
            prev_st_selected = states[0]
            
            for prev_st in states[1:]:
                tr_prob = V[t-1][prev_st]["prob"] * trans_p[prev_st][st]
                if tr_prob > max_tr_prob:
                    max_tr_prob = tr_prob
                    prev_st_selected = prev_st
                    
            max_prob = max_tr_prob * emit_p[st][obs[t]]
            V[t][st] = {"prob": max_prob, "prev": prev_st_selected}
            
    # ... traceback logic ...
    return V
```

## Conclusion

HMMs provide a powerful probabilistic framework for analyzing biological sequences. In future posts, we will explore Profile HMMs and their use in protein family classification.
