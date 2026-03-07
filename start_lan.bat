@echo off
echo ============================================
echo   Reload Backend - Modo LAN
echo ============================================
echo.
echo   Servidor (tu IP): 192.168.16.103
echo   Amigo (su IP):    192.168.16.102
echo.
echo   Backend Port:     3551
echo   XMPP/Matchmaker:  80
echo   Game Server:      7777
echo.
echo   Tu amigo debe redirigir estas URLs a 192.168.16.103:
echo     - 127.0.0.1 -^> 192.168.16.103 (en su archivo hosts)
echo.
echo ============================================
echo.
node index.js
pause
