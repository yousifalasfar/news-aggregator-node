// path to your articles.json file

import fs from "fs"
import _ from "lodash"
import { log } from "console"
const articlesPath = "articles.json"

class Article {
  constructor({ id, title, url, description }) {
    this.id = id
    this.title = title
    this.url = url
    this.description = description || null
    this.errors = []
  }

  static findAll() {
    const stringfiesdData = fs.readFileSync(articlesPath)
    const articleData = JSON.parse(stringfiesdData).articles
    const articles = articleData.map((article) => {
      return new Article(article)
    })
    return articles
  }

  static getNextArticleId() {
    const maxArticle = _.maxBy(this.findAll(), (article) => article.id)
    return maxArticle.id + 1
  }

  isValid() {
    const errors = {
      title: ["Title cannot be blank"],
      url: [
        "Must be a valid URL, i.e. http://something.com",
        "This url has already been submitted"
      ],
      description: ["Description must be at least 20 characters"]
    }
    //add error if title is blank
    if (!this.title) {
      this.errors.push(errors.title[0])
    }
    //add error if url is blank or invalid
    if (!this.url || !this.url.match(/^https?:\/\/(.*)/)) {
      this.errors.push(errors.url[0])
    }
    //add error if URL already exists
    let allArticles = Article.findAll()
    let findArticle = allArticles.some((article) => this.url === article.url)
    if (findArticle) {
      this.errors.push(errors.url[1])
    }
    //add error if description is not long enough
    if (this.description !== null && this.description.length < 20) {
      this.errors.push(errors.description[0])
    }

    //return true/false values
    if (this.errors.length > 0) {
      return false
    } else {
      return true
    }
  }


  save() {
    this.id = this.constructor.getNextArticleId()
    const articles = this.constructor.findAll()
    articles.push(this)
    fs.writeFileSync(articlesPath, JSON.stringify({ articles: articles }))
  }

}

export default Article
