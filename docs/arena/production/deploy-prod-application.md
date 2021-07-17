# Best Practices

!!! NOTE   
    - This is our current recommendation for using Arena in a production environment, future updates are incoming that will streamline this process allow for graceful rolling updates from a single deployment.

## Using an Arena Deployment in Production
The following is two design patterns we recommend for high availability server deployment for your Arena Cloud application.

### A / B Server Deployments
In this deployment pattern you will be required to create TWO application deployment. Let Name them ***MOBA A*** and ***MOBA B***. Only one of these deployment will be used to server traffic to players are a given time for this example lets assume ***MOBA A*** is in use. This setup requires that you as the developer have the ability to dynamically update the server address on your game clients.

- **Maintenance Window Update:** Your game servers are empty as you are in a scheduled maintenance window for your game. In this scenario you would update your game server code on ***MOBA A*** and restart the deployment for changes to take effect. Since no players are connected no game sessions are interrupted.  

- **Critical Patch / Hot Fix Update:** A major bug has been found that could effect gameplay balance or is causing instability for some clients. In this scenario you would like to update the code for new games while not terminating on-going game sessions. To accomplish this you will first need to upload and deploy your code changes to ***MOBA B***. Once you have confirmed the update has been deployed you can update your backend service to update game clients with the new ***MOBA B*** connection URL. New games will be routed to and created with the updated code base and the old game session can gracefully finish their session on the ***MOBA A*** deployment.

!!! NOTE   
    - If you choose to use this approach billing will be adjusted to ensure that you are only paying for ACTIVE deployments. The minimum required idle deployments for ths A / B setup will not be at no additional cost.


### Dynamic Server Deployment (Only available on To Mars (TM) and above)
This deployment pattern can be used with a single application deployment but does have some limitation. This system also requires a custom parameter be set by our Support Team to ensure it works as expected, reach out to [support@lucidsight.com](mailto:support@lucidsight.com) to learn more and deploy this service. For the following examples we will call this deployment ***MOBA SINGLE*** in the following examples.

- **Maintenance Window Update:** Your game servers are empty as you are in a scheduled maintenance window for your game. In this scenario you would update your game server code on ***MOBA SINGLE*** and restart the deployment for changes to take effect. Since no players are connected no game sessions are interrupted.  

- **Critical Patch / Hot Fix Update:** A major bug has been found that could effect gameplay balance or is causing instability for some clients. In this scenario you would like to update the code for new games while not terminating on-going game sessions. To accomplish this you will upload your code to the ***MOBA SINGLE***  application. When you are deploying the code you will ***NOT*** select *Reload Deployment* and then will select Deploy. On completion of the deployment process ***X*** new servers will be added to your existing server pool and will be prioritized by the Arena Load Balancer for new traffic. That new traffic will be automatically placed in the newest servers with older server scaling down after 10 mins of inactivity. ***X*** can be a predefined amount or match the number of servers running.


