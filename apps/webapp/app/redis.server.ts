import { Cluster, Redis, type ClusterNode, type ClusterOptions } from "ioredis";
import { logger } from "./services/logger.server";

export type RedisWithClusterOptions = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  tlsDisabled?: boolean;
  clusterMode?: boolean;
  clusterOptions?: Omit<ClusterOptions, "redisOptions">;
  keyPrefix?: string;
};

export type RedisClient = Redis | Cluster;

export function createRedisClient(
  connectionName: string,
  options: RedisWithClusterOptions
): Redis | Cluster {
  if (options.clusterMode) {
    const nodes: ClusterNode[] = [
      {
        host: options.host,
        port: options.port,
      },
    ];

    logger.debug("Creating a redis cluster client", {
      connectionName,
      host: options.host,
      port: options.port,
    });

    return new Redis.Cluster(nodes, {
      ...options.clusterOptions,
      redisOptions: {
        connectionName,
        keyPrefix: options.keyPrefix,
        username: options.username,
        password: options.password,
        enableAutoPipelining: true,
        ...(options.tlsDisabled ? {} : { tls: {} }),
      },
    });
  } else {
    logger.debug("Creating a redis client", {
      connectionName,
      host: options.host,
      port: options.port,
    });

    return new Redis({
      connectionName,
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      enableAutoPipelining: true,
      ...(options.tlsDisabled ? {} : { tls: {} }),
    });
  }
}
