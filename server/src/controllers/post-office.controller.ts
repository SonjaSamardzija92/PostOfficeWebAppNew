import { Request, Response } from 'express';
import { PostOffice } from '../models/commonModels';
import { Op } from "sequelize";

export class PostOfficeController {

  public async createNewPostOffice(req: Request, res: Response): Promise<void> {
    const { zipCode } = req.body;
    try {
      const existingPostOffice = await PostOffice.findOne({
        where: { zipCode },
      });
      if (existingPostOffice) {
        res
          .status(400)
          .json({ error: `Post office with zip code ${zipCode} already exists` });
      } else {
        const postOffice = await PostOffice.create(req.body);
        res.status(201).json(postOffice);
      }
    } catch (error) {
      res.status(500).json({ error: `Failed to create post office with zip code ${zipCode}` });
    }
  };

  public async getPostOffices(req: Request, res: Response): Promise<void> {
    try {

      const { zipCode } = req.query;

      const whereClause: any = {};
      if (zipCode as string) {
        whereClause.zipCode = { [Op.iLike]: `%${zipCode}%` };
      }

      const { rows: postOffices } =
        await PostOffice.findAndCountAll({
          where: whereClause,
          order: [["createdAt", "ASC"]],
        });

      res.status(200).json(postOffices);
    } catch (error) {
      console.error("Error fetching post offices:", error);
      res.status(500).json({ error: "Failed to fetch post offices" });
    }
  }

  public async deletePostOffice(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode } = req.params;
      await PostOffice.destroy({ where: { zipCode: zipCode } });
      res.status(200).json({ message: "Post office deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post office" });
    }
  }

  public async updatePostOffice(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode } = req.params;
      const postOfficeData = req.body;
      const existingPostOffice = await PostOffice.findByPk(zipCode);
      if (!existingPostOffice) {
        res.status(404).json({ message: "Post office not found" });
        return;
      }
      await existingPostOffice.update(postOfficeData);
      res.status(200).json({ message: "Post office updated" });
    } catch (error) {
      console.error("Error updating post office:", error);
      res.status(500).json({ error: "Failed to update post office" });
    }
  }

  public async getPostOfficeByZipCode(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { zipCode } = req.params;
      const postOffice = await PostOffice.findOne({ where: { zipCode } });

      if (!postOffice) {
        res.status(404).json({ error: "Post office not found" });
      } else {
        res.status(200).json(postOffice);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post office" });
    }
  }
}