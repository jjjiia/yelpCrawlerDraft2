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

restaurantListFile = open("restaurant_info.csv","a+")
restaurantListWriter = csv.writer(restaurantListFile)

reviewListFile = open("review_info.csv","a+")
reviewListWriter = csv.writer(reviewListFile)

#restaurantListWriter.writerow(["link","name","reviewCount","rating","address","coordinates","transit"])

def download_yelp(row):
	#download first page for restaurant info and overall rating
	firstpageurl= "http://www.yelp.com/biz/"+row
	print firstpageurl
	soup = BeautifulSoup(urllib2.urlopen(firstpageurl).read())
	name = soup.find("h1",{"class":"biz-page-title embossed-text-white"}).text.encode('utf-8').strip()
	reviewCount = soup.find("span",{"itemprop":"reviewCount"}).text.encode('utf-8').strip()
	rating = soup.find("meta",{"itemprop":"ratingValue"})
	address = soup.address.text.encode('utf-8').strip()
	#coordinates = soup.find("div",{"class":"lightbox-map hidden"})["location"]
	stations = soup.find_all("span",{"class":"transit-stop"})
	
	#start i at page 1 or review 40
	transit = []
	#print "name ", name.text.strip()
	#print "reviews ", reviews.text.strip()
	#print "rating ", rating
	#print "address ", address.text.strip()
	#print "station ", len(stations)
	for station in stations:
		#print station.text.strip()
		#print station
		text = station.strong.text.strip()
		#line = station.find("b",{"class":"transit-line inline-block no-text"}).text.strip()
		#distance = station.find("span",{"class":"transit-walking-details subtle-text nowrap"}).text.strip()
		transit.append(text)
		
	restaurantListWriter.writerow([row,name,reviewCount,rating,address,transit])

	page_count = 1000
	i = 1
	for i in range(page_count):
		#print i
		pageNumber = int(i)*20
		#print pageNumber
		url= "http://www.yelp.com/biz/"+row+"?start="+str(pageNumber)
		print url
		soup = BeautifulSoup(urllib2.urlopen(url).read())
		reviews = soup.find("div",{"class":"column column-alpha main-section"})
		li = reviews.find_all("div")
		print len(li)
		reviewListWriter.writerow([reviews])
		if len(reviews)==0:
			return
		for review in reviews:
			userPassportInfo = review.find("")
			userName = review.find("li",{"class":"user-name"})
			print len(userName)
			print userName.text.encode('utf-8').strip()
			userLocation = review.find("li",{"class":"user-location"})
			print len(userLocation)
			print userLocation.text.encode('utf-8').strip()
			userFriends = review.find("li",{"class":"friend-count"})
			print len(userFriends)
			print userFriends.text.encode('utf-8').strip()
			userReviewCount = review.find("li",{"class":"review-count"})
			print len(userReviewCount)
			print userReviewCount.text.encode('utf-8').strip()
			
			reviewDate = review.find("meta",{"itemprop":"datePublished"})
			reviewRating = review.find("meta",{"itemprop":"ratingValue"})
			reviewContent = review.find("p",{"itemprop":"description"}).text.encode('utf-8').strip()
		#	reviewListWriter.writerow([row,userName,userLocation,userFriends,userReviewCount,reviewDate,reviewRating,reviewContent])
			#print [userName,userLocation,userFriends,userReviewCount,reviewDate,reviewRating,reviewContent]
def checkForText(obj):
	length = len(obj)
	
#build finished array
def buildAlreadyFinishedArray():
	finishedList = []
	inputfile = open("finished.csv","r")
	spamreader = csv.reader(inputfile)
	for finishedlink in spamreader:
		finishedList.append(finishedlink)
	return finishedList

#build array of links to check against finished, call crawler
def buildLinksArray():
	#call build finished
	finishedLinksArray = buildAlreadyFinishedArray()
	linksArray = []
	inputfile = open("combinedlinks_nodups_test.csv","r")
	spamreader = csv.reader(inputfile)
	for row in spamreader:
			if row not in linksArray and row not in finishedLinksArray:
				linksArray.append(row)
				#call crawler?
				download_yelp(row[0])
				#save as finished

				finishedListFile = open("finished.csv","a+")
				finishedListWriter = csv.writer(finishedListFile)
				finishedListWriter.writerow(row)
				print "next"
				#break				
				
	return linksArray
	
print buildLinksArray()
