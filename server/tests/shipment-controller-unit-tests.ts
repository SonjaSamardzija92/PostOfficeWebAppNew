process.env.NODE_ENV = "test";
import request from "supertest";
import { expect } from "chai";
import { sequelize } from "../src/config/db";
import app from "../src/app";
import { PostOffice } from "../src/models/commonModels";

describe("ShipmentController", () => {
  const postData = {
    shipmentNumber: "11000",
    status: "Delivered",
    type: "Letter",
    weightCategory: "Less than 1kg",
    actualWeight: 1,
    originZipCode: '11000',
    destinationZipCode: '11000'
  };
  before(async () => {
    await sequelize.sync({ force: true });

    await PostOffice.create({
      zipCode: "11000",
      name: "Belgrade Post Office",
      address: "Nemanjina 4",
    });

    await PostOffice.create({
      zipCode: "21000",
      name: "Novi Sad Post Office",
      address: "Bulevar Oslobođenja 1",
    });
  });

  describe("POST /shipments", () => {
    it("should create a new shipment", async () => {
      const response = await request(app).post("/shipments").send(postData);

      expect(response.status).to.equal(201);
    });

    it("should not allow duplicate shipmentNumber", async () => {
      await request(app).post("/shipments").send(postData);

      const response = await request(app).post("/shipments").send(postData);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(
        "Shipment with shipmentNumber 11000 already exists",
      );
    });
  });

  describe("GET /shipments", () => {
    it("should return a list of shipments", async () => {
      const response = await request(app)
        .get("/shipments");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });
});
