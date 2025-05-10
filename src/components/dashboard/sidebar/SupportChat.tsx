
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const SupportChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: "How can I help you today?", isUser: false}
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {text: message, isUser: true}]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        {
          text: "Thanks for your message! Our team will get back to you soon. In the meantime, you can check our documentation for help.",
          isUser: false
        }
      ]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-web3-purple/10 to-web3-blue/5 px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-medium flex items-center">
          Help & Support
          <MessageSquare className="h-4 w-4 text-gray-400 ml-2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {showChat ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">AI Assistant</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowChat(false)}>×</Button>
            </div>
            
            <div className="max-h-[240px] overflow-y-auto space-y-3 mb-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`text-sm p-2.5 rounded-lg ${
                    msg.isUser 
                      ? 'bg-web3-purple/10 ml-6 text-gray-800' 
                      : 'bg-gray-100 mr-6 text-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..." 
                className="flex-1 text-sm px-3 py-1.5 rounded-md border focus:border-web3-purple focus:ring-1 focus:ring-web3-purple"
              />
              <Button size="sm" className="bg-web3-purple hover:bg-web3-purple/90" onClick={handleSendMessage}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Need help getting started? Our support team is here to help.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full bg-web3-purple hover:bg-web3-purple/90 text-white flex items-center justify-center gap-2"
                onClick={() => setShowChat(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Chat with AI Assistant
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportChat;
