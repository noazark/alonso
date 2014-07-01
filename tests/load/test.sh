# setup fake server (subprocess)
# watch file (subprocess)
# write to file
# count how many times the server was hit


curl localhost:3000/_flush

time for i in {1..100000}
do
	echo 'hello world
	' >> ./tmp/load-test.log

	sleep 0.00001
done
