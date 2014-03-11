# Alonso

I read logs, I write to [Elasticsearch][0], I am everything you want to be (in a
log daemon).

## Install

`npm install --global alonso`

## Config

* `ELASTICSEARCH_HOSTS` - An comma separated list of Elasticsearch nodes, e.g. `localhost:9200,192.168.0.1:9201`
* `LOGS` - A comma separated list of files (they don't have to exist) to watch, e.g. `/var/log/syslog,/var/log/mail.log`

## Run

```
> alonso /var/log/mail.log # ships logs to local ES node
```

## Details

Alonso is a simple node process which watches logs and ships them to
elasticsearch. You can get a glimpse the moving pieces pretty easily by taking
a look at `index.js` and `bin/alonso` (spoiler, there's a cli version too!). But
if you're just curious, here's the run-down:

> Alonso spawns a process (by way of  [forever-monitor][1]) for each log file
> you provide it. Every time it sees a change in that file it reads from the
> last byte to the end and inserts each line (`\n` delimited) to the first
> available ES node.

[0]: http://www.elasticsearch.com/
[1]: https://github.com/nodejitsu/forever-monitor
