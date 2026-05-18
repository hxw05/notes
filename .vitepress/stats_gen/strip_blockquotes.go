package main

import "bytes"

var blockquotePrefix = []byte("\n>")

func stripBlockquotes(content []byte) []byte {
	if len(content) == 0 {
		return content
	}

	// Prepend newline so the first line can also match "^>" pattern
	normalized := append([]byte("\n"), content...)

	var result []byte
	start := 0

	for {
		idx := bytes.Index(normalized[start:], blockquotePrefix)
		if idx == -1 {
			result = append(result, normalized[start:]...)
			break
		}

		absIdx := start + idx
		result = append(result, normalized[start:absIdx+1]...) // keep the preceding newline

		// Skip the blockquote line: start from char after '>', find next '\n'
		lineStart := absIdx + 2 // skip "\n>"
		end := bytes.IndexByte(normalized[lineStart:], '\n')
		if end == -1 {
			// blockquote line is the last line, skip to end
			start = len(normalized)
		} else {
			start = lineStart + end
		}
	}

	// Remove the leading newline we prepended
	if len(result) > 0 && result[0] == '\n' {
		result = result[1:]
	}

	return result
}
