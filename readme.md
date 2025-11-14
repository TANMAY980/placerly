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