# Alonso

Alonso quickly and quietly pass along your local log files to a central server
for long term storage and indexing. It is designed to collect logs from all
your different operating environments (development through to production) so
you can have a context for where events have — and are currently — taken
place. This probably isn't a one size fits all solution, I'm developing it
selfishly for internal use.

## *Alpha Warning*

Yep, this is an early version, use with caution. At this *very* moment,
nothing works. Eventually I'll try and support a list of features, until then,
have fun.

## Design

### Harvester

Each remote node has a running instance of a harvester which will broadcast
events to it's node's logfiles. A harvester is configured with a simple JSON
conf file.

#### Example

```json
{
	"name" : "My Harvester",
	"description" : "How much do I love thee? Let me count the ways."
	"remote" : {
		"host" : "http://example.com",
		"port" : "1234"
	},
	"watch" : [
		"/var/log/apache2/*",
		"/var/log/alonso/harvester.log"
	]
}
```

The harvester doesn't persist any of the events locally, obviously it doesn't
need to do that. It does however provide a web interface which shows the
current configuration and a realtime view of all local events.

### Server



## References

Many of the core ideas are taken directly from similar projects that didn't
fit our original needs. So, if you're looking for similar solutions, please
check out:

* [Log.io](https://github.com/NarrativeScience/Log.io)
* [Hummingbird](https://github.com/mnutt/hummingbird)
