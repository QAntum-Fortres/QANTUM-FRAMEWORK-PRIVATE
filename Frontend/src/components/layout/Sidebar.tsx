import { useState } from 'react';
import {
    LayoutDashboard,
    Activity,
    Wallet,
    Settings,
    Shield,
    Zap,
    BarChart3,
    Bell,
    ChevronLeft,
    ChevronRight,
    Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
    badge?: string;
}

const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', href: '#', active: true },
    { icon: <Activity className="h-5 w-5" />, label: 'Metrics', href: '#metrics' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', href: '#analytics' },
    { icon: <Wallet className="h-5 w-5" />, label: 'Economy', href: '#economy' },
    { icon: <Zap className="h-5 w-5" />, label: 'Energy Grid', href: '#energy' },
    { icon: <Shield className="h-5 w-5" />, label: 'Security', href: '#security' },
    { icon: <Cpu className="h-5 w-5" />, label: 'Orchestrator', href: '#orchestrator' },
];

const bottomItems: NavItem[] = [
    { icon: <Bell className="h-5 w-5" />, label: 'Notifications', href: '#notifications', badge: '3' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '#settings' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
                "bg-background/80 backdrop-blur-xl border-r border-border/50",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-glow">
                            <Cpu className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                            QANTUM
                        </span>
                    </div>
                )}
                {collapsed && (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto animate-glow">
                        <Cpu className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                title={item.label}
                                aria-label={item.label}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "hover:bg-accent/50",
                                    item.active
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className={cn(item.active && "text-primary")}>
                                    {item.icon}
                                </span>
                                {!collapsed && <span>{item.label}</span>}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <div className="my-4 mx-4 border-t border-border/50" />

                {/* Bottom items */}
                <ul className="space-y-1 px-2">
                    {bottomItems.map((item) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                title={item.label}
                                aria-label={item.label}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                )}
                            >
                                <span className="relative">
                                    {item.icon}
                                    {item.badge && (
                                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-destructive-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </span>
                                {!collapsed && <span>{item.label}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Collapse toggle */}
            <div className="absolute bottom-4 right-0 translate-x-1/2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full border-border/50 bg-background shadow-md"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="h-3 w-3" />
                    ) : (
                        <ChevronLeft className="h-3 w-3" />
                    )}
                </Button>
            </div>

            {/* Status indicator */}
            {!collapsed && (
                <div className="p-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Operational
                    </div>
                </div>
            )}
        </aside>
    );
}
