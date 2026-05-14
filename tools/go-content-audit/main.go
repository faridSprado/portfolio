package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Portfolio struct {
	Projects          []struct{ Title string `json:"title"` } `json:"projects"`
	Experiences       []struct{ Role string `json:"role"` }  `json:"experiences"`
	LanguageEcosystem []struct{ Name string `json:"name"` }  `json:"languageEcosystem"`
}

func main() {
	path := "backend/app/db/portfolio_content.json"
	if len(os.Args) > 1 {
		path = os.Args[1]
	}

	content, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}

	var portfolio Portfolio
	if err := json.Unmarshal(content, &portfolio); err != nil {
		panic(err)
	}

	fmt.Printf("Portfolio audit: %d projects, %d experiences, %d language entries\n",
		len(portfolio.Projects), len(portfolio.Experiences), len(portfolio.LanguageEcosystem))
}
