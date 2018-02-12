# URL-shortening-service
 work flow: https://workflowy.com/s/HdnT.0DrZjyHjSt
- Developed a full stack web application delivering URL shortening service based on MEAN stack
- Increased QPS of AB test by 50% by deploying Redis cache layer and Nginx reverse proxy
- Improved scalability by deploying Docker containers and Cassandra clusters

![work flow chart](https://github.com/younghz/Markdown/raw/master/Res/URL-shortening-service/chart.png)

## Work flow

### 1. Users come to the app webpage
  - Browser send GET request with original URL to server
  - Server sends index.html to clients
  - Browser get the index.html with "<script src ='angularJS library '> <script src = 'app.js'> <script src = '/public/js/controllers/homeController.js'> in the head tag.
  - Browser again sends request for angularJS library/ js controller files to different servers
  - when browser encounter 'ng-view', it automatically turn to 'ng-router', ask for its view and controller; Again, sends corresponding GET request to fetch sub-view files
  - while browser parse the controller js file, it might do AJAX request to fetch information from server.
### 2. Users use the shortening service
  - input longURL in the input box, and click 'submit'
  - 'submit' fires the onclick funcion to do 2 things:
    - 1. send the longURL to specified URL, ie. POST  to localhost/api/v1/urls
      "Notice: This url is specifically used for rendering short/long URL"
    - 2. jump to new subpage: url.html, using $location.path( "/urls/" + shortURL )
      "Notice: this step is executed after app server responds the POST request in the first step with the calculated shortURL "
  - app server first receive the POST request with longURL, do 2 things:
    - 1. call the urlService to calculate the shortURL, store long/short URL pair in MongoDB
    - 2. send back the shortURL to the app webpage.
      "NOTICE: the shortURL should consist different prefix compared with the current app URL. Because it is created for outside users. So the shortURL should not prefix with /api/v1/.., but with just '/:shortUrl'"
  - after the app webpage getting shortURL, it renders new subview using url.html; Meanwhile, it needs to know the its original longURL for display.
  - Again, in the url.html subview, it sends GET request to the app server to get the longURL
    "Notice: This step could be simplified by just passing the longURL from the first subview to the second subview creating a service or using the $rootScope"
  - Now, in the new subview, the longURL and shortURL pair can be displayed
### 3. Visitors browse the shortURL from outside of the app webpage with 'localhost/:shortUrl'
  - the shortURL is just clicked from various browsers/ machines/ from different IP/ countries, at different time
  - when shortURL is clicked, it sends GET request 'localhost/:shortUrl' to the app server.
  - the app sever call the urlService to get the longURL from the shortURL, and redirect users to the original long URL
### 4. Information statistics
  - we want to record the total number of clicks / their browsers/ machine brands/ their IP/ countries/ timestamp. And display them in the app webpage.
  - So first we need add more elements in the url.html subview in the frontend; And update those information in the backend.
    - 1. updating the info each time the shortURL is clicked. And then store them in the MongoDB
    - 2. when app webpage is clicked, make AJAX call to the app server, let it get the info from MongoDB, and then send back to frontend
  - since all these clicks directly send GET request to 'localhost/:shortURL', which is handled by redirect.js. Thus, we here need a statistic service to update these info.
  - here we need the one of Express modules: Express-useragent to extract the information from the request
  - In the statistic service, we use the express-useragent to get the info, and then store them in the MongoDB database with a new schema.
### 5. app server's functions:
  - 1st function: handle app webpage request
  - 2nd function: handle outside's request
  - difference: clients shortURL request vs. app shortURL request
    - clients 点击 shortURL时候，nodeJS会根据express的route进行该shortURL的redirect
      "【注意】这些shortURL并不是从本网页点击的，而是从外部电脑访问该shortURL的"
    - app frontPage请求shortURL时候，其实是给用户一个查看数据的方式，只有他输入原始URL，才能得到相应的shortURL，才能查到相应的访问信息
      "【注意】该shortURL是从本网页访问的"
  - route has to cover all the cases, including browsers send GET request to get its static resources. Thus, the route has to declare the "/public " path and its corresponding Router.
