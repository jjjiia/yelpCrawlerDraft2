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
import hashlib
import hmac
import base64
import urlparse
import glob

inputfileLink = "allReviews_cleaning_stage9.csv"
restaurantfile = "restaurants.csv"
def makeReviewDictionary():
	inputfile = csv.reader(csvfile)

	dictionary = {}
	rowcount = 0
	for row in inputfile:
		rowcount +=1
		restaurant = row[0]
		#print restaurant
		if restaurant in dictionary.keys():
			dictionary[restaurant].append(row[1:-1])
		else:
			dictionary[restaurant]=[]
			dictionary[restaurant].append(row[1:-1])
		#if rowcount > 20:
	json.dumps(dictionary)
	with open('restaurants.txt', 'w') as outfile:
	  json.dump(dictionary, outfile)
	return dictionary

def makeRestaurantDictionary():
	inputfile = csv.reader(csvfile)

	dictionary = {}
	rowcount = 0
	for row in inputfile:
		rowcount +=1
		restaurant = row[0]
		name = row[1]
		reviewCount = row[2]
		ratingCount = row[3]
		address = row[4]
		transportation = row[5]
		lng = row[6]
		lat = row[7]
		
		print restaurant
		dictionary[restaurant]={}
		dictionary[restaurant]["name"]=name
		dictionary[restaurant]["transportation"]=transportation
		dictionary[restaurant]["lng"]=lng
		dictionary[restaurant]["lat"]=lat
		dictionary[restaurant]["rating"]=ratingCount
		dictionary[restaurant]["reviews"]=reviewCount
		
		#if rowcount > 20:
	json.dumps(dictionary)
	with open('restaurants.txt', 'w') as outfile:
	  json.dump(dictionary, outfile)
	return dictionary

def formatForCrossfilter():
	print "ok"

#with open(restaurantfile,'rb') as csvfile:
#	makeRestaurantDictionary()
			
#with open(inputfileLink,'rb') as csvfile:

	
def makeUserLocationDictionary():
	inputfile = csv.reader(csvfile)

	dictionary = {}
	rowcount = 0
	for row in inputfile:
		rowcount +=1
		userLocation = row[0]
		lng = row[1]
		lat = row[2]

		
		dictionary[userLocation]={}
		dictionary[userLocation]["lng"]=lng
		dictionary[userLocation]["lat"]=lat
		
		#if rowcount > 20:
	json.dumps(dictionary)
	with open('userLocations.txt', 'w') as outfile:
	  json.dump(dictionary, outfile)
	return dictionary
	
with open("userLocations_clean1.csv",'rb') as csvfile:
	makeUserLocationDictionary()
			