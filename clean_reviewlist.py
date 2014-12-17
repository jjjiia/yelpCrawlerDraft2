#!/usr/bin/env python

import urllib2
import sys
import json
from bs4 import BeautifulSoup, NavigableString
import re
import csv
import datetime
import os
import time
import random
import math
import urllib
from PIL import Image
from StringIO import StringIO
import requests
import fileinput
import geopy
import hashlib
import hmac
import base64
import urlparse
import glob

inputfile = open("restaurant_info_clean_nodups.csv","r")
outputfile = open("restaurant_info_clean_nodups_geo2.csv", "a+")

# remove annoying characters
chars = {
    '\xc2\x82' : ',',        # High code comma
    '\xc2\x84' : ',,',       # High code double comma
    '\xc2\x85' : '...',      # Tripple dot
    '\xc2\x88' : '^',        # High carat
    '\xc2\x91' : '\x27',     # Forward single quote
    '\xc2\x92' : '\x27',     # Reverse single quote
    '\xc2\x93' : '\x22',     # Forward double quote
    '\xc2\x94' : '\x22',     # Reverse double quote
    '\xc2\x95' : ' ',
    '\xc2\x96' : '-',        # High hyphen
    '\xc2\x97' : '--',       # Double hyphen
    '\xc2\x99' : ' ',
    '\xc2\xa0' : ' ',
    '\xc2\xa6' : '|',        # Split vertical bar
    '\xc2\xab' : '<<',       # Double less than
    '\xc2\xbb' : '>>',       # Double greater than
    '\xc2\xbc' : '1/4',      # one quarter
    '\xc2\xbd' : '1/2',      # one half
    '\xc2\xbe' : '3/4',      # three quarters
    '\xca\xbf' : '\x27',     # c-single quote
    '\xcc\xa8' : '',         # modifier - under curve
    '\xcc\xb1' : '',          # modifier - under line
	'\\xc3\\x82':''
}

def replace_chars(match):
	
    char = match.group(0)
    return chars[char]
#return re.sub('(' + '|'.join(chars.keys()) + ')', replace_chars, text)

def cleanReviews():
	spamreader = csv.reader(inputfile)
	spamwriter = csv.writer(outputfile)
	for row in spamreader:
		#if len(row) == 6:
		cleanrow = []
		for item in row:
			print item
			cleanItem = item.strip()
			#cleanItem = re.sub('(' + '|'.join(chars.keys()) + ')', replace_chars, cleanItem)
			cleanrow.append(cleanItem)
		#print cleanrow
		#spamwriter.writerow(cleanrow)	
		
			
key1 = "AIzaSyBK0NFEiJvyYINdriuet8fObfWIEDwjNbM"
key2 = "AIzaSyBZnvqy9HEpG-LAQwm_AxDOegMciI9jgP4"
#locator = geopy.geocoders.GoogleV3(api_key = key2)
GOOGLE_PRIVATE_KEY = "7HyrvDsrV6trC91E-E7F6xpjWjs="
GOOGLE_CLIENT_ID = "gme-mitisandt"
locator = geopy.geocoders.GoogleV3(client_id = GOOGLE_CLIENT_ID, secret_key=GOOGLE_PRIVATE_KEY)				
def geocodeRestaurants(address):
	location = locator.geocode(address, exactly_one=True)
	time.sleep(1)
	if location!= None:
		lng = location.longitude
		lat = location.latitude
		return [lng, lat]
	else:
		return "no location"

def geocodedAddresses():
	addressfile = open("restaurant_info_clean_nodups_geo2.csv", "r")
	addressReader = csv.reader(addressfile)
	finishedAddresses = []
	for row in addressReader:
		address = row[4]
		coordinates = row[-1]
		print coordinates
		finishedAddresses.append(address)
	print finishedAddresses
	return finishedAddresses

	
def cleanRestaurants(finishedList):
	print finishedList
	spamreader = csv.reader(inputfile)
	spamwriter = csv.writer(outputfile)
	restaurantNameArray = []
	startRowCount = len(finishedList)
	currentRowCount = 0
	print startRowCount
	for row in spamreader:
		currentRowCount +=1
		#if len(row) == 6:
		cleanrow = []
		restaurantName = row[0]
		address = row[4]
		if address in finishedList and currentRowCount < startRowCount:
			print "finished"
		else:
			restaurantNameArray.append(restaurantName)
			for item in row:
				cleanItem = item.strip()
				#cleanItem = re.sub('(' + '|'.join(chars.keys()) + ')', replace_chars, cleanItem)
				cleanrow.append(cleanItem)
			address = row[4]
			coordinates = geocodeRestaurants(address)
			cleanrow.append(coordinates)
			print address,coordinates
			
			#print cleanrow
			spamwriter.writerow(cleanrow)
			
finishedAddresses = geocodedAddresses()					
cleanRestaurants(finishedAddresses)		
