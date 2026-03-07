const functions = require("../structs/functions.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());

module.exports = async (ws) => {
    // create hashes
    const ticketId = functions.MakeID().replace(/-/ig, "");
    const matchId = functions.MakeID().replace(/-/ig, "");
    const sessionId = functions.MakeID().replace(/-/ig, "");

    // Parse game server IP and port from config (use first entry)
    const gameServerEntry = Array.isArray(config.gameServerIP) ? config.gameServerIP[0] : config.gameServerIP;
    const gameServerParts = gameServerEntry ? gameServerEntry.split(":") : [];
    const gameServerHost = gameServerParts[0] || "127.0.0.1";
    const gameServerPort = gameServerParts[1] || "7777";

    Connecting();
    await functions.sleep(800);
    Waiting();
    await functions.sleep(1000);
    Queued();
    await functions.sleep(4000);
    SessionAssignment();
    await functions.sleep(2000);
    Join();

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        ws.send(JSON.stringify({
            "payload": {
                "totalPlayers": 1,
                "connectedPlayers": 1,
                "state": "Waiting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Queued() {
        ws.send(JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": 0,
                "estimatedWaitSec": 0,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }));
    }

    function SessionAssignment() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "state": "SessionAssignment"
            },
            "name": "StatusUpdate"
        }));
    }

    function Join() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }
}