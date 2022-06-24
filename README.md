# E-Commerce Back-End
<img src="https://img.shields.io/badge/license-MIT-green.svg">
    
## Description
This is the back-end for an e-commerce store that sells clothing, sports items and music. The server is built in Express.js and the database is MySQL. Sequelize is used to model the data and the relationships in the database. There are a large number of routes to allow the creation of new products, assign them to categories, and tag them with a variety of product tags to make sorting them easier.
    
## Table of Contents
    
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contribution](#contribution)
* [Future Development](#Future)
* [Tests](#tests)
* [Questions](#questions)
    
## Installation
This repository can be cloned from GitHub and then used as the foundations to build a functional e-commerce website. Once installed, open MySQL and run db/schema.sql to set up the database. Exit MySQL and seed the database using the command line command 'npm run seed'. Start the database using the command 'npm start' or use nodemon for a development server.

## Usage
There are a number of routes set up to query the database: a user can create, retrieve, update and delete (CRUD) three different models of data: the product, the category, and the tags. A more in depth showcase of the different routes that have been set up can be found in the demonstration video.

## License
This project is licensed under MIT.
    
## Contribution
Please contact me if you would like to contribute to this project, using the details below. This project was initially built for the University of Birmingham Coding Bootcamp, although I have several ideas for further development I would like to work on.

## Future Development
I would like to build a front-end for this and have some ideas for simple, novelty e-commerce stores that could use this framework. I would also like to create routes or functions that update tags on particular products, and in the long term I would also like to add a user functionality, so that users can create 'wishlists'. To keep developing my skills in building an e-commerce site, I would like to learn how to set up Stripe or a similar framework. 

## Tests
The routes can all be tested / used in Postman or Insomnia, once the application has been installed, and the database set up and seeded.

## Questions
If you have any questions about this project, please contact me at:  
Email: djbowen95@gmail.com  
GitHub: [djbowen95](https://github.com/djbowen95)  