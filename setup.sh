#
# setup host url 
#
export HOST=http://admin:admin@localhost:5984

#
# delete existing db
#
curl -X DELETE $HOST/gawati

#
# create db
#

curl -X PUT $HOST/gawati

#
# create db reader user 
#
curl -X PUT $HOST/_users/org.couchdb.user:gwuser \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "gwuser",  "password": "password", "roles": [], "type": "user"}'
#
# create db admin user 
#
curl -X PUT $HOST/_users/org.couchdb.user:gwadmin \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "gwadmin", "password": "password", "roles": [], "type": "user"}'
#
# mark reader user as regular member 
#

curl -X PUT $HOST/gawati/_security \
     -u admin:admin \
     -H "Content-Type: application/json" \
     -d '{"admins": { "names": [], "roles": [] }, "members": { "names": ["gwuser"], "roles": [] } }'

curl -X PUT $HOST/gawati/_security \
     -u admin:admin \
     -H "Content-Type: application/json" \
     -d '{"admins": { "names": ["gwadmin"], "roles": [] }, "members": { "names": [], "roles": [] } }'