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

def cleanRestaurants():
	inputfile = open("restaurant_info_clean_2.csv","r")
	spamreader = csv.reader(inputfile)
	
	outputfile = open("restaurant_info_clean_nodups.csv", "w")
	spamwriter = csv.writer(outputfile)
	
	restaurantNameArray = []
	
	for row in spamreader:
		#if len(row) == 6:
		cleanrow = []
		restaurantName = row[0]
		if restaurantName not in restaurantNameArray:
			restaurantNameArray.append(restaurantName)
			for item in row:
				cleanItem = item.strip()
				cleanrow.append(cleanItem)
			print cleanrow
			spamwriter.writerow(cleanrow)
cleanRestaurants()