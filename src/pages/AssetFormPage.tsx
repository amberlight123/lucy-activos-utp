import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { AssetForm } from "../components/assets/AssetForm";
import { navigate } from "../hooks/useRouter";
import { createAsset, updateAssetWithRules } from "../services/assetService";
import { useLucyStore } from "../store/useLucyStore";

export function AssetFormPage({ assetId }: { assetId?: string }) {
  const store = useLucyStore();
  const asset = assetId ? store.assets.find((item) => item.id === assetId) : undefined;
  const currentUserName = store.currentUser?.name ?? "Usuario Lucy";

  if (assetId && !asset) return <p>Activo no encontrado.</p>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">{asset ? "Editar activo" : "Nuevo activo"}</h2>
        <p className="text-muted-foreground">Los cambios importantes se registran en historial técnico cuando aplican reglas críticas.</p>
      </div>
      <Card>
        <CardHeader title="Datos del activo" />
        <CardBody>
          <AssetForm
            initial={asset}
            locations={store.locations}
            units={store.units}
            responsibles={store.responsibles}
            onSubmit={async (input) => {
              if (asset) await updateAssetWithRules(store.provider, asset, input, store.assets, currentUserName);
              else await createAsset(store.provider, input, store.assets);
              await store.refresh();
              navigate(asset ? `/assets/${asset.id}` : "/assets");
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
