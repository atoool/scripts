#!/bin/sh
# This is a comment!
myip=$(ipconfig getifaddr en0)
scanip="$(grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' <<< "$myip").0/24"
nmap -sP $scanip
# 48:9D:D1:38:67:49
# 8:7f:98:97:dc:47
f=$(arp -a | grep "8:7f:98:97:dc:47")
ip="$(grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' <<< "$f")"
adb connect $ip:5555
read -p "app name : " app
if [ $app == 'vcare' ]
then 
	path="ios/vcare"
	bundleID="com/vcareservice/vcarecars"
elif [ $app == "getfit" ]
then
	path="testios/getfit"
	bundleID="com/getfit"
elif [ $app == "vcs" ]
then
	path="ios/vcaresupervisor"
	bundleID="com/vcaresupervisor"

elif [ $app == "o" ]
then
	read -p "path : " path
	read -p "bundleID as path : " bundleID
fi
myipp=$myip:8081
file=desktop/$path/android/app/src/main/java/$bundleID/MainActivity.java
if [ $app == 'o' ]
then
	# imports='import android.content.SharedPreferences;'+\n'import android.os.Bundle;'\n'import android.preference.PreferenceManager;'\n
	# pref='}'\n\n'@Override'\n'protected void onCreate(Bundle state) {'\n'super.onCreate(state);'\n\n'SharedPreferences preferences ='\n'PreferenceManager.getDefaultSharedPreferences(getApplicationContext());'\n'preferences.edit().putString("debug_http_host", "192.168.52.158:8081").apply();'\n'}'
	# a="elif [ $"app" == '$newapp' ]"
	# b='then \ path=$path'
	# c='bundleID=$bundleID'
	# d='elif [ $app == "o" ]'
	# sed -i '' "8s/.*/$imports/" $file
	# sed -i '' "27s/.*/$pref/" $file
	# sed -i '' "20s/.*/$a/" 'desktop/adbConnect.sh'
	open $file
	open 'desktop/testios/getfit/android/app/src/main/java/com/getfit/MainActivity.java'
else
	text='preferences.edit().putString("debug_http_host", "'$myipp'").apply();'
	sed -i '' "37s/.*/$text/" $file
	cd desktop/$path/
	if [[ $app == 'vcare' ]]; then
		read -p "variant : " variant
		if [ $variant == 'r' ]
		then
			read -p "version : " ver
			version='Version 1.2.'$ver' (beta)'
			sed -i '' "48s/.*/$version/" 'src/components/LoadingScreen.js'
			npx react-native run-android --variant=release
		else
			npx react-native run-android
		fi
	else
		npx react-native run-android
	fi
fi