import React, { useState } from 'react';
import { Save, Trash2, Clock, AlertTriangle, Bell, X } from 'lucide-react';

interface RuleSettings {
  id: string;
  type: 'time' | 'count';
  value: number;
  enabled: boolean;
}

interface NotificationSettings {
  id: string;
  channel: 'email' | 'slack';
  event: 'merge' | 'review' | 'overdue';
  enabled: boolean;
}

const Settings: React.FC = () => {
  const [rules, setRules] = useState<RuleSettings[]>([
    {
      id: 'rule-1',
      type: 'time',
      value: 24,
      enabled: true,
    },
    {
      id: 'rule-2',
      type: 'count',
      value: 5,
      enabled: false,
    },
  ]);
  
  const [notifications, setNotifications] = useState<NotificationSettings[]>([
    {
      id: 'notification-1',
      channel: 'email',
      event: 'merge',
      enabled: true,
    },
    {
      id: 'notification-2',
      channel: 'slack',
      event: 'overdue',
      enabled: true,
    },
    {
      id: 'notification-3',
      channel: 'email',
      event: 'review',
      enabled: false,
    },
  ]);
  
  const [strictMode, setStrictMode] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  
  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };
  
  const updateRuleValue = (id: string, value: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, value } : rule
    ));
  };
  
  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, enabled: !notification.enabled } : notification
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">NBCR Workflow Settings</h2>
        
        <div className="space-y-6">
          {/* Rules Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Review Rules</h3>
            
            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      rule.enabled 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {rule.type === 'time' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium">
                        {rule.type === 'time' 
                          ? 'Time Limit for Reviews' 
                          : 'Maximum Unreviewed Merges'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {rule.type === 'time' 
                          ? 'Reviewers must complete reviews within this time' 
                          : 'Limit how many PRs can be merged without review per week'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {rule.enabled && (
                      <div className="flex items-center mr-4">
                        <input
                          type="number"
                          className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={rule.value}
                          min={1}
                          max={rule.type === 'time' ? 168 : 100}
                          onChange={(e) => updateRuleValue(rule.id, Number(e.target.value))}
                        />
                        <span className="ml-2 text-sm text-gray-500">
                          {rule.type === 'time' ? 'hours' : 'PRs'}
                        </span>
                      </div>
                    )}
                    
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        rule.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <div className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                          rule.enabled ? 'transform translate-x-5' : ''
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
            
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      notification.enabled 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium">
                        {notification.event === 'merge' 
                          ? 'PR Merged Notification' 
                          : notification.event === 'review' 
                            ? 'Review Completed Notification'
                            : 'Overdue Review Alert'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Via {notification.channel === 'email' ? 'Email' : 'Slack'} • 
                        {notification.event === 'merge' 
                          ? ' When a PR is merged with pending reviews' 
                          : notification.event === 'review'
                            ? ' When a post-merge review is completed'
                            : ' When a review is overdue'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notification.enabled}
                        onChange={() => toggleNotification(notification.id)}
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        notification.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}>
                        <div className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                          notification.enabled ? 'transform translate-x-5' : ''
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Flags */}
          <div>
            <h3 className="text-lg font-medium mb-4">Feature Flags</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="text-sm font-medium">Strict NBCR Enforcement</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Prevents merging new PRs if reviewers have overdue reviews
                  </p>
                </div>
                
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={strictMode}
                    onChange={() => setStrictMode(!strictMode)}
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                    strictMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}>
                    <div className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                      strictMode ? 'transform translate-x-5' : ''
                    }`}></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">Experimental Features</h4>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                      Beta
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable upcoming features like analytics and AI-powered suggestions
                  </p>
                </div>
                
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={experimentalFeatures}
                    onChange={() => setExperimentalFeatures(!experimentalFeatures)}
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                    experimentalFeatures ? 'bg-purple-600' : 'bg-gray-200'
                  }`}>
                    <div className={`absolute left-0.5 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                      experimentalFeatures ? 'transform translate-x-5' : ''
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-100">
        <h3 className="text-lg font-medium text-red-700 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-800">Reset All Settings</h4>
                <p className="text-xs text-red-600 mt-1">
                  This will reset all NBCR settings to their default values
                </p>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Reset
              </button>
            </div>
          </div>
          
          <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-800">Disable NBCR for All Repositories</h4>
                <p className="text-xs text-red-600 mt-1">
                  This will disable NBCR for all connected repositories
                </p>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4 mr-1.5" />
                Disable All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;