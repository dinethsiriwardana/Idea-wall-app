// Simple in-memory Idea model
class Idea {
  constructor({ title, description, createdBy }) {
    this._id = Idea.generateId();
    this.title = title;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static generateId() {
    return (++Idea.lastId).toString();
  }
}

Idea.lastId = 0;

module.exports = Idea;
