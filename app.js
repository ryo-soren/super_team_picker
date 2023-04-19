const express = require("express")
const app = express()
const superTeamRouter = require("./routes/super_team_picker")
const cookieParser = require('cookie-parser');
const logger = require("morgan")
const path = require("path")
const methodOverride = require("method-override")

app.use(logger('dev'))
app.use(express.urlencoded({extended: true}))

app.use(methodOverride((req, res) => {
  if(req.body && req.body._method) {
    const method = req.body._method
    return method
  }
}))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    
    const username = req.cookies.username
    res.locals.username = ''

    if(username){
        res.locals.username = username;
    }   
    next(); 
})

app.use("/super_team_picker", superTeamRouter)

app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/sign_in', (req, res) => {
    const COOKIE_MAX_AGE = 1000 * 60 * 60
    const username = req.body.username
    res.cookie('username', username, {maxAge: COOKIE_MAX_AGE})
    res.redirect("/super_team_picker")
})

app.post('/sign_out', (req, res) => {
    res.clearCookie("username")
    res.redirect("/super_team_picker")
})

const PORT = 3000;
const DOMAIN = 'localhost'

app.listen(PORT, DOMAIN, () => {
    console.log(`Server is listening on http://${DOMAIN}:${PORT}`)
})