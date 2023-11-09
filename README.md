# E-Commerce Back-End
<img src="https://img.shields.io/badge/license-MIT-green.svg">

## Demonstration Video
Here is a short demonstration video showing the installation of this API and testing all of the routes. It is in two parts:  
Part one: https://drive.google.com/file/d/1aOu8C_QRSANT5VVN8pRqWK3LP50m4ZN2/view  
Part two: https://drive.google.com/file/d/1C7Ar-7DfsOeLwtQZylohSqmrsCxeYG9u/view
    
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
To use this API as the foundations for an e-commerce back-end, you will need to do the following:
 - Set up MySQL ( I used a docker container )
 - Clone the repository
 - Install all packages ( 'npm install' )
 - Create a .env file with the database name, user and password and store securely
 - Open the MySQL CLI in the correct directory and run `source db/schema.sql` to set up the database
 - Run `npm run seed` to seed the database
 - Run `npm start` to test if setup is working
 
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