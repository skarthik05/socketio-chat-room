# ChatCord - Real-Time Chat Application

ChatCord is a modern, real-time chat application built with Node.js, Express, and Socket.IO. It allows users to join chat rooms, send messages, and see who's online in real-time.

## Features

- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **Multiple Chat Rooms**: Join different rooms for different topics
- **User Status Indicators**: See who's online, offline, or away
- **Typing Indicators**: Know when someone is typing a message
- **Offline Notifications**: Get notified when you lose internet connection
- **Responsive Design**: Works on desktop and mobile devices
- **User Tooltips**: Hover over users to see their status and join time

## Technologies Used

- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript
- **Icons**: Font Awesome

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/skarthik05/socketio-chat-room.git
   cd socketio-chat-room
   ```

2. Install dependencies:

   ```
   npm ci
   ```

3. Start the server:

   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Join a Chat Room**:

   - Enter your username
   - Select a room from the dropdown
   - Click "Join Chat"

2. **Send Messages**:

   - Type your message in the input field
   - Press Enter or click the Send button

3. **User Status**:

   - Your status automatically updates based on your internet connection
   - When offline, you'll see a toast notification
   - Click "Reconnect" to try reconnecting to the server

4. **User Information**:
   - Hover over a user's name to see their status and join time

## Project Structure

```
socketio-chat-room/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── connectivity.js
│   ├── index.html
│   └── chat.html
├── utils/
│   ├── messages.js
│   └── users.js
├── server.js
├── package.json
└── README.md
```

## Customization

### Adding New Rooms

To add new chat rooms, edit the `index.html` file and add new options to the room dropdown:

```html
<select name="room" id="room">
  <option value="JavaScript">JavaScript</option>
  <option value="Python">Python</option>
  <option value="PHP">PHP</option>
  <option value="C#">C#</option>
  <option value="Ruby">Ruby</option>
  <option value="Java">Java</option>
  <option value="YourNewRoom">Your New Room</option>
</select>
```

### Changing the Bot Name

To change the bot name, edit the `server.js` file:

```javascript
const botName = "YourBotName";
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Font Awesome](https://fontawesome.com/) for icons
- [Express](https://expressjs.com/) for the web server
