# Why swarm?
- Swarm is a container orchestrator that runs one or more containers across one or more servers/nodes, efficiently.
- Docker containers promise deployment of app like on a PaaS, but on any machine/host anywhere and the apps will run the same. However, Paas solution have additional services/features that manage multiple (could be thousands) containers/services deployed over mutiple servers/instances etc.
- So how do we replicate the PaaS features i.e managing and automating the containers' lifecycle eg. scaling, starting & re-starting, updating, creating, re-creating on failure, deleting, replacing and ensuring zero downtime (blue/green deploy) etc.
- How to create and monitor cross-node virtual networks? How to ensure only trust4ed servers run our containers? How to store sensitive container data and ensure it is only accssed by the container intended for?
- Swarm allow deploying container into production reliably.
- Swarm mode introduced in 2016 is a clustring solution bringing together different OSs/nodes/clusters together into a single manageable unit, that you can then orcherstrate the lifecycle of containers in. (And is not Swarm Classic <v1.12, which ran inside the Docker server and repeated docker run on many containers).

(NB) Swarm mode is not enabled by default in Docker.

# Swarm under the hood
- A swarm, which could be a VM or physical machine running Linux or Windows Server, contains: (Illust. @ Section7/Time5.48)

    1. Manager nodes: have a local DB called Raft db, which stores information and configs that enable them to be the authority inside the swarm. A swarm can have more that 1 manager node (but only one leader node), but they all keep a copy of the raf db and encrypt data moving within the swarm (using the control plane - how instructions for actions are sent around the swarm) to ensure they administer the swarm securely.
    2. Worker nodes: that execute the tasks required in the swarm by following instructions received from the manager nodes.

(NB) Manager nodes can also be worker node and vice versa vis a process of node promotion and demotion.

- $ docker run could only provision 1 container on the machine the CLI is running on and did not have the ability to implemenent the PaaS feature mentioned above and is replaced by:

    $ docker service --help in swarm

- This allows adding feature to the service such as replicas (which are tasks). A service can have multiple tasks and each task will lauch a container. Where previously we spun an nginx container using $ docker run, with swarm, we can spin up an nginx service with $ docker service create with 3 nginx replicas and use the manager node to decide which node in the swarm gets replicas (by default they are spread out evenly). (Illust. @ Section7/Time6.19)
- The swarm manager node has the following services (API, orcherstrator, Allocator, Scheduler and Dispatcher) and the worker node has a worker and executor service. (Illust. @ Section7/Time7.44).

# Using Swarm clusters
$ docker info to check if swarm is enabled
$ docker swarm init to enable swarm
$ docker swarm --help to view more command options

- Enabling swarm also creates a single node (manager) swarm with all the swarm features.
- Other things done in the background include creating the security certificate and root-signing it, issuing the certificate for the first manager node and creating tokens of other nodes that will join the swarm. Also Raft databse is created and all security data created for the swarm are encrypted (>v1.13) and stored in it.

$ docker node ls to view swarm nodes
$ docker node --help to view command options

- docker service in a swarm replaces docker run which is a single and local host/node solution. For in a cluster, we dont care about individual nodes and they are disposal and impersonal e.g like cattle where we dont got to each node to start a container rather we 'throw' services at a swarm and it sort everything out for us.

$ docker service --help to view command options
$ docker service create to start a new service (see --help for more options)

(NB) Replicas means service_currently_running / services_specified_to_run, and swarm's goal is to always ensure they are matched. The serice naming convention (if not specified) follows docker's random container naming.

$ docker serice ps <service> shows the tasks within a service (a task runs a container)

- This also shows the node/server/host on which the task is running on. Their name (if not specified) is in the form 'service_name.task_number'

$ docker container ls show the containers being run by the swarm tasks. Their name (if not specified) will be in the form 'task_name.task_id + random_number'

(NB) A swarm service cannot be stopped, so the only option is to remove the service from the cluster: $ docker serice rm <serice>

## Scaling up a service
$ docker service update (see --help) to scale up a service. This is designed to change a service live to ensure its always up e.g docker service update <service> --<options> <option_value_to_set> This is similar to $ docker update for single containers.

(NB) Also $ docker service scale --help

- Should any task/container in the swarm fail, then another immediatly spun up to replace it.

## Multi-Node Swarm Clusters
- To create a multi-node cluster using different OSs is not possible with the local docker install, as that will provide only 1 OS, the localhost OS.
- We can provision the 3 nodes/VMs on a cloud platform e.g Digital Ocean, Azure, AWS, GCP etc. or run three nodes locally via virtualization software e.g virtualBox and docker-machine and ensure they are connected and can communicate with each other. The prior option is best as it closest replicates production environments. There is also the option to use Play with docker but this will only persist your environment for 4hrs.

