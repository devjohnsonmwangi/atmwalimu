import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

type Notification = {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read?: boolean;
};
// Sample notifications for demonstration

const sampleNotifications: Notification[] = [
  { id: '1', title: 'Welcome to @mwalimu', body: 'Thanks for joining — explore articles and services to get started.', createdAt: new Date().toISOString(), read: false },
  { id: '2', title: 'New Article Published', body: 'A new article on exam tips has been posted.', createdAt: new Date().toISOString(), read: false },
  { id: '3', title: 'Document Approved', body: 'Your uploaded document has been approved and is now public.', createdAt: new Date().toISOString(), read: true },
];

const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>(sampleNotifications);

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setItems([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="pt-14" />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell /> Notifications</h1>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} className="btn btn-sm">Mark all read</button>
            <button onClick={clearAll} className="btn btn-sm btn-ghost">Clear</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-800 rounded-lg text-center shadow">
            <p className="text-lg">You're all caught up.</p>
            <p className="text-sm text-slate-500 mt-2">Explore our <Link to="/articles" className="text-primary font-semibold">latest articles</Link> or <Link to="/services" className="text-primary font-semibold">services</Link>.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(n => (
              <div key={n.id} className={`p-4 bg-white dark:bg-slate-800 rounded-lg shadow flex justify-between items-start ${n.read ? 'opacity-70' : 'border-l-4 border-primary'}`}>
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  {n.body && <p className="text-sm text-slate-500 dark:text-slate-300">{n.body}</p>}
                  <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!n.read ? <button onClick={() => markRead(n.id)} className="btn btn-xs btn-primary">Mark read</button> : <span className="text-sm text-slate-400">Read</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
