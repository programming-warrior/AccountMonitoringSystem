
# Realtime Account Monitoring System

An user account dashboard which helps user: view all the devices through which the account is signed in and  sign out from a specific device.



## API Reference

#### LOGIN

```http
  POST /api/v1/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

#### REGISTER

```http
  POST /api/v1/regsiter
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**.  |
| `password`      | `string` | **Required**.  |

#### FETCH ALL THE LOGGED IN DEVIC DETAILS

```http
  GET /api/v1/fetch
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**.  |


#### WEBSOCKET connection

```ws
  ws /
```



| middleware | desc  |   
| :-------- | :------- | 
| `verifyTokenSocket`      | `verifies the token sent in the sec-websocket-protocol header` | 

```ws
  *Date structure used to store the user login details*
  {
    "32411293847" /**userId**/:{
        "678582540245":{
            con: /**websocket connection obj**/
        }
        "664582540245" /**loginId**/:{
            con: /**websocket connection obj**/
        }
    }
    ...
  }
```







## Run Locally

### Backend

Clone the project

```bash
  git clone https://github.com/programming-warrior/AccountMonitoringSystem-backend.git
```

Go to the project directory

```bash
  cd AccountMonitoringSystem-backend
```

Install dependencies

```bash
  npm install
```
Transpile the typescript code

```bash
  npx tsc
```

Start the server

```bash
  npm run dev
```

### Client

Clone the project

```bash
  https://github.com/programming-warrior/AccountMonitoringSystem-client.git
```

Go to the project directory

```bash
  cd AccountMonitoringSystem-client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Demo

url: https://account-monitoring-system-client.vercel.app

