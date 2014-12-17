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
import operator
cambridge = "cambridge_reviews.csv"
boston = "boston_reviews.csv"
brookline = "brookline_reviews.csv"
somerville = "somerville_reviews.csv"
overall = "reviews_coordinates_distance.csv"
reviews = "crunchbase_addnosize.csv"
restaurants = "restaurant_info_clean_nodups.csv"

def buildSubwayStopsList():
	file = open(overall, "r")
	reader = csv.reader(file)
	subwayStops = {}
	for row in reader:
		subway = row[-1].split(",")
		#print subway
		for station in subway:
			#print station
			subwayStops[station] = subwayStops.get(station,0)+1
	return subwayStops
#sorted_x = sorted(buildSubwayStopsList().items(), key=operator.itemgetter(1))
#print sorted_x

topStops = ["Aquarium Station","Government Center Station","North Station","Haymarket Station", "Back Bay Station"]

def buildReviewsbySubway():
	file = open(overall,"r")
	reader = csv.reader(file)
	for station in topStops:
		file.seek(0)
		print station
		writeToFile = open("subway_split/"+station+".csv","w")
		writer = csv.writer(writeToFile)
		for row in reader:
			stations = row[-1]
			if station in stations:
				writer.writerow(row)
		
		
buildReviewsbySubway()
	
	
