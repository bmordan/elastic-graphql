const elasticsearch = require('elasticsearch')
const peopleData = require('./people.json')
const organisationData = require('./organisations.json')

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
})

const people = [];
const organisations = [];

peopleData.forEach(row => {
  const { id, ...restData } = row;
  people.push({
    index: {
      _index: 'demo_user', 
      _type: 'demo_user', 
      _id: id
    }
  }, restData);
})

organisationData.forEach(row => {
  row.createdAt = new Date();
  
  const {id, ...restData} = row;
 
  organisations.push({
    index: {
      _index: 'demo_org',
      _type: 'demo_org',
      _id: id
    }
  }, restData)
})

client
  .bulk({
    index: 'demo_user',
    type: 'demo_user',
    body: people
  })
  .then(() => {
    console.log('People successfully seeded!')
  })

client
  .bulk({
    index: 'demo_org',
    type: 'demo_org',
    body: organisations
  })
  .then(() => {
    console.log('Organisations successfully seeded!')
  })