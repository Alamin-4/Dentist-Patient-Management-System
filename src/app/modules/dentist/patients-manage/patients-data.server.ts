import { readFile } from "fs/promises";
import { join } from "path";
import {
  buildPatientRecords,
  type DemoPatientSource,
  type PatientRecord,
} from "./patients-data";

async function readDemoPatientsFile() {
  const filePath = join(process.cwd(), "public/demo/patinets.json");
  const fileContents = await readFile(filePath, "utf8");
  return JSON.parse(fileContents) as DemoPatientSource[];
}

export async function loadPatientRecords(): Promise<PatientRecord[]> {
  const records = await readDemoPatientsFile();
  return buildPatientRecords(records);
}

export async function loadPatientRecordById(id: string) {
  const records = await loadPatientRecords();
  return records.find((record) => record.id === id) ?? null;
}
