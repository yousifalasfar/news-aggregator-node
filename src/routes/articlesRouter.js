import express from "express"

import Article from "../models/Article.js"

const articlesRouter = new express.Router()
articlesRouter.get("/", (req, res) => {
  //PAGINATION
  const allArticles = Article.findAll()
  //set the number of articles per page
  const articlesPerPage = 10
  //set page number to 1
  let currentPageNumber = req.query.page
  if (!currentPageNumber) {
    currentPageNumber = 1
  }
  //get the total number of article pages?
  const totalPageNumber = Math.ceil(allArticles.length / articlesPerPage)
  //slice data start point pagenumber*articlesPerPage-1 for 10 items
  let tenArticles = allArticles.slice(
    (currentPageNumber - 1) * articlesPerPage,
    currentPageNumber * articlesPerPage
  )
  //get pagenumbers
  let pages = []
  for (let i = 1; i <= totalPageNumber; i++) {
    pages.push(i)
  }

  //render that data
  res.locals.currentPage = currentPageNumber
  res.locals.pages = pages
  console.log(res.locals.pages)
  
  res.render("articles/index", { tenArticles: tenArticles })
})

// articlesRouter.get("/", (req, res) => {
//   console.log(Article.findAll())
//   res.render("articles/index", { articles: Article.findAll() })
// })

articlesRouter.get("/form", (req, res) => {
  res.render("articles/form")
})

articlesRouter.post("/", (req, res) => {
  const articleName = req.body.title
  const articleUrl = req.body.url
  const articleDescription = req.body.description
  const newArticle = new Article({
    title: articleName,
    url: articleUrl,
    description: articleDescription
  })
  if (!newArticle.isValid()) {
    res.render("articles/form", { newArticle })
  } else {
    newArticle.save()
    res.redirect("/articles")
  }
})

export default articlesRouter
