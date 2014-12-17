import math
import urllib
import urllib2
from PIL import Image
from StringIO import StringIO
import requests
import fileinput
import json
import csv
import time
import geopy

#!/usr/bin/python
# coding: utf8

import sys
import hashlib
import urllib
import hmac
import base64
import urlparse
import glob

GOOGLE_PRIVATE_KEY = "7HyrvDsrV6trC91E-E7F6xpjWjs="
GOOGLE_CLIENT_ID = "gme-mitisandt"

def return_signed(url_orig, privateKey = GOOGLE_PRIVATE_KEY ,client_id=GOOGLE_CLIENT_ID):
# adapted from https://developers.google.com/maps/documentation/business/webservices/auth
# Convert the URL string to a URL, which we can parse
# using the urlparse() function into path and query
# Note that this URL should already be URL-encoded
   
   url = urlparse.urlparse(url_orig)
   # We only need to sign the path+query part of the string
   urlToSign = url.path + "?" + url.query + "&client=" + client_id
   # Decode the private key into its binary format
   decodedKey = base64.urlsafe_b64decode(privateKey)
   
   # Create a signature using the private key and the URL-encoded
   # string using HMAC SHA1. This signature will be binary.
   signature = hmac.new(decodedKey, urlToSign, hashlib.sha1)
   
   # Encode the binary signature into base64 for use within a URL
   encodedSignature = base64.urlsafe_b64encode(signature.digest())
   originalUrl = url.scheme + "://" + url.netloc + urlToSign
   full_url= originalUrl + "&signature=" + encodedSignature
   return full_url

key1 = "AIzaSyBK0NFEiJvyYINdriuet8fObfWIEDwjNbM"
key2 = "AIzaSyBZnvqy9HEpG-LAQwm_AxDOegMciI9jgP4"
locator = geopy.geocoders.GoogleV3(api_key = key1)
#locator = geopy.geocoders.GoogleV3()


finishedCompanyList = []
#get addresses
def geocoder():
	with open('locations_outsideMA.csv', 'rb') as csvfile:
		spamreader = csv.reader(csvfile)
		csvfile.seek(0)
		next(spamreader, None)
		for row in spamreader:
			address = str(row[0])
			#print address
			#address = str(row[0])+","+str(row[1])
			#locator = geopy.geocoders.GoogleV3(client_id = GOOGLE_CLIENT_ID, secret_key=GOOGLE_PRIVATE_KEY)
			location = locator.geocode(address, exactly_one=True)
			time.sleep(1)
			if location!= None:
				lng = location.longitude
				lat = location.latitude
				print [address, lng, lat]
			else:
				print "no location "+ str(address)						
			
geocoder()