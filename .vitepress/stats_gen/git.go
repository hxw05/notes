package main

import (
	"os/exec"
	"strconv"
	"strings"
	"time"
)

func getLastCommitTime(path string) (t time.Time, retErr error) {
	result, err := exec.Command("git", "log", "-1", "--format=%ct", "--", path).Output()

	if err != nil {
		retErr = err
		return
	}

	seconds, err := strconv.ParseInt(strings.Trim(string(result), "\n "), 10, 64)
	if err != nil {
		retErr = err
		return
	}

	t = time.Unix(seconds, 0)
	return
}
