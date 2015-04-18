#! /bin/bash

# sudo rsync -avzh --usermap=*:www-data --groupmap=*:www-data --include '*/' --include '*.ts' --exclude '*' --prune-empty-dirs ../RefScript/tests/ /var/www/refscript/tests

tsc --outDir js --module amd ts/worker.ts
tsc --outDir js --module amd ts/app.ts

sudo rsync -avzh --usermap=*:www-data --groupmap=*:www-data --exclude '.git' --exclude '.*.swp' ./ /var/www/refscript

sudo /etc/init.d/lighttpd force-reload
# sudo service apache2 restart

