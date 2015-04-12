#! /bin/bash

sudo rsync -avzh --chmod=755 --exclude '.git' --exclude '.*.swp' ./ /var/www/html/

sudo /etc/init.d/lighttpd force-reload

