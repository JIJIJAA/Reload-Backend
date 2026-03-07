# Reload Backend - Configuración LAN (2 jugadores)

Guía paso a paso para jugar con un amigo en red local (LAN) sin internet.

---

## Diagrama de red

```
[Servidor - 192.168.16.103]          [Amigo - 192.168.16.102]
        |                                       |
        |  Puerto 3551 (Backend API)            |
        |  Puerto 80   (XMPP / Matchmaker)      |
        |  Puerto 7777 (Game Server)            |
        +----------- Red LAN -------------------+
```

---

## Requisitos previos

- **Node.js** v18 o superior instalado en el servidor
- **MongoDB** instalado y corriendo en el servidor (`127.0.0.1:27017`)
- Ambas máquinas conectadas a la **misma red local (LAN)**
- El servidor tiene IP fija `192.168.16.103` (o ajustar `Config/config.json` si difiere)
- El **firewall** del servidor permite conexiones entrantes en los puertos **3551**, **80** y **7777**

---

## 1. Instalación en el servidor (192.168.16.103)

```bat
# Instalar dependencias de Node.js
npm install
```

O ejecutar `install_packages.bat` si está disponible.

---

## 2. Verificar la configuración (`Config/config.json`)

Asegúrate de que los siguientes valores estén presentes:

```json
"matchmakerIP": "192.168.16.103:80",
"gameServerIP": ["192.168.16.103:7777:playlist_defaultsolo", "192.168.16.103:7777:playlist_defaultduo"],
"serverIP": "192.168.16.103",
"allowedIPs": ["192.168.16.103", "192.168.16.102"]
```

---

## 3. Configurar el archivo `hosts` del amigo (192.168.16.102)

El amigo debe editar su archivo `hosts` para que el juego apunte al servidor LAN.

**Ruta en Windows:** `C:\Windows\System32\drivers\etc\hosts`

Abrir el archivo como **Administrador** y añadir al final:

```
192.168.16.103  prod.ol.epicgames.com
192.168.16.103  api.epicgames.dev
192.168.16.103  account-public-service-prod.ol.epicgames.com
192.168.16.103  friends-public-service-prod06.ol.epicgames.com
192.168.16.103  presence-public-service-prod.ol.epicgames.com
192.168.16.103  lightswitch-public-service-prod06.ol.epicgames.com
192.168.16.103  fortnite-public-service-prod11.ol.epicgames.com
192.168.16.103  fngw-mcp-gc-livefn.ol.epicgames.com
```

Guardar y cerrar. Verificar con `ping prod.ol.epicgames.com` — debe responder desde `192.168.16.103`.

---

## 4. Iniciar el backend (en el servidor)

Ejecutar `start_lan.bat` o correr directamente:

```bat
node index.js
```

Deberías ver en la consola:
```
Welcome to Reload Backend

  Server IP  : 192.168.16.103
  Allowed IPs: 192.168.16.103, 192.168.16.102

Backend started listening on port 3551 (SSL Disabled)
XMPP and Matchmaker started listening on port 80 (SSL Disabled)
App successfully connected to MongoDB!
```

---

## 5. Crear cuentas para ambos jugadores

Desde un navegador (en cualquiera de las dos máquinas), ir a:

```
http://192.168.16.103:3551/
```

O usar la API directamente:

```
POST http://192.168.16.103:3551/account/api/oauth/token
```

Consulta el `README.md` principal para ver cómo registrar usuarios.

---

## 6. Conectar el juego al backend

1. Asegúrate de que el cliente de Fortnite usa un **launcher/patcher** que apunte al backend (por ejemplo, Isekai, FNLauncher, o similar compatible con servidores privados).
2. El launcher debe configurarse para conectarse a `192.168.16.103:3551`.
3. Iniciar sesión con las credenciales creadas en el paso anterior.

---

## 7. Troubleshooting común

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| El amigo no puede conectarse | Firewall bloqueando | Abrir puertos 3551, 80 y 7777 en el firewall del servidor |
| `ping prod.ol.epicgames.com` no responde desde el amigo | Archivo `hosts` mal editado | Verificar permisos y guardar el archivo `hosts` correctamente |
| MongoDB no conecta | MongoDB no está corriendo | Iniciar el servicio: `net start MongoDB` |
| Puerto 80 ocupado | Otro servicio usa el puerto 80 | Detener IIS, Apache u otros servidores web |
| El juego no encuentra sesión | Game server no está corriendo | Asegurarse de que el game server esté activo en el puerto 7777 |
