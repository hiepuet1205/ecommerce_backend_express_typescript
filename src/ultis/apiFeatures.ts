import { Model, FindOptions, Op, ModelCtor } from 'sequelize';

class APIFeatures<T extends Model<any, any>> {
  private model: ModelCtor<T>; // Sử dụng ModelCtor để chỉ định kiểu của model
  private query: FindOptions;
  private queryString: any;

  constructor(model: ModelCtor<T>, queryString: any) {
    this.model = model;
    this.queryString = queryString;
    this.query = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const conditions: any = {};

    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        const value = queryObj[key];
        if (typeof value === "object" && value.gt) {
          conditions[key] = {
            [Op.gt]: parseInt(value.gt, 10),
          };
        } else {
          conditions[key] = value;
        }
      }
    }

    this.query.where = conditions;

    // // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // this.query.where = JSON.parse(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').map((field: string) => field.trim());
      this.query.order = sortBy.map((field: any) => [field, 'ASC']);
    } else {
      this.query.order = [['createdAt', 'DESC']];
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').map((field: string) => field.trim());
      this.query.attributes = fields;
    } else {
      this.query.attributes = { exclude: ['__v'] };
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const offset = (page - 1) * limit;

    this.query.limit = limit;
    this.query.offset = offset;

    return this;
  }

  async exec() {
    return this.model.findAll(this.query);
  }
}

export default APIFeatures;