## Creating a Multi-node Swarm Cluster
- Create 3 Ubuntu-Linux nodes on a cloud platform e.g Digital Ocean/Azure/AWS/GCP.

(NB) https://docs.docker.com/network/overlay/ (See port required for the nodes to comm)

- Set up SSH keys and .ssh config files for them to ease working with them (Lecture resources on how)
- Install docker using script on get.docker.com on all the nodes.
- Ensure the nodes can communicate with each other by opening the required firewall port (Lecture resources on how)
- Enable swarm on all the nodes, ensure to specify an IP address for the swarm service to advertise on, use the node's public IP since it's accessible by other servers and the other nodes we created as well.(If required by the cloud platform)
- The node you fire up swarm on will be the leader node, use it to add other nodes, by using either the worker token or manager token on the other nodes. This will determine what type on nodes they become in the swarm. You can also administer (same as a single node swarm locally) the swarm from it.

(NB) Worker node have a blank status and non of the docker commands will work for them as they dont have priviledges to administer the swarm. Other managers have a reacheable status.

# Overlay Multi-host Networking
- Is Swarm-wide bridge VPN for the containers to cross-host on and can access each other as if they were on the same sub-net.
- Creating the overlay VPN: $ docker network create --driver overlay
- This deals with intra-swarm communications only.
- There is the optional IPsec encryption on network create but this is turned by default for performance reasons.
- A xservice can be added to zero, one or more overlay networks depending on the application design e.g have a DB service on a back-end network, views on a front-end network and an API connecting the two on both networks.
- The services use their service names for DNS resolution.

(NB) Services cannot be run in the foreground as they have to be handled by the orcherstrate (always in detach mode). View their logs via: $ docker service logs <service>

Demo: Run the drupal app and its postgres DB as services on a multi-node swarm cluster using an overlay network:

    1. Have the cluster set (3-node on Azure)
    2. Create the overlay network:

        $ docker network create --driver overlay <network_name>

    3. Create the postgres service and add it to the above created network:

        $ docker service create --name <name> --network <network_name> -e ENV_VAR=env_val <service_image>

    (NB) Using docker service is similar to using docker run

    4. Create the drupal service and add it to the same network:

        $ docker service create --name <name> --network <network_name> -p host_port:container_port --replicas <#_of_replicas> <service_image>

    5. Check the service processes: $ docker service ps <service> to see on which node the service is running on, then use that nodes external IP to access the application running on that node.

(NB) Creating volumes & bind mounts in services uses a differnt format as that on containers:

    --mount type=volume/bind_mount,source=vol-name or /bind_mount,target=path/to/file

(NB) Published ports in a swarm cluster need to be opened as well on the nodes for the swarm routing mesh to work.

## Routing Mesh (Load Balancing via the VIP)
- Allows an application running on one node in the cluster to be accessible from all the cluster nodes.
- It is a ingress/incoming network (default swarm overlay network, created automatically when either $ docker swarm init or $ docker swarm join is ran).
- It routes incoming packets to the proper task/container in a swarm service & spans all the cluster nodes.
- It load balances & listens for traffic on all the cluster nodes.
- The routing mesh workings:

    1. Container-to-container: In an overlay network, it uses a virtual IP (VIP) as a communication interface between two app services, especially when one of the services has multiple replicas. This means the two services dont communicate directly using their IPs but rather, they go through the routing mesh VIP. This system is put in place by Swarm automatically to ensure the load is balanced across the service tasks.

    2. External swarm traffic can choose which node in the swarm to hit, as all nodes will be lsitening on the published ports for a particular service. The routing mesh, based on its load balancing will send the traffic to the right task/container.

- The routing mesh ensure that we are not concerned with what node/server is running what service, because this might changed, if the container/task fails and the swarm re-creates the service on a different node. So we need to be concerned about changign firewall or DNS setting when services keep changing nodes.

- Routing mesh load balancing is STATELESS (interaction instances are independent of each other e.g for sessions, auth, resposnses etc). It also a layer 3 load balancer, operating at the TCP and not DNS layer (4) and will not work for running the same webiste on the same node, swarm and port for example. You need an extra layer e.g NGINX or use Docker EE, which has a built in layer 4 web proxy.

# Swarm Stacks (Production-Grade Compose)
- An abstraction layer added to swarm allowing the use of docker compose files (> v3) to define services, networks and volumes.
- A stack is a combination of services declared in the compose file with their volumes and networks. This is different from services where we run on service using $ docker service.
- $ docker stack manages all the services automatically including allocating proper labels to each service and its corresponging resources e.g volumes.
- Stacks also handle creation of these objects automatically e.g overlay networks, but we can create our own before hand and instruct the stack to use those instead.
- The command to use with stacks:

    $ docker stack deploy <options> <stack_name>

