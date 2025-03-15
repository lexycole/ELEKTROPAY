import { useState } from "react";
import { Card, CardHeader, CardContent, Input, Switch, Button, Select } from "@shadcn/ui";
import { supabase } from "@/lib/supabaseClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const SettingsPage = ({ role }) => {
  const [autoReminders, setAutoReminders] = useState(settings.auto_reminders);
  const [reminderFrequency, setReminderFrequency] = useState(settings.reminder_frequency);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        app: true,
    });
    const [displayOptions, setDisplayOptions] = useState({
        language: "English",
        theme: "Light",
    });
    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });
    const [smsEnabled, setSmsEnabled] = useState(settings.sms_notifications);

    const handleUpdateProfile = () => {
        // Placeholder function to handle profile update
        console.log("Profile updated:", profile);
    };

    const handleSaveSettings = () => {
        // Placeholder function to handle saving settings
        console.log("Settings saved:", { notifications, displayOptions });
    };
    // const handleToggle = async () => {
    //     const newStatus = !smsEnabled;
    //     setSmsEnabled(newStatus);
    //     await supabase.from("settings").update({ sms_notifications: newStatus }).eq("merchant_id", settings.merchant_id);
    // };

    // const handleToggle = async (field, value, setter) => {
    //     setter(value);
    //     await supabase.from("settings").update({ [field]: value }).eq("merchant_id", settings.merchant_id);
    //   };

    const handleToggle = async (field, value, setter) => {
        setter(value);
        await supabase.from("settings").update({ [field]: value }).eq("merchant_id", settings.merchant_id);
      };
    
    const handleFrequencyChange = async (value) => {
    setReminderFrequency(value);
    await supabase.from("settings").update({ reminder_frequency: value }).eq("merchant_id", settings.merchant_id);
    };
    

    return (
        <div className="p-8 space-y-6">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600">Customize your app experience</p>
                </CardHeader>

                <CardContent>
                    {/* General Settings Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Language</label>
                                <Select
                                    value={displayOptions.language}
                                    onChange={(e) => setDisplayOptions({ ...displayOptions, language: e.target.value })}
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Theme</label>
                                <Select
                                    value={displayOptions.theme}
                                    onChange={(e) => setDisplayOptions({ ...displayOptions, theme: e.target.value })}
                                >
                                    <option value="Light">Light</option>
                                    <option value="Dark">Dark</option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-medium">Email Notifications</label>
                                <Switch
                                    checked={notifications.email}
                                    onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="font-medium">SMS Notifications</label>
                                <Switch
                                    checked={notifications.sms}
                                    onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="font-medium">App Notifications</label>
                                <Switch
                                    checked={notifications.app}
                                    onChange={() => setNotifications({ ...notifications, app: !notifications.app })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Management Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Account Management</h2>
                        <div className="space-y-4">
                            <Input
                                placeholder="Name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                            <Input
                                placeholder="Email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                            {role === "super_admin" && (
                                <Button variant="outline" onClick={() => console.log("Admin-specific action")}>
                                    Super Admin Action
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>

                <div className="flex justify-end space-x-4 p-4 border-t">
                    <Button variant="outline" onClick={handleUpdateProfile}>
                        Update Profile
                    </Button>
                    <Button variant="primary" onClick={handleSaveSettings}>
                        Save Settings
                    </Button>
                </div>


                <div className="p-6">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <div className="flex items-center space-x-3">
                        <Switch checked={autoReminders} onCheckedChange={() => handleToggle("auto_reminders", !autoReminders, setAutoReminders)} />
                        <span>{autoReminders ? "Automated Reminders Enabled" : "Automated Reminders Disabled"}</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                        <Switch checked={smsEnabled} onCheckedChange={() => handleToggle("sms_notifications", !smsEnabled, setSmsEnabled)} />
                        <span>{smsEnabled ? "SMS Reminders Enabled" : "SMS Reminders Disabled"}</span>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="reminder-frequency" className="block text-sm font-medium text-gray-700">
                        Reminder Frequency
                        </label>
                        <Select value={reminderFrequency} onValueChange={handleFrequencyChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
