LAMBDA_URL=https://ibbxvzv9w8.execute-api.us-east-1.amazonaws.com/api/github/webhooks
SECRET=
TMP_DATA_FILE=/tmp/smoke.data
echo "{\"action\":\"test\"}" > $TMP_DATA_FILE
SIGN=$(openssl dgst -sha1 -hmac $SECRET $TMP_DATA_FILE | cut -d" " -f2)
echo -n "{\"action\":\"test\"}" | openssl dgst -sha1 -hmac $SECRET
echo $SIGN
echo $TMP_DATA_FILE
# curl --request POST --header "X-Hub-Signature: sha1=$SIGN" --header "X-Github-Event: test" --header "X-GitHub-Delivery: fake" --data-binary "@$TMP_DATA_FILE" $LAMBDA_URL
