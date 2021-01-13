# image-repository-api
An image repository api, built using Express.js and MongoDB

## How To Use
- To use with authentification use postman or integrate with application
- link: 

## Routes - How each works
Descriptions of how each route works

### /signup
#### Method: POST
- create an account, data should be put in the request body
- required fields include name and password. 
- name field should be unique and password field should have at least 8 characters long
- jwt will be returned along with user info if properly created

### /login
#### Method: POST
- to login, body of request must contain name and password field

### /logout
#### Method: DELETE
- logs user out by deleting the jwt from database to invalidate it 

### /logoutall
#### Method: DELETE
- deletes all jwt from database so therefore user cannot login on any device

### /image/uploadOne
#### Method: POST
- uploads one image for the related user
- files must be a jpg, jpeg, or png
- user should change name of image to be a mini description to make searching by text more efficient and effective

### /image/uploadMany
#### Method: POST
- uploads many images for the related user
- files must be a jpg, jpeg, or png
- user should change name of image to be a mini description to make searching by text more efficient and effective


### /image/search?search=running&skip=0
#### Method: GET
- in order to search for a picture you must include a search term as query parameter in the url and include a skip value
- the seach term is used to find images with description that include the term
- the skip term is used to get the nth image from the search (ex. skip=0 would return the first result - - - from the search, skip=1 would return second result)
- image description and id are sent in the header of http response

### /image/mine&skip=0
#### Method: GET
- in order to get all pictures that are yours (in no particular order) user must include include a skip value
- the skip term is used to get the nth image from the search (ex. skip=0 would return the first result, skip=1 would return second result)
- image description and id are sent in the header of http response

### /image/delete?id=5ffd51d7b7f1ee2f626f3472
#### Method: DELETE
- delete an image given the id
- user can only delete pictures they own

### /image/deleteMany
#### Method: DELETE
- delete many images given an array of ids in the body
- user can only delete images that they upload

### /image/deleteAll
#### Method: DELETE
- delete all images for a given user









