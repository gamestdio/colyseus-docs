# Using a Private NPM Repository (.npmrc)

If you are using a non-public NPM module and need Arena to access a private NPM repo this can be done by adding the below file to the root directory of your server code. 

*File ```.npmrc``` Example:*
```
<PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<PRIVATE TOKEN / KEY>
```

!!! NOTE   
    - You MUST include `//` before the npm.pkg.git.com entry on the second line
    - If you are using a registry other than github update the `registry` url
    - Replace `<PROJECT/REPO NAME>` and `<PRIVATE TOKEN / KEY>` with your project values.

