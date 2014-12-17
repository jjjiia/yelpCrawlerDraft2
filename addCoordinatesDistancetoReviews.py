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

reviewFile = "allReviews_cleaning_stage9.csv"
restaurantFile = "restaurants.csv"
userLocationsFile = "userLocations_clean1.csv"

def makeUserLocationDict():
	file = open(userLocationsFile, "r")
	reader = csv.reader(file)
	userLocations = {}
	for row in reader:
		#print row[0]
		userLocations[row[0]] = [row[1],row[2]]
	return userLocations

userLocationDict = makeUserLocationDict()


def makeRestaurantLocationDict():
	file = open(restaurantFile, "r")
	reader = csv.reader(file)
	restaurantLocations = {}
	for row in reader:
		restaurantLocations[row[0]]=[row[6],row[7]]
	restaurantLocations["delux-cafe-boston-2"]=["-71.072838","42.346465"]
	restaurantLocations["winsor-dim-sum-cafe-boston-2"]=["-71.060479","42.351231"]
	restaurantLocations["mohr-and-mcpherson-cafe-boston-4"]=["-71.065206","42.342800"]
	restaurantLocations["mana-escondido-cafe-boston-3"]=["-71.075784","42.341620"]
	#restaurantLocations["mana-escondido-cafe-boston-3"]=["-71.075784","42.341620"]
	restaurantLocations["cafe-jaffa-boston-2"]=["-71.084149","42.348873"]
	
	return restaurantLocations
restaurantLocationDict = makeRestaurantLocationDict()

def makeRestaurantAddressDict():
	file = open(restaurantFile, "r")
	reader = csv.reader(file)
	restaurantLocations = {}
	for row in reader:
		restaurantLocations[row[0]]=[row[4]]
	return restaurantLocations
restaurantAddressDict = makeRestaurantAddressDict()

def makeRestaurantSubwayDict():
	file = open(restaurantFile, "r")
	reader = csv.reader(file)
	restaurantLocations = {}
	for row in reader:
		print row
		restaurantLocations[row[0]]=[row[5]]
	return restaurantLocations
restaurantSubwayDict = makeRestaurantSubwayDict()
print restaurantSubwayDict

def addLocationsToReviews():
	file = open(reviewFile, "r")
	reader = csv.reader(file)
	rowNumber = 0
	writeToFile = open("reviews_coordinates_distance.csv","w")
	writer = csv.writer(writeToFile)
	
	notOkFile = open("reviews_noCoordinates.csv","w")
	notOkWriter = csv.writer(notOkFile)
	for row in reader:
		restaurant = row[0]
		userLocation = row[2]
		#print restaurant
		rowNumber +=1
		print rowNumber
#		if restaurant != "none" and userLocation != "none":
		if restaurantLocationDict.has_key(restaurant) and userLocationDict.has_key(userLocation) and restaurantAddressDict.has_key(restaurant):
			restaurantCoordinates = restaurantLocationDict[restaurant]
			userCoordinates = userLocationDict[userLocation]
			restaurantAddress = restaurantAddressDict[restaurant]
			restaurantSubway = restaurantSubwayDict[restaurant]
			
			distance = calculateDistance(float(restaurantCoordinates[0]),float(restaurantCoordinates[1]),float(userCoordinates[0]),float(userCoordinates[1]))
			distance = int(distance*100)/100.0
			print distance
			#print row, userCoordinates,restaurantCoordinates, distance
			writer.writerow([row[0:-1],userCoordinates,restaurantCoordinates,distance,restaurantAddress,restaurantSubway])
		else:
			notOkWriter.writerow(row)
def calculateDistance(lat1, long1, lat2, long2):
	radiusMiles = 3963.1676
    # Convert latitude and longitude to 
    # spherical coordinates in radians.
	degrees_to_radians = math.pi/180.0
     
    # phi = 90 - latitude
	phi1 = (90.0 - lat1)*degrees_to_radians
	phi2 = (90.0 - lat2)*degrees_to_radians
     
    # theta = longitude
	theta1 = long1*degrees_to_radians
	theta2 = long2*degrees_to_radians
      
	cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + math.cos(phi1)*math.cos(phi2))
	arc = math.acos( cos )

    # Remember to multiply arc by the radius of the earth 
    # in your favorite set of units to get length.
	return arc*radiusMiles

addLocationsToReviews()
