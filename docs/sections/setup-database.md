INSTALLATION - SETTING UP A MYSQL CONTAINER DOCKER, AND CONNECTING TO IT

These instructions came from the bootcamp - contains the key command. Will rewrite this if I include it. 

# mySQL

Having seen the state of the mySQL installation on Windows, it seems that using docker to run mySQL is preferable.

Moreover, mySQL doesn't support M1 macs. However, maria DB does, and is backwards-compatible (as far as this course is concerned), so we use that.

The incantation required is

* `docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=password -d mariadb`
  * `run` instantiates a docker image, and runs it for the first time
  * `-p` stands for publish. mysql listens on port 3306, this makes 3306 available to the host machine
  * `--name` provides any name
  * `-e` stands for environment variable. mysql sets the root password to what you specified using this environment variable when it first starts
  * `-d` stands for daemon (= service in macos/Windows speak): run the container in the background
  * `mysql` is the name of the docker image that you want to instantiate. You can also use `mariadb` instead with no problems
  * You can use whatever name you like rather than `mysql`
  * You can have as many mysql instances as you want, with different names, but only one can run at the same time (or you can publish using a different port with `-p 3306:<some_other_port>`)
* You can stop the server with `docker stop mysql`
* You can start the server with `docker start mysql` (or whatever name you've given your instance)
* You can trash a stopped server with `docker rm mysql`


mySQL server can be started and stopped using the following commands. Note that the docker service needs to be started first.

```bash
docker start mysql
docker stop mysql
```

You will also need the CLI client for mysql

* Windows `choco install mysql-cli`
* macos
  * `brew install mysql-client`
  * You will get some instructions on how to put `mysql` in your path: follow these

To connect from the command line to your running mysql server

* Windows `winpty mysql -h127.0.0.1 -uroot -ppassword`
* macos `mysql -h127.0.0.1 -uroot -ppassword`