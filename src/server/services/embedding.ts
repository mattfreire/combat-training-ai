
import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import {
  isHttpError,
} from '@axflow/models/shared';
import {OpenAIEmbedding} from '@axflow/models/openai/embedding'
import { env } from '~/env.mjs';

const address = env.MILVUS_ADDRESS;
const username = env.MILVUS_USERNAME;
const password = env.MILVUS_PASSWORD;

export const client = new MilvusClient({ address, username, password });

type Row = {
  repo_id: number;
  vector: number[];
  metadata: Record<string, unknown>;
}

export const embeddingService = {
  async createRepoCollection(collectionName: string) {
    const schema = [
      {
        name: 'id',
        description: 'ID field',
        data_type: DataType.Int64,
        is_primary_key: true,
        autoID: true,
      },
      {
        name: 'repo_id',
        description: 'Repository ID (FK)',
        data_type: DataType.Int64,
      },
      {
        name: 'file_id',
        description: 'File ID (FK)',
        data_type: DataType.Int64,
      },
      {
        name: 'content',
        description: 'File Content',
        data_type: DataType.VarChar,
        max_length: 1024,
      },
      {
        name: 'vector',  // is an embedding of the file content
        description: 'Vector field',
        data_type: DataType.FloatVector,
        dim: 1536,
      },
      {
        name: 'metadata',
        description: 'Metadata',
        data_type: DataType.JSON,
      },
    ]
    return await client.createCollection({
      collection_name: collectionName,
      fields: schema,
    });
  },
  async createIndex(collectionName: string) {
    await client.createIndex({
      collection_name: collectionName,
      field_name: 'vector',
      index_name: 'repo_index_hnsw',
      index_type: 'HNSW',
      params: { efConstruction: 10, M: 4 },
      metric_type: 'L2',
    });
  },
  async createPartition(collectionName: string, partitionName: string) {
    return await client.createPartition({
      collection_name: collectionName,
      partition_name: partitionName,
    });
  },
  async insert(collectionName: string, rows: Row[]) {
    return await client.insert({
      collection_name: collectionName,
      fields_data: rows,
    });
  },
  async loadCollection(collectionName: string) {
    return await client.loadCollectionSync({
      collection_name: collectionName,
    });
  },
  async search(collectionName: string, searchVector: number[], repoId: number) {
    return await client.search({
      collection_name: collectionName,
      vector: searchVector,
      // optionals
      filter: `repo_id == ${repoId}`, // optional, filter
      params: { nprobe: 64 }, // optional, specify the search parameters
      limit: 4, // optional, specify the number of nearest neighbors to return
      metric_type: 'L2', // optional, metric to calculate similarity of two vectors
      output_fields: ['content', 'file_id', 'repo_id'], // optional, specify the fields to return in the search results
    });
  },
  async createEmbedding(content: string): Promise<number[]> {
    try {
      const embeddingResponse = await OpenAIEmbedding.run({
        input: content,
        model: "text-embedding-ada-002"
      }, {
        apiKey: env.OPENAI_API_KEY,
      })
      return embeddingResponse.data[0]?.embedding ?? []
    } catch (error) {
      if (isHttpError(error)) {
        console.log(error.message, error.response, error.cause)
      }
      return []
    }
  },
  chunkText(text: string, chunkSize: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      result.push(text.slice(i, i + chunkSize));
    }
    return result;
  }
}