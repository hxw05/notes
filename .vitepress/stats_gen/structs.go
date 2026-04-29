package main

import "time"

type ProjectStat struct {
	Name string `json:"name"`
	Stat
}

type Stat struct {
	NoteCount        int      `json:"noteCount"`
	ImageCount       int      `json:"imageCount"`
	CharCountChinese int      `json:"charCountChinese"`
	CharCountTotal   int      `json:"charCountTotal"`
	LastUpdated      jsonTime `json:"lastUpdated"`
}

type jsonTime struct {
    time.Time
    f string
}

func (j jsonTime) format() string {
    return j.Time.Format(j.f)
}

func (j jsonTime) MarshalText() ([]byte, error) {
    return []byte(j.format()), nil
}

func (j jsonTime) MarshalJSON() ([]byte, error) {
    return []byte(`"` + j.format() + `"`), nil
}