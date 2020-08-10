import supertest from "supertest";

import app from "../server";

const api = supertest(app);

describe("Testing ClassesController - Index - Missing Values", () => {
    test("Missing week_day:", async (done) => {
        await api
            .get("/classes")
            .query({ "time": "10:00", "subject": "Matemática"})
            .expect(400);

        done();
    });
});