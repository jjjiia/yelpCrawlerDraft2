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

def splitLargeFile():
	inputfile = open("review_info_cleantest.csv","r")
	spamreader = csv.reader(inputfile)
	for row in spamreader:
		outputfile = open("split/review_split_part_"+str(fileIndex)+".csv","a+")
		spamwriter = csv.writer(outputfile)
		spamwriter.writerow(row)
		if index%20000 == 0:
			fileIndex +=1
			print "file: ",fileIndex
			print "line: ",index
			



file1 = "split/assembled_part1.csv"
file2 = "split/assembled_part2.csv"
def writeNewFile(file):
	inputfile = open(file,"r")
	spamreader = csv.reader(inputfile)

	index = 0
	fileIndex = 0
	
	for row in spamreader:
			spamwriter.writerow(row)
			

def writeAsCsv():
	inputfile = open("allReviews_cleaned_v1.csv","r")
	spamreader = csv.reader(inputfile)
	outputfile = open("allReviews_cleaned_v2_comma.csv","w")
	spamwriter = csv.writer(outputfile)
	needCleaningfile = open("needCleaning.csv","w")
	needCleaningWriter = csv.writer(needCleaningfile) 
	spamwriter.writerow(["restaurant","user","userLocation","friendCount","reviewCount","date","stars","review"])
	for row in spamreader:
		rowArray = str(row).split(";")
		#print rowArray
		if len(rowArray) <= 8:
			spamwriter.writerow(rowArray)
		else:
#			print len(rowArray)
			needCleaningWriter.writerow(rowArray)
writeAsCsv()