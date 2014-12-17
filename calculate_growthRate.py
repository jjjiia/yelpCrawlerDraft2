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

cambridge = "cambridge_reviews.csv"
boston = "boston_reviews.csv"
brookline = "brookline_reviews.csv"
somerville = "somerville_reviews.csv"
aquarium = "subway_split/Aquarium Station.csv"
overall = "reviews_coordinates_distance_noreview.csv"

def sortByYear(city):
	file = open(city, "r")
	reader = csv.reader(file)
	yearDictionary = {}
	for row in reader:
		#print row
		date = row[5]
		year = row[5].split("-")[0]
		#print year
		yearDictionary[year] = yearDictionary.get(year,0)+1
	print yearDictionary
	
print sortByYear(aquarium)


	