'use strict'

var fs = require('fs')
var path = require('path')

// Define global Vue for server-side app.js
global.Vue = require('vue')

// Get the HTML layout
var layout = fs.readFileSync('./public/index.html', 'utf8')

// Create a renderer
var renderer = require('vue-server-renderer').createRenderer()

// Create an express server
var express = require('express')
var server = express()

var app = require('./public/app.min.js');

// Serve files from the assets directory
server.use('/public', express.static(
  path.resolve(__dirname, 'public')
))

// Handle all GET requests
server.get('*', function (request, response) {
  // Render our Vue app to a string
  renderer.renderToString(
    // Create an app instance
    app,
    // Handle the rendered result
    function (error, html) {
      // If an error occurred while rendering...
      if (error) {
        // Log the error in the console
        console.error(error)
        // Tell the client something went wrong
        return response
          .status(500)
          .send('Server Error')
      }
      // Send the layout with the rendered app's HTML
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

server.listen(8003, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:8003')
})