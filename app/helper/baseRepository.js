class BaseRepository {
    /**@type {import('mongoose').Model<any>} */
    #model

    constructor(model) {
        if (!model) throw new Error('Model Not Defined!');
        this.#model = model;
    }

    async getById(id) {
        try {
            return await this.#model.findById(id).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async getByField(params) {
        try {
            return await this.#model.findOne(params).exec();
        } catch (error) {
            throw error;
        }
    }

    async getDistinctDocument(field, params) {
        try {
            let record = await this.#model.distinct(field, params);
            if (!record) return [];
            return record;
        } catch (e) {
            throw e;
        }
    }

    async getAllByField(params) {
        try {
            return await this.#model.find(params).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {import('mongoose').UpdateQuery<any>} data 
     * @param {import('mongoose').FilterQuery<any>} param 
     * @returns {Promise<import('mongoose').UpdateWriteOpResult>}
     */
    async updateByField(data, param) {
        try {
            let records = await this.#model.updateOne(param, data, {
                new: true
            });
            if (!records) {
                return null;
            }
            return records;
        } catch (error) {
            throw error;
        }
    }

    async updateAllByField(data, params) {
        try {
            let datas = await this.#model.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    }

    async updateById(data, id) {
        try {
            return await this.#model.findByIdAndUpdate(id, data, { new: true, upsert: true });
        } catch (error) {
            throw error;
        }
    }

    async save(data) {
        try {
            return await this.#model.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getCountByParam(params) {
        try {
            let records = await this.#model.countDocuments(params);
            return records;
        } catch (e) {
            throw (e);
        }
    }

    async getDistinctDocumentCount(field, params) {
        try {
            let count = await this.#model.distinct(field, params);
            if (!count) {
                return 0;
            }
            return count.length;
        } catch (e) {
            return e;
        }
    }

    async bulkWrite(data) {
        try {
            return await this.#model.bulkWrite(data);
        } catch (err) {
            throw err;
        }
    }

    async deleteById(id) {
        try {
            return await this.#model.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async inserMany(data){
        try {
            return await this.#model.insertMany(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseRepository;