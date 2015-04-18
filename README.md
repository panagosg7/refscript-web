## Web platform of [RefScript](https://github.com/UCSD-PL/RefScript)

### Install dependencies (`bower` needed):

    $ sudo apt-get install lighttpd php5-cgi
    $ bower install

### Installing lighttpd:

#### Allow PHP

    $ sudo lighttpd-enable-mod fastcgi fastcgi-php


### Deploy app: 

    $ ./deploy.sh


## TODO

1. only allow invocation of rsc if TS passes
