---
title: 'LLMs cheatsheet'
description: 'This is a cheatsheet for LLM lore, including some terminology and information about LLMs'
pubDate: 'Jul 08 2022'
heroImage: '/blog-placeholder-3.jpg'
---

# What the heck is a model template?

When you look up information for a given model, usually you will find something like [this](https://ollama.com/library/llama3.2/blobs/966de95ca8a6):

```bash
<|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023

{{ if .System }}{{ .System }}
{{- end }}
{{- if .Tools }}When you receive a tool call response, use the output to format an answer to the orginal user question.

You are a helpful assistant with tool calling capabilities.
{{- end }}<|eot_id|>
{{- range $i, $_ := .Messages }}
{{- $last := eq (len (slice $.Messages $i)) 1 }}
{{- if eq .Role "user" }}<|start_header_id|>user<|end_header_id|>
{{- if and $.Tools $last }}

Given the following functions, please respond with a JSON for a function call with its proper arguments that best answers the given prompt.

Respond in the format {"name": function name, "parameters": dictionary of argument name and its value}. Do not use variables.

{{ range $.Tools }}
{{- . }}
{{ end }}
{{ .Content }}<|eot_id|>
{{- else }}

...
```

Here (https://github.com/ollama/ollama/blob/main/docs/modelfile.md) you have an explanation of what that means.