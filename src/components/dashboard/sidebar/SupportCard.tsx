
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";

const SupportCard = () => {
  const [showChat, setShowChat] = useState(false);
  
  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Help & Support</CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        {showChat ? (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium">AI Assistant</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowChat(false)}>×</Button>
            </div>
            <div className="text-sm bg-white p-2 rounded-lg mb-2 text-gray-600">
              How can I help you today?
            </div>
            <div className="flex gap-2 mt-2">
              <input 
                type="text" 
                placeholder="Type your question..." 
                className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-web3-purple"
              />
              <Button size="sm" className="bg-web3-purple">Send</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Need help getting started? Our support team is here to help.
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full bg-web3-purple text-white flex items-center justify-center gap-2"
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportCard;
