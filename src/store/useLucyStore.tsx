import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { mockUsers } from "../data/mock/users.mock";
import { MockLucyDataProvider } from "../providers/MockLucyDataProvider";
import type { LucyDataProvider } from "../providers/LucyDataProvider";
import type { Asset } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { Location } from "../types/location";
import type { AssetEvent } from "../types/maintenance";
import type { Responsible } from "../types/responsible";
import type { MockUser } from "../types/user";
import type { Unit } from "../types/unit";

type LucyState = {
  provider: LucyDataProvider;
  assets: Asset[];
  events: AssetEvent[];
  incidents: ExternalIncident[];
  locations: Location[];
  units: Unit[];
  responsibles: Responsible[];
  users: MockUser[];
  currentUser: MockUser | null;
  loading: boolean;
  refresh(): Promise<void>;
  login(email: string, password: string): { ok: boolean; message?: string };
  logout(): void;
  resetData(): Promise<void>;
};

const provider = new MockLucyDataProvider();
const LucyContext = createContext<LucyState | null>(null);
const sessionKey = "lucy.session.userId";

function readUsers() {
  return mockUsers;
}

function readSessionUser() {
  const userId = localStorage.getItem(sessionKey);
  return readUsers().find((user) => user.id === userId) ?? null;
}

export function LucyStoreProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<AssetEvent[]>([]);
  const [incidents, setIncidents] = useState<ExternalIncident[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [users] = useState<MockUser[]>(readUsers);
  const [currentUser, setUser] = useState<MockUser | null>(readSessionUser);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [nextAssets, nextLocations, nextUnits, nextResponsibles, nextIncidents] = await Promise.all([
      provider.listAssets(),
      provider.listLocations(),
      provider.listUnits(),
      provider.listResponsibles(),
      provider.listIncidents(),
    ]);
    const eventLists = await Promise.all(nextAssets.map((asset) => provider.listAssetEvents(asset.id)));
    setAssets(nextAssets);
    setLocations(nextLocations);
    setUnits(nextUnits);
    setResponsibles(nextResponsibles);
    setIncidents(nextIncidents);
    setEvents(eventLists.flat());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<LucyState>(
    () => ({
      provider,
      assets,
      events,
      incidents,
      locations,
      units,
      responsibles,
      users,
      currentUser,
      loading,
      refresh,
      login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
        if (!user) return { ok: false, message: "No existe una cuenta con ese correo." };
        if (password.trim() !== "Demo1234*") return { ok: false, message: "Contraseña incorrecta para la cuenta demo." };
        localStorage.setItem(sessionKey, user.id);
        setUser(user);
        return { ok: true };
      },
      logout() {
        localStorage.removeItem(sessionKey);
        setUser(null);
      },
      async resetData() {
        await provider.reset();
        await refresh();
      },
    }),
    [assets, currentUser, events, incidents, loading, locations, refresh, responsibles, units, users],
  );

  return <LucyContext.Provider value={value}>{children}</LucyContext.Provider>;
}

export function useLucyStore() {
  const value = useContext(LucyContext);
  if (!value) throw new Error("useLucyStore debe usarse dentro de LucyStoreProvider.");
  return value;
}
