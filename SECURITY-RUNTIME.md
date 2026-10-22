# Actualización de seguridad de Node.js — 21 de octubre de 2026

El aviso oficial incluye CVE-2026-111497 (ejecución remota mediante Brotli)
y otras vulnerabilidades de DNS, TLS y permisos:
https://nodejs.org/en/blog/vulnerability/october-2026-security-releases

Versiones mínimas corregidas: 22.23.4, 24.22.1 y 26.12.1.
`.nvmrc` selecciona 24.22.1; `engines.node` excluye las versiones anteriores
de esas ramas y las ramas sin soporte. Con nvm, ejecutar `nvm install` y
`nvm use` desde la carpeta que contiene este archivo; en nvm-windows,
usar `nvm install 24.22.1` y `nvm use 24.22.1`.

Antes de iniciar el proyecto, comprobar `node --version`, reinstalar las
dependencias con el gestor y lockfile originales y ejecutar sus pruebas o build.
Estos archivos no actualizan una instalación global de Node.js ni un servicio
ya iniciado. Si se despliega en un proveedor administrado, confirmar que usa
el parche dentro de la rama elegida, volver a desplegar y reiniciar procesos.
Un rango de engines puede producir solo una advertencia según el gestor.

Esta actualización selecciona el motor corregido; no certifica que todas las
dependencias de npm/yarn/bun carezcan de vulnerabilidades. Revisar sus avisos
por separado. No es evidencia de que el proyecto haya sido atacado.
