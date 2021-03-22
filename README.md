# intro-to-docker

This is my attempt at explaining various docker concepts with a simple 
node JS server and api example. You do not need to be proficient in node JS
to follow along.

## What is docker

Docker is technology platform for building applications based on *containers*. Containers are small
lightweight execution environments that share the operating system kernel, but run in isolation of
one another. Containers are useful to keep applications from interfering with one another, while saving
space and maintenance compared to the alternative *virtual machines*.

Docker containers start with a *Dockerfile*. Each dockerfile is a list of commands used to build a Docker
*image*. A Dockerfile specifies the operating system, along with programming languages, environment variables,
file locations, network ports, etc. Simply writing the Dockerfile is not enough. You will need to *build*
the Dockerfile, which will build the final image that will be used as the container. Each line in the Dockerfile
is run independently, which causes a new image to be created. This means that when an edit is made to the Dockerfile
and you go to build again, docker will re-use the intermediate images (cache) to accelerate the build process.

To save time from having to write each docker image from scratch, there is [Docker Hub](https://hub.docker.com/search?q=&type=image)
which hosts a multitude of images to start from, everything from operating systems, programming languages,
databases, etc. Docker Hub is a registry for both official and unofficial images. Do your own research when using
unofficial images -- be wary of malware. It is also possible to create your own local Docker registry, though
probably unnecessary for a hobbyist.

One of my favorite aspects of Docker: **Docker containers enable portability.** If you have worked with
other developers, you have probably run into environment issues. For example, you are using python 3.6
which allows the use of [f-strings](https://realpython.com/python-f-strings/#f-strings-a-new-and-improved-way-to-format-strings-in-python),
a way of formatting strings in code, and your co-worker has python 3.5 installed, which does not have the f-string feature.
As soon as they try to run your code, it will fail. Docker containers allow you to pass a common environment configuration
back and forth so that each of you are using the same environment.

### This repository explained

There are comments in each file explaining what is happening, but here is the structure

- api
  - app.js : The starting point for our api container
  - Dockerfile.api : Instructions to build the image for our api container
  - package.json : node js package requirements
- server
  - app.js : The starting point for our server container
  - Dockerfile.server : Instructions to build the image for our server container
  - package.json : node js package requirements
- docker-compose.yml : Defines our docker services and tells our docker-compose commands what to do

## Getting started

- [Download docker desktop](https://www.docker.com/products/docker-desktop)
- Install and start the docker desktop application
- Clone this repository to your local machine
- Navigate to the local repository

## Running the example

#### Starting up

Navigate to the local repository in your terminal and start with docker-compose

```bash
docker-compose up
```

This will start the docker containers in a verbose mode. If you do not care to see container logs
in your terminal window, you can run your containers in daemon mode.

```bash
docker-compose up -d
```

Once started, try to [visit the server](http://localhost:8001/) in your browser. You should
see a "Hello Server" message. You can do the same for the [api](http://localhost:8000/).

#### Environment variables defined in docker-compose

In each service, we defined an environment variable *DEBUG*. This is used to hide or reveal a debug
endpoint. Try visiting `/debug` for each service to see the effects. Also try changing this value in
the `docker-compose.yml` file to see the change take place. After editing the docker-compose file,
do not forget to stop the docker containers with a keyboard interrupt (ctrl+c) or `docker-compose down`
if you're running in daemon mode, and then restart them. You can print the DEBUG environment variable from your terminal to see
that it is not defined there, only in the docker containers.

#### Volumes

Now, visit the [server's datafile endpoint](http://localhost:8001/endpoint) to see a file being read from
the file system to the browser. Two things are notable here:

1. The url host defined in `./server/app.js` for contacting the api is not `localhost`. We can use the container
name. This is a feature of using docker.
2. We did not copy the file into the api docker image. We are using volumes to map a directory on our local machine
to a directory inside of our docker container.

Now that we have seen the first effects of using volumes, let's explore that a bit more. Make a note of the contents
of `./data/` in this repository on your local machine. It should be one file. Visit the [api's create file](http://localhost:8000/create-file)
endpoint to write a file to the volume. You should see this file appear on your local machine. Docker containers
have ephemeral storage. This means that if they're dropped with `docker-compose down -v` then you will lose access
to any data that was created during runtime. Because we mapped the container volume to a directory on our local machine, we have
created persistent data, so that when volumes are dropped, the data we created in that volume is still available the next
time we run our docker containers.

To further prove the mapping, let's enter the docker container for the api service and look for the newly
created file. While the docker containers are running, open a new terminal window. Run `docker exec -it api /bin/bash`.
This will start a bash session inside of the api container. In that terminal, run `ls /data/`. This should list our two
files: `non-ephemeral.txt` and `hello-world.json`, which matches our local file system. Exit the bash shell with `exit`.

### Other useful features/commands

You can choose to run a single service by using the run command

`docker-compose run api`

For a list of running docker containers on your machine

`docker ps`

For a list of all images that are locally stored

`docker image ls`

To force docker to build without its cache

`docker-compose build --force-rm --no-cache`
