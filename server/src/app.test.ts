import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { JsonStateStore } from "./store.js";

let directory = "";

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "tela-de-sala-"));
});
afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

describe("API Express", () => {
  it("responde ao health check", async () => {
    const app = createApp(
      new JsonStateStore(path.join(directory, "state.json")),
    );
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("retorna um estado limpo sem dados mockados na inicialização", async () => {
    const app = createApp(
      new JsonStateStore(path.join(directory, "state.json")),
    );
    const response = await request(app).get("/api/state");
    expect(response.status).toBe(200);
    expect(response.body.school.schoolName).toBe("");
    expect(response.body.lesson.title).toBe("");
    expect(response.body.agenda).toEqual([]);
    expect(response.body.notices).toEqual([]);
    expect(response.body.tasks).toEqual([]);
    expect(response.body.birthdays).toEqual([]);
  });

  it("inicializa e persiste o estado", async () => {
    const app = createApp(
      new JsonStateStore(path.join(directory, "state.json")),
    );
    const initial = await request(app).get("/api/state");
    expect(initial.status).toBe(200);
    const changed = {
      ...initial.body,
      revision: initial.body.revision + 1,
      lastUpdated: new Date().toISOString(),
      school: { ...initial.body.school, classroomName: "8º Ano B" },
    };
    const saved = await request(app).put("/api/state").send(changed);
    expect(saved.status).toBe(200);
    const readAgain = await request(app).get("/api/state");
    expect(readAgain.body.school.classroomName).toBe("8º Ano B");
  });
});
