package main

import "bytes"

var frontmatterDelim = []byte("---")

func stripFrontmatter(content []byte) []byte {
	if len(content) < 4 {
		return content
	}

	// Frontmatter must start at the very beginning of the file with "---"
	if !bytes.HasPrefix(content, frontmatterDelim) {
		return content
	}

	// Check that "---" is followed by newline or end of file (not "----" etc.)
	if len(content) > 3 && content[3] != '\n' && content[3] != '\r' {
		return content
	}

	// Find closing "---"
	rest := content[3:]
	for {
		nl := bytes.IndexByte(rest, '\n')
		if nl == -1 {
			return content
		}
		lineStart := nl + 1
		if lineStart >= len(rest) {
			return content
		}
		if bytes.HasPrefix(rest[lineStart:], frontmatterDelim) {
			end := lineStart + 3
			if end >= len(rest) || rest[end] == '\n' || rest[end] == '\r' {
				// Skip past the closing delimiter line
				if end < len(rest) && rest[end] == '\r' {
					end++
				}
				if end < len(rest) && rest[end] == '\n' {
					end++
				}
				return rest[end:]
			}
		}
		rest = rest[lineStart:]
	}
}
