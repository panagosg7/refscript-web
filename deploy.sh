#! /bin/bash

sudo rsync -avzh --chmod=755 --exclude '.*.swp' ./ /var/www/html/

sudo /etc/init.d/lighttpd force-reload

