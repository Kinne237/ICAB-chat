<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/../vendor/autoload.php';
require_once '/var/www/html/db.php';

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $users;
    protected $pdo;


    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->users = [];
        $this->pdo = $GLOBALS['pdo'];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    private function getGroupMembers($groupId) {
        $stmt = $this->pdo->prepare("SELECT user_id FROM group_members WHERE group_id = ?");
        $stmt->execute([$groupId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);

        echo "Message reçu : " . print_r($data, true) . "\n";

        if (isset($data['type']) && $data['type'] === 'auth' && isset($data['userId'])) {
            $userId = $data['userId'];
            $this->users[$userId] = $from;
            $from->userId = $userId;
            echo "User $userId authenticated\n";

            $this->broadcastStatus($userId, true);
            return;
            
        }

        if (isset($data['type']) && $data['type'] === 'message') {
            $to = $data['to'];
            $messageData = [
                'type' => 'message',
                'from' => $data['from'],
                'to' => $to,
                'message' => $data['message'],
                'conversation_id' => $data['conversation_id'] ?? null,
                'timestamp' => isset($data['timestamp']) ? $data['timestamp'] : time()
            ];

            $jsonMessage = json_encode($messageData);

            if (isset($this->users[$to])) {
                $this->users[$to]->send($jsonMessage);
                echo "Message sent to user $to\n";
            }

            if (isset($from->userId)) {
                $from->send($jsonMessage);
            }
        }

        if ($data['type'] === 'group_message') {
            echo "Entrée dans le bloc group_message\n";
            $groupId = $data['group_id'];
            $senderId = $data['from'];
            $message = $data['message'];

            $members = $this->getGroupMembers($groupId);

            $messageData = [
                'type' => 'group_message',
                'group_id' => $groupId,
                'from' => $senderId,
                'message' => $message,
                'timestamp' => time()
            ];
        
            $json = json_encode($messageData);
        
            echo "Envoi d'un message au groupe $groupId par l'utilisateur $senderId\n";
            echo "Membres du groupe : " . implode(', ', $members) . "\n";

            foreach ($members as $memberId) {
                if ($memberId != $senderId && isset($this->users[$memberId])) {
                    echo "Message envoyé à $memberId\n";
                    $this->users[$memberId]->send($json);
                } else {
                    echo "Utilisateur $memberId non connecté ou est l'expéditeur.\n";
                }
            }
        
            // Envoie aussi à l’expéditeur pour affichage
            if (isset($this->users[$senderId])) {
                $this->users[$senderId]->send($json);
            }
        }
        
    }

    private function broadcastStatus($userId, $isOnline) {
        $message = json_encode([
            'type' => 'status',
            'userId' => $userId,
            'online' => $isOnline
        ]);
    
        foreach ($this->users as $uid => $conn) {
            if ($uid != $userId) {
                $conn->send($message);
            }
        }
        echo "Broadcast status for user $userId: " . ($isOnline ? 'online' : 'offline') . "\n";
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        if (isset($conn->userId)) {
            $userId = $conn->userId;
            unset($this->users[$userId]);
            $this->broadcastStatus($userId, false);
            echo "User {$userId} disconnected\n";
        }
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
