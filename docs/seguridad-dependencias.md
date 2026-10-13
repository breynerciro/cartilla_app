# Seguridad de dependencias

**Revisión:** 2026-10-09

**Resultado:** `npm audit` pasó de **32 alertas** (11 moderadas, 20 altas, 1 crítica) a **22** (3 moderadas, 19 altas, 0 críticas).

## Qué se corrigió

| Paquete | Versión | Advisory | Severidad | Cómo |
| --- | --- | --- | --- | --- |
| `shell-quote` | 1.10.0 → 1.12.0 | GHSA-pqg4-j6r4-53mv | Crítica | Override en la raíz. Llega por `react-native` → `react-devtools-core`. |
| `sharp` | 0.35.4 → 0.35.5 | GHSA-wq5f-xc86-pv6w | Alta | Subida directa en `devDependencies`. |
| `uuid` | 7.0.3 → 11.1.1 | GHSA-w5hq-g745-h8pq | Moderada | Override anidado bajo `xcode`. Llega por `@expo/config-plugins` → `xcode`. |

## Overrides aplicados

```json
"overrides": {
  "shell-quote": "^1.11.0",
  "xcode": { "uuid": "^11.1.1" }
}
```

- **`shell-quote`**: no cambia de major (sigue en 1.x). Lo puedes quitar cuando `react-native` traiga una `react-devtools-core` que ya pida `shell-quote` 1.11 o superior.
- **`uuid`**: va anidado bajo `xcode` para no tocar a otros paquetes que usen `uuid`. **Ojo: cruza de major (7 → 11).** Funciona porque `xcode` solo llama a `uuid.v4()` con `require()`, y uuid 11 conserva esa API en CommonJS. Se verificó con `expo prebuild --platform ios`, que genera los UUID del `project.pbxproj` con esta versión. No subas a uuid 12 o superior: solo trae ESM y rompe el `require('uuid')` de `xcode`.
  - **Reevalúalo** cada vez que Expo cambie la versión de `xcode` o de `@expo/config-plugins` (por ejemplo, al migrar de SDK). Si la versión nueva ya trae un `uuid` parcheado, borra el override.

## Riesgo aceptado: lo que queda

Estas tres vulnerabilidades no tienen una corrección que se pueda aplicar hoy sin romper el SDK 57.

| Advisory | Paquete | Severidad | Dónde corre | Por qué se acepta | Qué lo resolvería |
| --- | --- | --- | --- | --- | --- |
| GHSA-vfj7-8cjw-p6xm | `braces` 3.0.3 (vía `metro-file-map` → `micromatch`) | Alta | Máquina de desarrollo y build de EAS, dentro de Metro. No llega al celular. | Es un DoS con patrones glob muy anidados, y esos patrones salen de la configuración de Metro, que controla el desarrollador. No hay versión parcheada publicada. | Issue upstream [micromatch/braces#70](https://github.com/micromatch/braces/issues/70) |
| GHSA-86w9-cpqp-85rv | `node-forge` 1.4.0 (vía `@expo/cli` y `@expo/code-signing-certificates`) | Alta | Máquina de desarrollo y EAS, dentro del CLI. No llega al celular. | Es una falla en la verificación de firmas RSA PKCS#1 v1.5. En Expo solo se usa para el code signing de `expo-updates`, y la app no usa `expo-updates`. No hay versión parcheada publicada. | PR [digitalbazaar/forge#1152](https://github.com/digitalbazaar/forge/pull/1152) |
| GHSA-vcc3-ghjq-m6fr | `decode-uri-component` 0.2.2 (vía `expo-router` → `query-string` 7.1.3) | Moderada | Celular: está en el bundle JS. | `expo-router` lee los deep links con `URL.searchParams`, no con `query-string`, que solo usa para armar rutas. En el peor caso se cuelga el hilo JS, sin fuga de datos. El parche (0.5.0) solo trae ESM y rompe `query-string` 7.1.3. | SDK 58 estable: `expo-router` 58 ya no usa `query-string`. |

**Las otras 19 alertas no son vulnerabilidades distintas.** Son esas mismas tres, propagadas: `npm audit` marca como vulnerable a todo paquete que dependa de uno afectado, ya sea directamente o por `peerDependencies`. Por eso aparecen `metro*`, `@expo/metro*`, `@expo/cli`, `expo`, `react-native`, `react-native-reanimated`, `react-native-worklets` y `@react-native-community/datetimepicker`, entre otros.

## Cuándo revisar de nuevo

- Al migrar a SDK 58 estable.
- Cuando salga el parche de `braces` o el de `node-forge`.

Para revisar:

```bash
npm audit
npm ls uuid shell-quote   # confirma si los overrides siguen haciendo falta
```

Si cambias los overrides, confirma después que todo siga en orden con `npm ci`, `./node_modules/.bin/expo install --check` y `npx expo-doctor`.

## No uses `npm audit fix --force`

Para "arreglar" lo que queda, baja `expo` a 44 (y con él `react-native` a 0.72) y sube `expo-router` a 58. Eso rompe la alineación con el SDK 57 y la app deja de compilar. Tampoco uses `npm audit fix` sin `--force`: mueve `@expo/cli` de lugar dentro del árbol y ensucia el lock sin corregir nada de lo que queda.
