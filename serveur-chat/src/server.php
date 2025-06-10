<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/../vendor/autoload.php';
require 'chat.php';

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080 
);

echo "WebSocket server started on port 8080\n";
$server->run();
