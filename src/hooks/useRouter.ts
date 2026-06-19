import { useEffect, useState } from "react";

export function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return { path, navigate };
}
