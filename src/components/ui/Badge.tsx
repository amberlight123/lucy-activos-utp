import type { AssetStatus } from "../../types/asset";
import { statusTone } from "../../utils/status";

export function StatusBadge({ status }: { status: AssetStatus }) {
  return <span className={`badge ${statusTone(status)}`}>{status}</span>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge bg-muted text-muted-foreground">{children}</span>;
}
