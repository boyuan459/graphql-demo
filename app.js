const express = require('express')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const schema = require('./schema/schema')
const cors = require('cors')

const app = express()

//enable cors
app.use(cors)

mongoose.connect('mongodb://localhost/playlist')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('mongodb connected')
});

app.use('/graphql', graphqlHttp({
  schema,
  graphiql: true
}))

app.listen(8000, () => {
  console.log('Listening for requests on port 8000...')
})