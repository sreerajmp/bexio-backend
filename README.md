# Docker Container Name

A one paragraph description about the container.

## Getting Started with docker

These instructions will cover usage information and for the docker container

### Docker Parameters

[For LIVE/TEST you need to login to ghcr.io first](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry "More infos")

#### Docker

##### Live

```shell
docker run -p 8000:8000 -d ghcr.io/io-market-ag/example:latest
```

##### Test

```shell
docker run -p 8000:8000 -d ghcr.io/io-market-ag/example:test
```

#### Docker Composer

##### Dev

```shell
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

## Getting Started with kubernetes

These instructions will cover usage information and for kubernetes

### Kubernetes Parameters

You need to login to the repo in order to use kubernetes

```shell
kubectl create secret docker-registry ghcrgithub --docker-server=ghcr.io \
--docker-username=<your-username> --docker-password=<your-github-token>
```

#### Kubernetes Live

```shell
kubectl apply -f example.yaml
```

### minikube

When using minikube have to set the container details public.
Do the following steps to configure the same.
Edit the kubernetes-sftp-service.yaml file and set nodePort to a port between 30000-32767

You also need to make the service public:

```shell
minikube service example-entrypoint
```

This will return the host and port to use.

## Useful information about the docker

### Environment Variables

- `LOG_LEVEL` - Logging level, Default: INFO
- `KAFKA_HOST` - Kafka hostname:port
- `KAFKA_TOPIC` - Kafka topic, Example: 'XSLT_Converter'
- `KAFKA_GROUP_ID` - Kafka group id, Example: 'XSLT_Converter'
- `YOUR_OTHER_VAR` - A Description

### .env File

All enviornment variables should be saved in the
.env file and refrenced in the docker-compose file.
The variables required by the docker container
are to be saved into the .env.example file for upload in repo.

[You will find more information in the documentation.](https://docs.docker.com/compose/environment-variables/)

### Volumes

- `/your/file/location` - File location

### Useful File Locations

- `/some/special/script.sh` - List special scripts
- `/magic/dir` - And also directories
