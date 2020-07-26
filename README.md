# chat-api
API for a simple message chat via websocket.

## Technologies
- NodeJs
- SocketIo
  
## What is it?

This Node application is a real time one to one chat via websockets that allow multiple channels conversation
with another registered user.

## How to run

To run this application Node must be installed. To run just enter on the project folder via terminal and type the following comand:

```
npm run dev
```

or

```
yarn dev
```

You can also run the following commands to transpile the code to JavaScript version, that will be generated at the `/dist` folder in the projet root.

```
npm run build
```
or
```
yarn build
```

After that, go to the browser and type or click in the link above:

http://localhost:3333/index.html

To test just open two pages and register the users. Then, placing the user in the `To User` field the messages will arrive on the specified user chat.

## Notes

The messages persist until restarting the application. If you refresh the page and give the same user, the chat that already exists will appear after the registration.

Chats are one to one, but not just two users. You can registry so many users (and open pages) you want. The messages will arive on the correct chat. An improvement possible is add group chats, what is easy to made just creating a custom room and joining the rescpetives scokets to them and use broadcast to a room. See the [Socket.Io documentation](https://socket.io/docs/rooms/)

The messages are displayed in the same div, but this is just an example. If you want to use that on a best way you need to create chat tabs and handle the messages to show only the messages for that chat.

## Why?

This is just a simple example for learning purpose. Feel free to use.
