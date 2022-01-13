#!/bin/sh
# This is a comment!
already=$(adb devices | grep '\tdevice' )
if [[ $already != '' ]]
then
npx react-native run-android --variant=release
else
ipg=$(netstat -nr | grep 'default' )
getip="$(grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' <<< "$ipg")"

if [[ $getip != '' ]]
then
failed=$(adb connect $getip:5555 | grep 'failed' )
else
	failed='neverfail'
fi
if [[ $failed == '' ]]
	then
		adb connect $getip:5555
npx react-native run-android --variant=release
else
	myip=$(ipconfig getifaddr en0)
scanip="$(grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' <<< "$myip").0/24"
nmap -sP $scanip
# 48:9D:D1:38:67:49
# 8:7f:98:97:dc:47
f=$(arp -a | grep "8:7f:98:97:dc:47")
ip="$(grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' <<< "$f")"
adb connect $ip:5555
if [[ $ip != '' ]]
then
npx react-native run-android --variant=release
else 
	echo "\n\n WTF! BRO!!! CONNECT TO ANY NETWORK FIRST -_-\n\n"
fi
fi
fi