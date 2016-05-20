Template.login.onCreated(function loginOnCreated() {
  recognitionToggle(false);
});

Template.conversation.onCreated(function conversationOnCreated() {
  // counter starts at 0
  recognition.continuous = true;
  recognition.interimResults = true
  recognition.lang = 'es-ES';
  recognitionToggle(true);
});
