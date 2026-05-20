package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"
	"strings"
	"time"

	stripmd "github.com/writeas/go-strip-markdown"
)

func init() {
	const projectRootEvidence = "package.json"

	_, statsErr := os.Stat(projectRootEvidence)

	for altitude := 0; altitude <= 5 && statsErr != nil; func() {
		altitude++
		_, statsErr = os.Stat(projectRootEvidence)
	}() {
		chdirErr := os.Chdir("..")
		if chdirErr != nil {
			log.Fatalf("cannot chdir: %v\n", statsErr)
		}
	}

	if statsErr != nil {
		log.Fatalf("cannot find project root\n")
	}
}

func projectDirectories() []string {
	entries, err := os.ReadDir(".")

	if err != nil {
		log.Fatalf("cannot read dir: %v\n", err)
	}

	projectEntries := make([]string, 0, len(entries))

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		name := entry.Name()

		if name[0] == '.' || name == "node_modules" {
			continue
		}

		projectEntries = append(projectEntries, name)
	}

	return projectEntries
}

func walkMarkdownFiles(rootDir string, handle func(path string, content []byte)) {
	entries, err := os.ReadDir(rootDir)

	if err != nil {
		fmt.Printf("cannot read dir: %v\n", err)
		return
	}

	for _, entry := range entries {
		entryPath := path.Join(rootDir, entry.Name())

		if entry.IsDir() {
			walkMarkdownFiles(entryPath, handle)
			continue
		}

		if !strings.HasSuffix(entryPath, ".md") {
			fmt.Printf("skipping non-markdown file: %v\n", entryPath)
			continue
		}

		content, err := os.ReadFile(entryPath)

		if err != nil {
			fmt.Printf("error reading file: %v\n", err)
			continue
		}

		handle(entryPath, content)
	}
}

func writeJSON(data any, fileName string) {
	marshalled, err := json.Marshal(data)

	if err != nil {
		log.Fatalf("cannot marshal result: %v\n", err)
	}

	err = os.WriteFile(".vitepress/theme/"+fileName, marshalled, 0755)

	if err != nil {
		log.Fatal("cannot write file")
	}
}

const timeLayout = "2006-01-02 15:04:05"

var beijingLoc = func() *time.Location {
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		return time.FixedZone("CST", 8*3600)
	}
	return loc
}()

func main() {
	projects := projectDirectories()
	projectStats := make([]ProjectStat, 0, len(projects))
	var overallStats Stat
	for _, projectDir := range projects {
		var projectStat ProjectStat
		projectStat.Name = projectDir

		walkMarkdownFiles(projectDir, func(path string, content []byte) {
			projectStat.NoteCount++
			overallStats.NoteCount++

			lastCommitTime, err := getLastCommitTime(path)

			if err != nil {
				fmt.Println(err)
			} else {
				bjTime := lastCommitTime.In(beijingLoc)
				if projectStat.LastUpdated.IsZero() || projectStat.LastUpdated.Before(lastCommitTime) {
					projectStat.LastUpdated = jsonTime{bjTime, timeLayout}
				}
				if overallStats.LastUpdated.IsZero() || overallStats.LastUpdated.Before(lastCommitTime) {
					overallStats.LastUpdated = jsonTime{bjTime, timeLayout}
				}
			}

			imageCount := countImageReferences(content)
			content = stripFencedCodeBlocks(content)
			content = stripBlockquotes(content)
			stripped := stripmd.Strip(string(content))
			counts := countContent(stripped)

			projectStat.CharCountChinese += counts.Hanzi
			projectStat.CharCountTotal += counts.Word + counts.Hanzi
			projectStat.ImageCount += imageCount
			overallStats.CharCountChinese += counts.Hanzi
			overallStats.CharCountTotal += counts.Word + counts.Hanzi
			overallStats.ImageCount += imageCount
		})

		projectStats = append(projectStats, projectStat)
	}

	writeJSON(projectStats, "project_stats.json")
	writeJSON(overallStats, "overall_stats.json")
}
