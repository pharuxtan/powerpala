[![Powerpala Light](/assets/github/light-logo.svg)](https://github.com/pharuxtan/powerpala#gh-light-mode-only)
[![Powerpala Dark](/assets/github/dark-logo.svg)](https://github.com/pharuxtan/powerpala#gh-dark-mode-only)

<p align="center">
  <a rel="LICENSE" href="https://github.com/pharuxtan/powerpala/blob/main/LICENSE">
    <img src="https://img.shields.io/static/v1?label=license&message=gpl%203.0&labelColor=111111&color=ff5c00&style=for-the-badge&logo=data%3Aimage/png%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpFAACAgwAA/FcAAIDoAAB5FgAA8QEAADtfAAAcheDStWoAAAFGSURBVHjarJK9LgRhFIafWUuiEH/rJwrJClEq3IELUKgo3IrETWh0FC7BNVih0AoKBQoEydq11qMwm5yMsbPEm3yZd55zvnfO92VQKVhLak09UZeL%2BrsVZ9Qdv2tXnf1NYEndUushZFGthvemuq32FwWuq%2BeZid5DvZGpXambeYGr6qnd9dGldqaudQL3QuFWvVbbmaC6%2BprDr9WbwA4SdQW4BwaABb50CTykfjjwC%2BAx9SPAfOANYDxRCXpOnxNAM4ePA63Ul8NHR4E2QClsGgGG0jUR%2BFjglcAn8/pj4HTwUz/42FPJ68lOSDhCkR/O46XM0Qh3VcRH83jph%2BZefKUosBr8XA%2B%2BmufLAR4Dh6k/CrzWA691YOc/3Ejv6iNM3k59Xw%2B8D3gC9hN1ErjjfzSbqHVg8J8CG2XgBXgL4/9VCdD6HACaHdcHGCRMgQAAAABJRU5ErkJggg%3D%3D" alt="License">
  </a>
</p>

----

# Powerpala

Powerpala est un client de modification pour l'ancien paladium launcher disponible en V8 & début V8.5, il vous permet d'y installer des plugins et des themes.

## Comment l'installer ?

### Prérequis

Vous aurez besoin d'installer Git et Node et d'avoir le Paladium Launcher

1. `git` - https://git-scm.com/downloads
2. `node` et `npm` - https://nodejs.org
3. Le `Paladium Launcher`
   - Windows: https://download.paladium-pvp.fr/launcher/download/Paladium.exe
   - macOS: https://download.paladium-pvp.fr/launcher/download/Paladium.dmg

à noter que powerpala ne fonctionne pas avec le launcher V7 qui est actuellement celui sur mac, cependant powerpala est déjà prêt pour le launcher V8

### Installation

Maintenant nous assumons que vous avez installé correctement Git et Node et que vous avez le Paladium Launcher.

1. Ouvrez une invite de commande/terminal (exemple: `CMD` si vous êtes sur Windows, ou `Terminal` si vous êtes sur macOS) - Pour ceux qui utilisent **Windows** n'exécutez surtout pas l'invite de commande avec les permissions d'administrateurs !
2. Dans l'ordre, tapez ces commandes dans le terminal ouvert précédemment:
   1. `git clone https://github.com/pharuxtan/powerpala`
   2. `cd powerpala`
   3. `npm run setup:inject`
3. Quittez le Paladium Launcher si il est toujours ouvert
4. Et démarrez le, powerpala devrait être injecté !

### Désinstallation

Pour déinstaller powerpala, allez toujours avec une invite de commande/terminal dans votre dossier contenant powerpala puis faite `npm run setup:uninject`, powerpala devrait être désinjecté, il vous reste plus qu'a supprimer le dossier de powerpala

## Crédits

Cet outil est basé sur le travail de [powercord](https://github.com/powercord-org) et de [vizality](https://github.com/vizality)
