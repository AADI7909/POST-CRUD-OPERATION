const express = require('express')

const app = express()
app.use(express.json())
const path = require('path')
const dbPath = path.join(__dirname, 'movieApplication.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// READ ONE
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieDetails = `
        SELECT * FROM movie WHERE id = ${movieId}; `
  const dbResponse = await db.get(getMovieDetails)
  response.send(dbResponse)
})

// READ ALL
app.get('/movies/', async (request, response) => {
  const getAllMovieDetails = `
        SELECT * FROM movie; `
  const dbResponse = await db.all(getAllMovieDetails)
  response.send(dbResponse)
})

// UPDATE
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {name, img, summary} = movieDetails
  const UpdateMovieDetails = `
        UPDATE movie
        SET name = "${name}",
            img = "${img}",
            summary = "${summary}"
        WHERE id = ${movieId};`
  const dbResponse = await db.run(UpdateMovieDetails)
  response.send('Updated Successfully')
})

//DELETE
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      id = ${movieId};`
  await db.run(deleteMovieQuery)
  response.send('Movie Deleted Successfully')
})

// CREATE
app.post('/movies/', async (request, response) => {
  const newMovieDetails = request.body
  const {name, img, summary} = newMovieDetails
  const escapedName = name.replace(/'/g, "''")
  const escapedImg = img.replace(/'/g, "''")
  const escapedSummary = summary.replace(/'/g, "''")

  const addMovieQuery = `
    INSERT INTO
      book (name, img, summary)
    VALUES
      (
        '${escapedName}',
         '${escapedImg}',
         '${escapedSummary}'
      );`
  const dbResponse = await db.run(addMovieQuery)
  response.send('Movie Created Successfully')
})
