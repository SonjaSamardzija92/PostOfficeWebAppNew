process.env.NODE_ENV = "test";
import request from "supertest";
import { expect } from "chai";
import { sequelize } from "../src/config/db";
import app from "../src/app";

describe("ShipmentController", () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  describe("POST /post-offices", () => {
    it("should create a new post offices", async () => {
      const postData = {
        zipCode: "11000",
        name: "Belgrade Post Office",
        address: "123 Address",
    };

      const response = await request(app).post("/post-offices").send(postData);

      expect(response.status).to.equal(201);
      expect(response.body.zipCode).to.equal("11000");
    });

    it("should not allow duplicate zip codes", async () => {
      const postData = { zipCode: "11000", name: "Belgrade Post Office" };

      await request(app).post("/post-offices").send(postData);

      const response = await request(app).post("/post-offices").send(postData);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(
        "Post office with zip code 11000 already exists",
      );
    });
  });

  describe("GET /post-offices", () => {
    it("should return a list of post offices", async () => {
      const response = await request(app)
        .get("/post-offices");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });
});
