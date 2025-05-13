# JobBoard

A web portal aims to facilitate work for job recruters to post jobs and to keep tracking jobs statuses and no of seekers who applied to specific jobs

Also the admin can show of metrics about the portal and has the ability to manage all types of users.


### Steps

1- add .env file and take inspiration of .env.example file here 

2- if the container is already running then we need to stop it and remove the volumes, by running `docker-compose down -v`

3- after that we need to build the containers by running `docker compose build --no-cache` and it may take a while to complete

4- After the build is finished, you can start the containers by running command `docker compose up` and it will do the magic of running any migrations or seeders and will sync prisma client code.

Also this step may take some time to complete as it consists of many steps specially for the backend service.

You can try visit backend url and frontend url to see if the application is running.

5- the starting point of the app should be from logging as an admin to the app and then creating a hiring company and creating a recruiter and to be assigned to that company

```
Email: admin@job-board.com

Password: 12345678
```

6- depending on the machine and docker specification, sometimes you can find one of the services is not running, hence you need to start it from docker desktop app or from command line

7- you can visit the urls from below

[open the frontend](http://localhost:4200/)

[open the backend graphql playground](http://localhost:3000/graphql/)
