const qs = require("qs");

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = qs.parse(queryString);
  }

  filter() {
    let queryString = JSON.stringify(this.queryString);
    queryString = queryString.replace(
      /\b(gt|gte|lte|lt)\b/gm,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ").trim();
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page;
    const limit = +this.queryString.limit;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
