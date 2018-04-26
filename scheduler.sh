#!/bin/bash
while [ true ]; do
 sleep 30
 echo 'Ran twitter publisher'
 ./publishers/twitter.js
done