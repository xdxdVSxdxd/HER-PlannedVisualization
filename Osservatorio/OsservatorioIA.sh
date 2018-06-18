cd

cd Osservatorio

rm ../public_html/OsservatorioIA/data/sentiment.json
wget -O ../public_html/OsservatorioIA/data/sentiment.json "http://164.132.225.138/~hefotov/HEv3/api/getSentiment?researches=120&limit=20000&mode=month"

rm ../public_html/OsservatorioIA/data/sentimenttimelinepositive.json
wget -O ../public_html/OsservatorioIA/data/sentimenttimelinepositive.json "http://164.132.225.138/~hefotov/HEv3/api/getSentimentSeries?researches=120&limit=20000&mode=month&sentiment=positive"
rm ../public_html/OsservatorioIA/data/sentimenttimelinenegative.json
wget -O ../public_html/OsservatorioIA/data/sentimenttimelinenegative.json "http://164.132.225.138/~hefotov/HEv3/api/getSentimentSeries?researches=120&limit=20000&mode=month&sentiment=negative"
rm ../public_html/OsservatorioIA/data/sentimenttimelineneutral.json
wget -O ../public_html/OsservatorioIA/data/sentimenttimelineneutral.json "http://164.132.225.138/~hefotov/HEv3/api/getSentimentSeries?researches=120&limit=20000&mode=month&sentiment=neutral"


rm ../public_html/OsservatorioIA/data/topicTimeSeries.json
wget -O ../public_html/OsservatorioIA/data/topicTimeSeries.json "http://164.132.225.138/~hefotov/HEv3/api/getTopicTimeSeries?researches=120&mode=month&gt=5"

rm ../public_html/OsservatorioIA/data/hashtagCloud.json
wget -O ../public_html/OsservatorioIA/data/hashtagCloud.json "http://164.132.225.138/~hefotov/HEv3/api/getHashtagCloud?researches=120&limit=20000&language=XXX&mode=month"

rm ../public_html/OsservatorioIA/data/hashtagNetwork.json
wget -O ../public_html/OsservatorioIA/data/hashtagNetwork.json "http://164.132.225.138/~hefotov/HEv3/api/getHashtagNetwork?researches=120&mode=month&limit=500&sensibility=2"

rm ../public_html/OsservatorioIA/data/relations.json
wget -O ../public_html/OsservatorioIA/data/relations.json "http://164.132.225.138/~hefotov/HEv3/api/getRelations?researches=120&mode=month&limit=500&sensibility=3"