- Additional compose keys in stacks:

    1. deploy: Includes swarm specific items e.g replicas, rolling updates, fail over etc, which are concerns in production not considered in a dev environment.

(NB) We however cannot use a build instruction in the compose file, which should never happen in a production swarm anyway; builds should happend at the CI stage.

- $ docker compose will ignore 'deploy' instructions in the compose file in a dev environment and $ docker stack will ingore the 'build' instruction in the compose file in production, thus enabling the use of one compose file.

- Stacks simplify the process of managing swarm services through a YAML file instead of having to type all numerous service commands to spin them up. They can however only manage one swarm and the nodes within that swarm only.

(NB) Docker visulaizer which runs on port 8080 is a visual rep of the state of the swarm (stack visulaization in lecture 71: (4:36) minutes).

# Swarm Secrets (> Docker 1.113 raft DB is encrypted by default)
- Easy, secure and built in swarm solution for storing confidential data e.g app access keys, passwords etc. These are required by the service(s) that will run the app.
- They are first stored first in the swarm then assigned to services and only on the disks of manager nodes. They are then passed to the containers that need (those assigned to the particular service) them through the TLS secure control plane.
- The secrets look like file to containers but are actually in-memory ram files with the names we assigned to them and inside the key (key-value).
- They are accessed at /run/secrets/<secret_name> or /run/secrets/<secret_alias> if using alises to reference the same secret.

## Working with Secrets in Services
1. In the swarm leader node terminal, set up the secrets:

    Create a secret: $ echo "<secret>" | docker secret create <secret_name> -

    We will type the password in terminal and echo it to the docker daemon to create it in a ram file with the name we specify. This creates a secret; to show created secrets:

        $ docker secrets ls : a docker inspect of a secret will still not reveal the key assigned to the secret. The only way is to access it under /run/secrets inside a running container that uses the secret, by bashing into it.

(NB) Note typing the password as part of a terminal command will leave it exposed in the users terminal history. (You can clear the history when done or grep the contents for the particular command and delete it form the terminal history)

2. Using postgres secrets for username and password to access the database used by an app.

    a) Create the two secrets as above e.g: psql_user and psql_password
    b) Create a postgres service and assign the secrets to it, such that all containers assigned to this service will use those secrets to access the database:

    $ docker service create --name psql --secret psql_user --secret psql_password -e POSTGRES_USER_FILE=/run/secrets/psql_user -e POSTGRES_PASSWORD_FILE=/run/secrets/psql_password postgres

(NB) Official docker images have the '_FILE' environment variable standard to enable passing the secrets to the containers as shown above.

3. You can add/ remove/ update the secrets assigned to a service using:

    $ docker service update

## Working with Secrets in Stacks
- You can define secret in compose files (> 3.1) for use with stacks.
_ The best way to define the secrets in the compose file is to create them before hand in the leader node cli then define them by their name (docker secrets ls) in 'secrets/ section of the compose file using the keyword 'external'. You can use 'file' but that is less secure.
- After defining them, then we assign the secrets to only the services that need them.
- Removing the stack, removes all the resources the stack created just like services:

    $ docker stack rm <stack_name>

# Service updates
- Docker updates service replicas on a rolling basis i.e shuts down one at a time, updates it then spins its up again with the new updates.
- Orcherstrators, even though doing the above as efficiently as possible, can only limit downtime but not prevernt it, because complex services e.g database as often difficult to update without changing how it they interact with other services around them.
- Simple app services however may update soothly without further intervention.
- The best way to repvent downtime is through rigorous tesitng of the update process.

(NB) A $ docker stack deploy is always considered an update, when the stack is already pre-existing, thus the the services are update to the new docker-compose file configs if changed.
- Swarm update examples:

    1. Image versions: $ docker service update --image app: <new_version> <service_name>
    2. Add an environment variable: $ docker service update --env-add NODE_ENV=production
    3. Remove a published port: $ docker service --publish-rm 8080
    5. Change number of replicas of two services: $ docker service scale web=8 api=6

(NB) Alot of these commands can be executed on the same line e.g to change a port you can --publish-rm 8080 --publish-add 80:80

- For a stack: $ docker stack deploy -c <new_yaml_file> <stack_name> and updates will be done automatically.

(NB) Should the containers in service become unbalanced across the available node, especially due to service updates, the below command will force swarm to re-balance the load by replacing the task, the following the default initialization allocation schema:

    $ docker service update --force <service_name>