import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    isOnline?: boolean;
}

export function Header({ title = "Dashboard", subtitle, isOnline = true }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
            {/* Left section */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold">{title}</h1>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search modules..."
                        aria-label="Search modules"
                        className="h-9 w-64 rounded-lg border border-border/50 bg-muted/30 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Status badge */}
                <Badge
                    variant={isOnline ? "default" : "destructive"}
                    className={`gap-1.5 ${isOnline ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20' : ''}`}
                >
                    <span className="relative flex h-1.5 w-1.5">
                        {isOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOnline ? 'bg-green-400' : 'bg-destructive'}`}></span>
                    </span>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Badge>

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                        3
                    </span>
                </Button>

                {/* User menu */}
                <Button
                    variant="ghost"
                    className="gap-2 px-2"
                    aria-label="User menu"
                >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">Sovereign</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        </header>
    );
}
