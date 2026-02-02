
export const Badge = ({ children, className, variant }: any) => {
    const v = variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground';
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${v} ${className}`}>{children}</span>;
}
