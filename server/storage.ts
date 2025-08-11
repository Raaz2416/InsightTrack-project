import { type User, type InsertUser, type Dataset, type InsertDataset } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dataset operations
  getDataset(id: string): Promise<Dataset | undefined>;
  getAllDatasets(): Promise<Dataset[]>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  deleteDataset(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private datasets: Map<string, Dataset>;

  constructor() {
    this.users = new Map();
    this.datasets = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const dataset: Dataset = {
      id,
      name: insertDataset.name,
      fileName: insertDataset.fileName,
      fileSize: insertDataset.fileSize,
      rowCount: insertDataset.rowCount,
      columnCount: insertDataset.columnCount,
      columns: insertDataset.columns,
      data: insertDataset.data,
      uploadedAt: new Date(),
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async deleteDataset(id: string): Promise<boolean> {
    return this.datasets.delete(id);
  }
}

export const storage = new MemStorage();
