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
duplicates = []
latestDictionary = {}

#cambridge_zipcodes = ["02138" ]
#zipcodes =["02143","02144",
zipcodes =["02145","02138","02139", "02140","02141", "02142","02112","02113", "02114","02115", "02116", "02117", "02118", "02119", "02120", "02121", "02122", "02123", "02124", "02125", "02127", "02128", "02133", "02163", "02196", "02199", "02201", "02203", "02204", "02205"]
#http://www.yelp.com/search?find_desc=&find_loc=02139&ns=1&ls=a43b5ee92455361c#cflt=restaurants
serviceTypes = ["active", "arts","auto","education","eventservices","financialservices","health","homeservices","hotelstravel","localservices","nightlife","pets","professional","realestate","shopping"]
page = [35,4,92,71,87,76,38,84,91,7,13,86,40,19,43,37,44,8,62,66,10,28,31,90,32,93,33,20,53,63,79,34,22,74,80,11,98,52,78,54,56,59,68,1,72,17,50,36,2,95,29,96,6,61,81,24,97,48,14,65,3,51,88,23,57,69,46,77,26,41,85,27,55,73,75,45,82,49,15,16,25,12,47,60,5,42,18,94,70,39,99,64,89,58,67,21,30,9,83]
pageNumber = 0
i = 0
print "pages left: ",len(page)
print "zipcodes left: ",len(zipcodes)
outputfile = open("boston_beautysvcLinks.csv","a+")
spamwriter = csv.writer(outputfile)
#http://www.yelp.com/search?find_desc=&find_loc=02112&start=40&cflt=food

def download_yelpLinks(zipcode):
	art = []
	data = []
	page_count = len(page)
	#get list of restaurants  on page
	for i in range(page_count):
		
		pageNumber = page[i]
		print pageNumber,i
		base1 = "http://www.yelp.com/search?find_desc=&find_loc="
		base2 = "&start="
		pageIndex = str(pageNumber*10)
		base3 = "&cflt="
		#category = "food"
		category = "beautysvc"
		url = base1+zipcode+base2+pageIndex+base3+category
		print url
		soup = BeautifulSoup(urllib2.urlopen(url).read())
		x = soup.find_all("a",{"class":"biz-name"})
		#print x
		#if len(x)<1:
		#	return
		i = i+1
		for line in x:
			if "dredir?" not in str(line['href']):
				print line['href']
				
				spamwriter.writerow([line['href']])
			time.sleep(5)
			

for zipcode in zipcodes:
	print zipcode
	download_yelpLinks(zipcode)
