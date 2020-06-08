# Tube-Map

## Tuesday
In this session you will set up your own environment for server-side code.

1. Download this repository and open a new vscode window with this directory at its root.
1. Run `npm init` in the terminal in this directory, following the steps through (suggested default values are fine). Set the main script to `server.js` when it asks.
1. Modify `package.json` to add `"type": "module"` to the object.
1. Install `express` and `sqlite3` using `npm install express` and `npm install sqlite3` in the terminal.
1. Create a new `.vscode/launch.json`. It should have two launch configurations defined, one for the server, one for the browser. You can use the one below.
1. Launch the server first, then the browser.

From here your server is set up. Have a play and modify it as you see fit.

Next find your computer's local ip address, and try to connect to the server from another device (e.g. your phone) on the network.
i.e. instead of navigating to `http://localhost:8080`, replace `localhost` with the ip address you have found (keep the `:8080`).

IP addresses look like `172.16.254.1` in IPv4, and `[2001:db8:0:1234:0:567:8:1]` in IPv6.

### .vscode/launch.js example
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Node Server",
            "type": "node",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/server.js"
        },
        {
            "name": "Firefox debugger",
            "type": "firefox",
            "request": "launch",
            "reAttach": true,
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/static"
        }
    ]
}
```
