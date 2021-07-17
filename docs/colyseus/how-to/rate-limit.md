You may eventually find malicious users to take advantage of Colyseus' matchmaking to flood your server will rooms, causing your server to be creating and removing rooms without real player usage.

It's recommened to use the `express-rate-limit` middleware to block too many requests from the same source. See more details on [`express-rate-limit`'s README](https://github.com/nfriedly/express-rate-limit);

```
npm install --save express-rate-limit
```

## Usage

```typescript fct_label="TypeScript"
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

```javascript fct_label="JavaScript"
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use("/matchmake/", apiLimiter);
```


You must also enable `"trust proxy"` if you're behind a reverse proxy (like Heroku, Bluemix, AWS ELB, Nginx, etc)

```javascript
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
```