
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: number;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!currentUser) return;

    requestNotificationPermission();

    const exampleNotifications: Notification[] = [
      {
        id: '1',
        title: t('notifications.newProperty'),
        body: t('notifications.propertyMatch'),
        read: false,
        timestamp: Date.now() - 3600000,
      },
      {
        id: '2',
        title: t('notifications.priceAlert'),
        body: 'A property you saved has dropped in price!',
        read: false,
        timestamp: Date.now() - 86400000,
      },
    ];

    setNotifications(exampleNotifications);
    setUnreadCount(exampleNotifications.filter(n => !n.read).length);

    const unsubscribe = onMessageListener();

    return () => {
      unsubscribe();
    };
  }, [currentUser, t]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h4 className="font-medium">{t('notifications.title')}</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="w-full flex justify-between items-start">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              {t('notifications.noNotifications')}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
