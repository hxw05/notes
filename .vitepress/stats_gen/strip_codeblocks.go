package main

import "bytes"

func stripFencedCodeBlocks(content []byte) []byte {
	var result []byte
	rest := content

	for len(rest) > 0 {
		start := findFenceStart(rest)
		if start == -1 {
			result = append(result, rest...)
			break
		}

		result = append(result, rest[:start]...)

		afterOpen := start + fenceLineLen(rest[start:])
		end := findClosingFence(rest[afterOpen:], rest[start])
		if end == -1 {
			result = append(result, rest[start:]...)
			break
		}

		rest = rest[afterOpen+end:]
	}

	return result
}

func findFenceStart(b []byte) int {
	i := 0
	for i < len(b) {
		nl := bytes.IndexByte(b[i:], '\n')
		if nl == -1 {
			return -1
		}
		lineStart := i + nl + 1
		if lineStart >= len(b) {
			return -1
		}

		s := lineStart
		for s < len(b) && b[s] == ' ' && s-lineStart < 3 {
			s++
		}
		if s >= len(b) {
			return -1
		}
		if isFenceChar(b[s]) && fenceRunLen(b[s:]) >= 3 {
			return s
		}
		i = lineStart
	}
	return -1
}

func isFenceChar(b byte) bool {
	return b == '`' || b == '~'
}

func fenceRunLen(b []byte) int {
	n := 0
	char := b[0]
	for n < len(b) && b[n] == char {
		n++
	}
	return n
}

// fenceLineLen returns the length of the entire fence line including the trailing newline.
func fenceLineLen(b []byte) int {
	count := fenceRunLen(b)
	rest := b[count:]
	nl := bytes.IndexByte(rest, '\n')
	if nl == -1 {
		return len(b)
	}
	return count + nl + 1
}

// findClosingFence returns the length from start of b to right after the closing fence line.
// Returns -1 if no closing fence is found.
func findClosingFence(b []byte, openFenceFirstByte byte) int {
	fenceChar := openFenceFirstByte
	minLen := 3

	i := 0
	for i < len(b) {
		nl := bytes.IndexByte(b[i:], '\n')
		if nl == -1 {
			return -1
		}
		lineStart := i + nl + 1
		if lineStart >= len(b) {
			return -1
		}

		s := lineStart
		for s < len(b) && b[s] == ' ' && s-lineStart < 3 {
			s++
		}
		if s >= len(b) {
			return -1
		}

		if b[s] == fenceChar {
			count := fenceRunLen(b[s:])
			if count >= minLen {
				afterFence := s + count
				if afterFence >= len(b) || b[afterFence] == '\n' || b[afterFence] == '\r' {
					// Find the newline after the closing fence
					nl2 := bytes.IndexByte(b[lineStart:], '\n')
					if nl2 == -1 {
						return len(b)
					}
					return lineStart + nl2 + 1
				}
			}
		}
		i = lineStart
	}
	return -1
}
