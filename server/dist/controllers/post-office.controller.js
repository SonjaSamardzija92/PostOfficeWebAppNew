"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostOfficeController = void 0;
const commonModels_1 = require("../models/commonModels");
const sequelize_1 = require("sequelize");
class PostOfficeController {
    async createNewPostOffice(req, res) {
        const { zipCode } = req.body;
        try {
            const existingPostOffice = await commonModels_1.PostOffice.findOne({
                where: { zipCode },
            });
            if (existingPostOffice) {
                res
                    .status(400)
                    .json({ error: `Post office with zip code ${zipCode} already exists` });
            }
            else {
                const postOffice = await commonModels_1.PostOffice.create(req.body);
                res.status(201).json(postOffice);
            }
        }
        catch (error) {
            res.status(500).json({ error: `Failed to create post office with zip code ${zipCode}` });
        }
    }
    ;
    async getPostOffices(req, res) {
        try {
            const { zipCode } = req.query;
            const whereClause = {};
            if (zipCode) {
                whereClause.zipCode = { [sequelize_1.Op.iLike]: `%${zipCode}%` };
            }
            const { rows: postOffices } = await commonModels_1.PostOffice.findAndCountAll({
                where: whereClause,
                order: [["createdAt", "ASC"]],
            });
            res.status(200).json(postOffices);
        }
        catch (error) {
            console.error("Error fetching post offices:", error);
            res.status(500).json({ error: "Failed to fetch post offices" });
        }
    }
    async deletePostOffice(req, res) {
        try {
            const { zipCode } = req.params;
            await commonModels_1.PostOffice.destroy({ where: { zipCode: zipCode } });
            res.status(200).json({ message: "Post office deleted" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete post office" });
        }
    }
    async updatePostOffice(req, res) {
        try {
            const { zipCode } = req.params;
            const postOfficeData = req.body;
            const existingPostOffice = await commonModels_1.PostOffice.findByPk(zipCode);
            if (!existingPostOffice) {
                res.status(404).json({ message: "Post office not found" });
                return;
            }
            await existingPostOffice.update(postOfficeData);
            res.status(200).json({ message: "Post office updated" });
        }
        catch (error) {
            console.error("Error updating post office:", error);
            res.status(500).json({ error: "Failed to update post office" });
        }
    }
}
exports.PostOfficeController = PostOfficeController;
