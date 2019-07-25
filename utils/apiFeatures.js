class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
    //1. filtering
        //build query
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'limit', 'fields', 'sort'];

        excludedFields.forEach(elem => delete queryObj[elem]);

        //2.advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        //QUERY
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
     // SORTING

     sort(){
         if (this.queryString.sort){
             const sortBy = this.queryString.sort.split(',').join(' ');
             this.query = this.query.sort(sortBy);
         }
         return this;
     }

     limitFields() {
         // 4. limiting fields
        if (this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
     }

     paginate() {
         const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
     }
}

module.exports = APIFeatures;