echo 'Requesting all heroes'
http localhost:3333/heroes

echo 'Requesting one hero'
http localhost:3333/heroes/1

echo 'Create a new hero'
CREATE=$(http POST localhost:3333/heroes name="Batman" power="Super Strength" age=100)

echo $CREATE

echo 'Find hero by id'
ID=$(echo $CREATE | jq -r '.id')
http localhost:3333/heroes/$ID
