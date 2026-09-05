# Hemodent - Cartilla Dental para Pacientes con Hemofilia

**Hemodent** es una aplicación móvil educativa e interactiva diseñada para guiar a pacientes con hemofilia (y a sus cuidadores) en el cuidado de su salud bucodental. Proporciona información especializada, herramientas de seguimiento y asistencia en caso de emergencias dentales, adaptándose a las diferentes etapas de la vida del paciente.

## 🚀 Tecnologías Principales

El proyecto está construido utilizando tecnologías modernas para el desarrollo móvil multiplataforma:

*   **Framework:** [React Native](https://reactnative.dev/) (v0.83)
*   **Plataforma/Tooling:** [Expo](https://expo.dev/) (SDK 55)
*   **Enrutamiento:** [Expo Router](https://docs.expo.dev/router/introduction/) (Basado en archivos)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para un tipado estricto y código seguro.
*   **Almacenamiento Local:** AsyncStorage (`@react-native-async-storage/async-storage`)
*   **Animaciones:** React Native Reanimated (`react-native-reanimated`)
*   **Otras librerías clave:** `expo-notifications`, `expo-audio`, `@react-native-community/datetimepicker`.

## 📁 Estructura del Proyecto

La aplicación utiliza la arquitectura basada en rutas (file-based routing) proporcionada por Expo Router.

```text
cartilla_app/
├── app/                  # Rutas de la aplicación (Expo Router)
│   ├── _layout.tsx       # Layout principal y configuración de navegación
│   ├── index.tsx         # Punto de entrada inicial
│   ├── intro.tsx         # Pantalla de introducción
│   ├── onboarding.tsx    # Flujo de bienvenida y configuración inicial
│   ├── main-menu.tsx     # Menú principal de la aplicación
│   ├── age-selector.tsx  # Selección del rango de edad del paciente
│   ├── knowledge-hub.tsx # Centro de conocimiento e información educativa
│   ├── glossary.tsx      # Glosario de términos médicos/odontológicos
│   ├── age/              # Sub-rutas específicas por grupo de edad
│   ├── calendar/         # Funcionalidades de calendario y recordatorios de citas
│   ├── emergency/        # Protocolos y contactos para emergencias dentales
│   └── timer/            # Temporizador de cepillado dental
│
├── src/                  # Código fuente, lógica y componentes reutilizables
│   ├── components/       # Componentes de la interfaz de usuario (UI)
│   ├── data/             # Datos estáticos (ej. contenido de la cartilla, glosario)
│   ├── services/         # Servicios (ej. notificaciones, almacenamiento local)
│   ├── theme/            # Configuración de estilos, colores, fuentes (UI Theme)
│   └── utils/            # Funciones utilitarias y helpers
│
├── assets/               # Imágenes, fuentes, audios y otros recursos estáticos
├── app.json              # Configuración global del proyecto Expo (nombre, íconos, splash)
├── package.json          # Dependencias y scripts de Node.js
├── babel.config.js       # Configuración de Babel
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Documentación del proyecto (este archivo)
```

## ✨ Funcionalidades Principales

*   **Adaptabilidad por Edad (`app/age/`):** El contenido y las recomendaciones se ajustan dependiendo de la etapa de desarrollo dental del paciente.
*   **Centro de Conocimiento (`knowledge-hub.tsx`):** Información detallada sobre el cuidado dental específico para pacientes con trastornos de la coagulación.
*   **Temporizador de Cepillado (`app/timer/`):** Herramienta interactiva para asegurar un tiempo adecuado de higiene oral.
*   **Sección de Emergencias (`app/emergency/`):** Acceso rápido a protocolos de acción en caso de sangrado bucal prolongado o traumatismos.
*   **Calendario y Recordatorios (`app/calendar/`):** Seguimiento de citas odontológicas y recordatorios de profilaxis o profilaxis dental usando notificaciones locales.
*   **Glosario (`glossary.tsx`):** Diccionario integrado para comprender términos odontológicos y hematológicos.

## 🛠 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión LTS recomendada)
*   [Git](https://git-scm.com/)
*   Dispositivo físico (iOS/Android) con la aplicación **Expo Go** instalada, o un emulador/simulador configurado en tu computadora.

### Pasos

1.  **Clonar el repositorio** (si aplica) o navegar a la carpeta del proyecto:
    ```bash
    cd cartilla_app
    ```

2.  **Instalar dependencias:**
    Usando npm:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm start
    ```
    *(Este comando es equivalente a `expo start`)*

4.  **Abrir la aplicación:**
    *   Presiona `a` en la terminal para abrir en un emulador de Android.
    *   Presiona `i` en la terminal para abrir en un simulador de iOS (requiere Mac).
    *   Escanea el **código QR** que aparece en la terminal usando la cámara de tu dispositivo iOS o la aplicación Expo Go en Android.

## 📜 Scripts Disponibles

En el archivo `package.json` están definidos los siguientes scripts que puedes ejecutar con `npm run <script>`:

*   `start`: Inicia el servidor de desarrollo de Expo.
*   `android`: Compila e inicia la aplicación nativamente en un emulador/dispositivo Android (`expo run:android`).
*   `ios`: Compila e inicia la aplicación nativamente en un simulador/dispositivo iOS (`expo run:ios`).
*   `web`: Inicia la aplicación en el navegador web.

## 🔧 Configuración Adicional

*   **EAS (Expo Application Services):** El proyecto tiene configurado un ID de proyecto en `app.json` (`ca2975b4-1511-4c78-a364-bca0c833f71a`) para compilaciones en la nube utilizando EAS Build.
*   **Iconos y Splash Screen:** Los recursos visuales principales se encuentran en `./assets/images/` (ej. `icon.png`, `adaptive-icon.png`, `favicon.png`).

---
*Este proyecto es parte de un trabajo de tesis para mejorar la calidad de vida y el cuidado dental de pacientes con hemofilia.*
