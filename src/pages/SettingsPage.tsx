
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    company: "",
    walletAddress: "",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentAlerts: true,
    invoiceReminders: true,
    marketingEmails: false,
  });
  
  const [preferences, setPreferences] = useState({
    defaultCurrency: "USD",
    defaultCryptoCurrency: "usdc",
    autoEscrow: false,
    escrowDays: 14,
    darkMode: false,
  });
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    
    try {
      // Load profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      
      // Load company data if exists
      const { data: company } = await supabase
        .from("companies")
        .select("name")
        .eq("user_id", user?.id)
        .maybeSingle();
      
      // Load wallet address if exists
      const { data: wallet } = await supabase
        .from("wallets")
        .select("wallet_address")
        .eq("user_id", user?.id)
        .eq("is_default", true)
        .maybeSingle();
      
      setProfileData({
        fullName: profile?.full_name || "",
        email: user?.email || "",
        company: company?.name || "",
        walletAddress: wallet?.wallet_address || "",
      });
      
      // In a real app, you would load these from the database
      // For now, we're using default values
      
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const updates = {
        id: user.id,
        full_name: profileData.fullName,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateNotifications = async () => {
    setIsSaving(true);
    
    // In a real app, you would save notification preferences to the database
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };
  
  const handleUpdatePreferences = async () => {
    setIsSaving(true);
    
    // In a real app, you would save preferences to the database
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved.",
      });
    }, 1000);
  };
  
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email inbox for password reset instructions.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/auth";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>
      
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading account information...</p>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          placeholder="Your name"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          value={profileData.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Default Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="Your default wallet address"
                        value={profileData.walletAddress}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Manage wallets in the Wallet section
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-indigo-600"
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Free Plan</h3>
                      <p className="text-muted-foreground">Basic features included</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Up to 10 invoices per month</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Basic analytics</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Email support</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                      Upgrade to Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important account updates
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="payment-alerts">Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive payments
                    </p>
                  </div>
                  <Switch
                    id="payment-alerts"
                    checked={notificationSettings.paymentAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, paymentAlerts: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="invoice-reminders">Invoice Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for upcoming and overdue invoices
                    </p>
                  </div>
                  <Switch
                    id="invoice-reminders"
                    checked={notificationSettings.invoiceReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, invoiceReminders: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, marketingEmails: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600"
                    onClick={handleUpdateNotifications}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select
                      value={preferences.defaultCurrency}
                      onValueChange={(value) => setPreferences({...preferences, defaultCurrency: value})}
                    >
                      <SelectTrigger id="default-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-crypto">Default Crypto Currency</Label>
                    <Select
                      value={preferences.defaultCryptoCurrency}
                      onValueChange={(value) => setPreferences({...preferences, defaultCryptoCurrency: value as "eth" | "usdc"})}
                    >
                      <SelectTrigger id="default-crypto">
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-escrow">Auto-Enable Escrow</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically enable escrow for all new invoices
                    </p>
                  </div>
                  <Switch
                    id="auto-escrow"
                    checked={preferences.autoEscrow}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, autoEscrow: checked})
                    }
                  />
                </div>
                
                {preferences.autoEscrow && (
                  <div className="space-y-2">
                    <Label htmlFor="escrow-days">Default Escrow Days</Label>
                    <Input
                      id="escrow-days"
                      type="number"
                      min="1"
                      max="90"
                      value={preferences.escrowDays}
                      onChange={(e) => setPreferences({...preferences, escrowDays: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days to hold funds in escrow
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, darkMode: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600"
                    onClick={handleUpdatePreferences}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-muted-foreground">
                    Change your password to keep your account secure
                  </p>
                  <Button
                    variant="outline"
                    onClick={handlePasswordReset}
                  >
                    Reset Password
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Sign out</h3>
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    Sign out of all sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
