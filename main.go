package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type message struct {
	From      string `json:"from"`
	Timestamp string `json:"timestamp"`
	Msg       string `json:"message"`
}

var clients = make(map[*websocket.Conn]bool)

var broadcast = make(chan *message)

// define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We'll need to check the origin of our connection
	// this will allow us to make requests from our React
	// development server to here.
	// For now, we'll do no checking and just allow any connection
	CheckOrigin: func(r *http.Request) bool { return true },
}

// reader will listen for the
// new messages being sent to the WebSocket
func reader(conn *websocket.Conn) {
	for {
		// read in a message
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		broadcast <- &message{
			From:      strings.Split(conn.RemoteAddr().String(), ":")[3],
			Timestamp: time.Now().UTC().Format("Jan _2 15:04:05"),
			Msg:       string(p),
		}
	}
}

// serveWs WebSocket handle
func serveWs(w http.ResponseWriter, r *http.Request) {
	// upgrade this connection to a WebSocket
	// connection
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	fmt.Println("new websocket connection", ws.RemoteAddr().String())

	// add the client
	clients[ws] = true
	fmt.Println("clients", len(clients), clients)

	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	reader(ws)

	// delete the client
	fmt.Println("exiting", ws.RemoteAddr().String())
	delete(clients, ws)
}

func writer() {
	for {
		message := <-broadcast
		// send to every client that is currently connected
		fmt.Println("new message", message)

		for client := range clients {
			err := client.WriteJSON(message)
			if err != nil {
				log.Printf("Websocket error: %s", err)
				client.Close()
				// on error delete the client
				delete(clients, client)
			}
		}
	}
}

func main() {
	fmt.Println("Chat App v0.0.1 running at :8080")
	go writer()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running...")
	})

	// map `/ws` endpoint to the `serveWs` function
	http.HandleFunc("/ws", serveWs)
	http.ListenAndServe(":8080", nil)
}
