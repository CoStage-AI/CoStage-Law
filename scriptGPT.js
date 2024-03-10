document.addEventListener('DOMContentLoaded', (event) => {
  const sendButton = document.getElementById('send-button');
  const chatInput = document.getElementById('chat-input');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-indicator';
  loadingDiv.textContent = 'Loading...';


  // Retrieve the thread ID from session storage or set it to null
  let threadId = sessionStorage.getItem('threadId') || null;

  const addMessage = (text, isUser) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.className = 'chat-message ' + (isUser ? 'user-message' : 'bot-message');
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  };

  const sendMessage = async () => {
    const userText = chatInput.value.trim();
    if (userText) {
      // Add user message
      addMessage(userText, true);

      // Clear the input field
      chatInput.value = '';

      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading-indicator';
      loadingDiv.textContent = 'Loading...';
      chatMessagesContainer.appendChild(loadingDiv);

      try {
        // Send the message to your server
        const response = await fetch('https://costage-law.onrender.com/get-response', {
     // const response = await fetch('http://localhost:3001/get-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userText, threadId: threadId })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if a new thread ID was returned from the server and store it
        if (data.threadId && !threadId) {
          threadId = data.threadId;
          sessionStorage.setItem('threadId', threadId);
        }

        // Remove loading indicator
        chatMessagesContainer.removeChild(loadingDiv);

        // Add bot's response
        addMessage(data.message, false);
      } catch (error) {
        console.error('Failed to get response: ', error);
        // Remove loading indicator if there is an error
        chatMessagesContainer.removeChild(loadingDiv);
      }
    }
  };

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      sendMessage();
    }
  });

  // Load initial bot message
  // addMessage('How can I help you?', false);
});
