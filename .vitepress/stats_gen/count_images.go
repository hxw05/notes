package main

import "regexp"

var imageRegex = regexp.MustCompile(`!\[[^\]]*\]\([^)]+\)`)

func countImageReferences(content []byte) int {
	return len(imageRegex.FindAll(content, -1))
}
