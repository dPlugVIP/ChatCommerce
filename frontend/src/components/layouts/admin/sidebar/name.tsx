import { StoreIcon } from "lucide-react";

export default function AdminPlatformName() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <StoreIcon />
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-lg font-bold text-sidebar-primary">ChatCommerce</p>
        <p className="truncate text-xs text-sidebar-foreground/60">Admin Portal</p>
      </div>
    </div>
  );
}
