// Mapping obtained from ElasticSearch server
// If you have existed index in ES you may load mapping via
//   curl -X GET http://user:pass@localhost:9200/demo_org/_mapping?pretty=true
//   and then get subtree of returned document which contains
//   properties definitions (which looks like following data):

const demoOrgMapping = {
    properties: {
        location: {
            properties: {
                name: {
                    type: 'text',
                    fields: {
                        keyword: {
                            type: 'keyword',
                            ignore_above: 256
                        }
                    }
                },
                point: {
                    type: 'float'
                }
            }
        },
        name: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256
                }
            }
        },
        createdAt: {
            type: 'date',
        },
    }
}

const demoUserMapping = {
    properties: {
        name: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                },
            },
        },
        gender: {
            type: 'text',
        },
        birthday: {
            type: 'date',
        },
        position: {
            type: 'text',
        },
        relocation: {
            type: 'boolean',
        },
        salary: {
            properties: {
                currency: {
                    type: 'text',
                },
                total: {
                    type: 'double',
                },
            },
        },
        skills: {
            type: 'text',
        },
        languages: {
            type: 'keyword',
        },
        experience: {
            properties: {
                company: {
                    type: 'text',
                },
                description: {
                    type: 'text',
                },
                end: {
                    type: 'date',
                },
                position: {
                    type: 'text',
                },
                start: {
                    type: 'date',
                },
                tillNow: {
                    type: 'boolean',
                },
            },
        },
        createdAt: {
            type: 'date',
        },
    },
}

module.exports = {
    demoUserMapping,
    demoOrgMapping
}