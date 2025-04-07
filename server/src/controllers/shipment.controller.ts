import { Request, Response } from "express";
import { PostOffice, Shipment } from "../models/commonModels";
import { Op } from "sequelize";
import { ShipmentFilters } from "../models/models";

export class ShipmentController {
  public async createShipment(req: Request, res: Response): Promise<void> {
    try {
      const shipmentData = req.body;
      shipmentData.weightCategory = this.assignWeightCategory(
        shipmentData.actualWeight,
      );

      const newShipment = await Shipment.create(shipmentData);

      res.status(201).json({
        message: "Shipment created successfully",
        shipment: newShipment,
      });
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  public async getShipments(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query as ShipmentFilters;
      const whereClause = this.setWhereClause(filters);
      console.log(whereClause);

      const { rows: shipments } = await Shipment.findAndCountAll({
        where: whereClause,
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json(shipments);
    } catch (error) {
      console.error("Error while getting shipment:", error);
      res.status(500).json({ error: "Failed to get shipments" });
    }
  }

  public async deleteShipment(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;
      await Shipment.destroy({ where: { shipmentNumber: shipmentNumber } });
      res.status(200).json({ message: "Shipment deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shipment" });
    }
  }

  public async updateShipment(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;
      const shipmentData = req.body;
      const existingShipment = await Shipment.findByPk(shipmentNumber);
      if (!existingShipment) {
        res.status(404).json({ message: "Shipment not found" });
        return;
      }
      console.log(shipmentData);
      await existingShipment.update(shipmentData);
      res.status(200).json({
        message: "Shipment updated",
        shipment: existingShipment,
      });
    } catch (error) {
      console.error("Error updating shipment:", error);
      res.status(500).json({ error: "Failed to update shipment" });
    }
  }

  public async getShipmentByID(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;
      const existingShipment = await Shipment.findOne({
        where: { shipmentNumber },
      });

      if (!existingShipment) {
        res.status(404).json({ error: "Shipment not found" });
      } else {
        res.status(200).json(existingShipment);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to shipment" });
    }
  }

  private assignWeightCategory(actualWeight: number): string {
    if (actualWeight < 1) {
      return "Less than 1kg";
    } else if (actualWeight >= 1 && actualWeight <= 5) {
      return "Between 1kg and 5kg";
    } else {
      return "More than 5kg";
    }
  }

  private setWhereClause(filters: ShipmentFilters): any {
    const whereClause: any = {};
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.weightCategory) {
      whereClause.weightCategory = filters.weightCategory;
    }
    if (filters.originZipCode) {
      whereClause.originZipCode = filters.originZipCode;
    }
    if (filters.shipmentNumber) {
      whereClause.shipmentNumber = filters.shipmentNumber;
    }
    if (filters.destinationZipCode) {
      whereClause.destinationZipCode = filters.destinationZipCode;
    }

    return whereClause;
  }
}
