{
  $set: {
    progressstatus: "processing"
  },
  $push: {
    updatedInfo: {
      updatedfield: ["progressstatus:processing"],
      updatedby: ObjectId("xyz890"),
      updatedAt: "2025-11-14T10:00:00Z"
    }
  }
}
logging the conditions-
console.log("FINAL CONDITIONS:", JSON.stringify(conditions, null, 2));
without search query its adding condition to or filed
FINAL CONDITIONS: {
  "$and": [
    {
      "isDeleted": false
    },
    {
      "$or": [
        {
          "title": {
            "$regex": "",
            "$options": "i"
          }
        }
      ]
    }
  ]
}
{
  docs: [
    {
      _id: new ObjectId('6919d11ade3fa347414a58a3'),
      title: 'tsyrdtufylkbv',
      content: 'shjk',
      status: 'active',
      updatedInfo: [],
      createdAt: 2025-11-16T13:26:50.968Z
    }
  ],
  totalDocs: 1,
  limit: 10,
  page: 1,
  totalPages: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null
}

with serach query
FINAL CONDITIONS: {
  "$and": [
    {
      "isDeleted": false
    },
    {
      "$or": [
        {
          "title": {
            "$regex": "tydtgdgdfgdfg",
            "$options": "i"
          }
        }
      ]
    }
  ]
}
FINAL CONDITIONS: {
  "$and": [
    {
      "isDeleted": false
    }
  ]
}