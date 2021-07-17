# Overview

## Accessing / Viewing Servers and Services
From the Application Dashboard select ***Deployments*** to view individual servers and services running for your Arena Cloud App.

![Deployments Button](../../images/deployments-button.jpg)

## Deployments Dashboard

On this interface you can access logs and individually restart services running for your Arena Cloud Application.

![Deployments Overview](../../images/deployments-overview.jpg)

- ***Colyseus Game Server:*** Colyseus game server running your deployed code. You can access logs per server or see all Colyseus Game Server logs combined using the **All Game Server Logs** button at the top right.  

- ***Arena Git Sync Service:*** Arena application that syncs and deploys server code from a defined Git repository. *(Only Available in Powered Ascent (PA) Plans and above)*

- ***Arena Load Balancer:*** This service manages incoming connections and distributes them to the correct colyseus server. Balances load of new room creation across available games servers. *(Only Available in auto-scaling multi-server deployments, To Mars (TM) Plans and above)*
!!! NOTE   
    - Restarting this service will break all existing connection disconnecting your players from the game server, this should only be done if you encounter a error / exception in the load balancer and game clients are unable to connect.
    - You may see multiple *Arena Load Balancers* as your CCU traffic exceeds 10,000 players.

- ***Arena Autoscaling Service:*** Manages the scaling up and down of Colyseus game servers. This service ensures that game server with active sessions do not get scaled down while players are connected. *(Only Available in auto-scaling multi-server deployments, To Mars (TM) Plans and above)*


