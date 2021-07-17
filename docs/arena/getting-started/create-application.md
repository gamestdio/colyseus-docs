# Application Deployment

### Requirements

* [Sign-up](https://https://console.colyseus.io/register) for a Arena Cloud Account 
* [Arena Cloud](../create-colyseus-server/) compatible Colyseus server

## Creating a Application Deployment

Your game or application can have many app deployments which are used to separate your environments (Dev, Staging, Prod) and/or regions (US East, EU West, AP South). Each app deployment has its own dedicated resources pool and works independently for all other deployments managed by your account. 

To get started create your first app deployment...

![New Application Button](../../images/create-new-app.jpg)

- After logging select **Create A New App** on the top right side of the dashboard.

- Fill in the application detail fields and select your *Plan* and *Region*

- If you have an **Arena Code** provided with your early access email enter it in the *Code* field.

![Sign-up Flow](../../images/create-app.jpg)

- Submit and wait for your application to be created

!!! NOTE
    New Application deployments can take up to 2 mins depending on region

## Application Dashboard

Select **Manage** on your newly created application to see your application dashboard. From here you can see a snapshot of your activity and access tools to update code, view active server, restart your application and view logs.

![Arena Application Management View](../../images/app-manage-details.jpg)

- **Current Usage:** Displays current CCU over your current Arena plan limits (if any)
- **Connection:** the URL and Ports that provide access to your application
- **API Key:** A unique reference identifier for your application that can be used to access the application deployment via the Arena Public API's
- **Arena Plan:** The current hosting plan your application is enrolled in.
- ***GIT Updated:*** Info from the most recent GIT update.
- ***GIT Msg:*** The check-in message for the most recent update.
- ***GIT Hash:*** Hash for the most recent update.
!!! NOTE
    Only ***GIT*** details are ***ONLY*** visible when using CI/CD GitSync Service (Provide for Powered Ascent and Up Arena Plans)
