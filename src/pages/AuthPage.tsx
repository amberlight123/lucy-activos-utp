import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useLucyStore } from "../store/useLucyStore";

const demoPassword = "Demo1234*";

const roleDots: Record<string, string> = {
  "Gestión local": "bg-primary",
  "Técnico ejecutor": "bg-teal-600",
  Supervisor: "bg-amber-600",
  "Gestión de insumos": "bg-green-600",
  Dirección: "bg-primary",
  Administración: "bg-slate-600",
  Consulta: "bg-slate-500",
};

export function AuthPage() {
  const { login, users } = useLucyStore();
  const [email, setEmail] = useState("gestion@utp.ac.pa");
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState("");

  function attemptAuth(nextEmail = email, nextPassword = password) {
    setError("");
    const result = login(nextEmail, nextPassword);
    if (!result.ok) setError(result.message ?? "No se pudo iniciar sesión.");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    attemptAuth();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_1fr]">
        <section className="relative overflow-hidden border-r border-border bg-card px-8 py-10 lg:px-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute right-[-18%] top-[-12%] h-80 w-80 rounded-full border border-primary/25 bg-primary/10 blur-3xl" />
          <div className="relative flex min-h-full flex-col justify-between gap-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">Lucy</p>
                <p className="text-sm text-muted-foreground">Inventario operativo UTP</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Gestión inteligente de activos institucionales
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Administra equipos, ubicaciones, responsables, garantías, repuestos e historial técnico desde una base operativa institucional.
              </p>
              <div className="mt-10 space-y-5">
                <Feature icon={<ShieldCheck className="h-5 w-5" />} text="Trazabilidad técnica por activo y responsable" />
                <Feature icon={<Sparkles className="h-5 w-5" />} text="Alertas por garantía, repuestos y adquisición" />
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">Universidad Tecnológica de Panamá</p>
          </div>
        </section>

        <main className="flex items-center justify-center px-6 py-10">
          <section className="app-card w-full max-w-md p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Accede con una cuenta institucional autorizada para consultar y gestionar activos.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submit}>
              {error ? <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-red-100">{error}</div> : null}

              <label className="block space-y-2 text-sm font-medium">
                <span>Correo</span>
                <span className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="usuario@utp.ac.pa"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </span>
              </label>

              <label className="block space-y-2 text-sm font-medium">
                <span>Contraseña</span>
                <span className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </span>
              </label>

              <button
                className="btn btn-primary w-full py-3"
                type="submit"
              >
                Entrar
              </button>
            </form>

            <div className="my-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              Cuentas demo
              <span className="h-px flex-1 bg-border" />
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              Toca una cuenta para autocompletar. Contraseña común <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-foreground">{demoPassword}</span>
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {users.map((user) => (
                <button
                  className="rounded-lg border border-border bg-background px-3 py-3 text-left transition hover:border-primary/60 hover:bg-muted"
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(demoPassword);
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${roleDots[user.role]}`} />
                    <span>
                      <span className="block text-sm font-semibold">{user.role}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-primary">
        {icon}
      </div>
      <p className="font-medium text-foreground">{text}</p>
    </div>
  );
}
