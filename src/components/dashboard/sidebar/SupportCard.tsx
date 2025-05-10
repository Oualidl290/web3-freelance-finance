
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const SupportCard = () => {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Support</CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Need help with your account or have questions about crypto payments?
        </div>
        <div className="space-y-2">
          <Button className="w-full bg-web3-purple text-white">
            Chat with AI Assistant
          </Button>
          <Button variant="outline" className="w-full">
            Talk to Human
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCard;
