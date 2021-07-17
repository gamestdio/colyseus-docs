# Deploying Server Code

To deploy your code you will need to select the ***Deploy*** button at the top right of the Server Code page. This button will bring up the follow dialog to confirm your deployment action. Clicking deploy will copy the update server code to your game servers, without deploying you will not see your updated code reflected on the active servers even though it shows here in the Server Code section.

![Deploy Code](../../images/deploy-code.jpg)

- **Reload Deployment:** Checking this will force the game servers to restart upon deployment. This is useful when developing to quickly update an App Deployment to test changes made to your server code. Note that this action will also boot any current player out of their current game.

!!! NOTE   
    ***Production:*** See our section on [Production Deployments](../../production/deploy-prod-application/) on our recommended deployment patterns for handling hot patches / updates without interrupting current game sessions.



