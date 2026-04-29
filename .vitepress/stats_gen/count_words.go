package main

import "unicode"

type countWordsResult struct {
	Hanzi int
	Word  int
}

func countContent(content string) (c countWordsResult) {
	inWord := false
	for _, r := range content {
		if unicode.Is(unicode.Han, r) {
			c.Hanzi++
			inWord = false
		} else if unicode.IsLetter(r) {
			if !inWord {
				c.Word++
				inWord = true
			}
		} else {
			inWord = false
		}
	}
	return
}
